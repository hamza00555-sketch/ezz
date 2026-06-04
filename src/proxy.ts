import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/auth/callback', '/invite'];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });
  const pathname = request.nextUrl.pathname;

  // DEMO_REVIEW ── visiting /demo-dashboard sets a 2-hour bypass cookie and
  // redirects to /dashboard. Remove this block + the isDemoReview check below
  // (and DemoReviewBanner from AppShell) to revoke demo access entirely.
  if (pathname === '/demo-dashboard') {
    const res = NextResponse.redirect(new URL('/dashboard', request.url));
    res.cookies.set('demo_review', '1', { maxAge: 7200, path: '/', sameSite: 'strict' });
    return res;
  }
  if (request.cookies.get('demo_review')?.value === '1') return supabaseResponse;
  // ── END DEMO_REVIEW ────────────────────────────────────────────────────────

  // Skip if Supabase env vars not configured (demo mode)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(toSet) {
          toSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          toSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url));
  }

  if (user && isPublic && !pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Authenticated user with no family → send to onboarding
  if (user && !pathname.startsWith('/onboarding') && !pathname.startsWith('/auth')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('family_group_id')
      .eq('id', user.id)
      .single();
    if (!profile?.family_group_id) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
};
