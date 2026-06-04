import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const VAPID_PUBLIC_KEY  = Deno.env.get('VAPID_PUBLIC_KEY')!;
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY')!;
const SUPABASE_URL      = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

Deno.serve(async () => {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + 16 * 60 * 1000); // next 16 min

  // Find tasks due in this window
  const { data: tasks } = await supabase
    .from('tasks')
    .select('id, title, assigned_to, due_date')
    .gte('due_date', now.toISOString())
    .lte('due_date', windowEnd.toISOString())
    .in('status', ['accepted', 'in_progress', 'new']);

  if (!tasks || tasks.length === 0) {
    return new Response(JSON.stringify({ sent: 0 }), { status: 200 });
  }

  let sent = 0;
  for (const task of tasks) {
    if (!task.assigned_to) continue;

    const { data: subs } = await supabase
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth')
      .eq('user_id', task.assigned_to);

    if (!subs || subs.length === 0) continue;

    for (const sub of subs) {
      try {
        await sendPushNotification(sub, {
          title: 'تذكير: ' + task.title,
          body: 'الموعد يقترب — لا تنسى!',
          url: '/tasks',
          tag: `task-${task.id}`,
        });
        sent++;
      } catch (e) {
        console.error('push failed', e);
      }
    }
  }

  return new Response(JSON.stringify({ sent }), { status: 200 });
});

async function sendPushNotification(
  sub: { endpoint: string; p256dh: string; auth: string },
  payload: { title: string; body: string; url: string; tag: string }
) {
  // Build VAPID JWT (simplified — for production use web-push library)
  const audience = new URL(sub.endpoint).origin;
  const vapidHeaders = await buildVapidHeaders(audience);

  const body = JSON.stringify(payload);
  const resp = await fetch(sub.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': vapidHeaders.authorization,
      'Crypto-Key': vapidHeaders.cryptoKey,
      'Content-Type': 'application/json',
      'TTL': '3600',
    },
    body,
  });

  if (!resp.ok) {
    throw new Error(`Push failed: ${resp.status}`);
  }
}

async function buildVapidHeaders(audience: string) {
  const now = Math.floor(Date.now() / 1000);
  const claims = { aud: audience, exp: now + 43200, sub: 'mailto:admin@ezz.app' };

  const header = btoa(JSON.stringify({ typ: 'JWT', alg: 'ES256' })).replace(/=/g, '');
  const payload = btoa(JSON.stringify(claims)).replace(/=/g, '');
  const unsigned = `${header}.${payload}`;

  // Import private key
  const keyBytes = Uint8Array.from(atob(VAPID_PRIVATE_KEY.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey(
    'raw', keyBytes,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false, ['sign']
  );

  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    key,
    new TextEncoder().encode(unsigned)
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const token = `${unsigned}.${sigB64}`;

  return {
    authorization: `vapid t=${token},k=${VAPID_PUBLIC_KEY}`,
    cryptoKey: `p256ecdsa=${VAPID_PUBLIC_KEY}`,
  };
}
