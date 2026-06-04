import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/signup', '/auth/callback', '/invite'];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

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
  const pathname = request.nextUrl.pathname;

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
