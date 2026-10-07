import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { isSupabaseConfigured, supabaseConfig } from '@/lib/config';

export async function proxy(request) {
  let response = NextResponse.next({ request });
  response.headers.set('Cache-Control', 'private, no-store');
  const loginPage = request.nextUrl.pathname === '/admin/login';
  function toLogin(denied = false) {
    const target = request.nextUrl.clone();
    target.pathname = '/admin/login'; target.search = denied ? '?denied=1' : '';
    const redirect = NextResponse.redirect(target);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    redirect.headers.set('Cache-Control', 'private, no-store');
    return redirect;
  }
  if (!isSupabaseConfigured()) return loginPage ? response : toLogin();
  const { url, key } = supabaseConfig();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        response.headers.set('Cache-Control', 'private, no-store');
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  // Verify the identity, rather than trusting a session read from cookies.
  const { data, error } = await supabase.auth.getClaims();
  // Redirect before rendering starts; Server Components and actions also check.
  if (!loginPage) {
    if (error || !data?.claims?.sub) return toLogin();
    if (data.claims.app_metadata?.portfolio_admin !== true) return toLogin(true);
  }
  return response;
}
export const config = { matcher: ['/admin/:path*'] };
