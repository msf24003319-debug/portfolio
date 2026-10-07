'use client';
import { useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import { createClient } from '@/lib/supabase';

export default function LoginForm({ configured, denied }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(denied ? 'This account does not have portfolio admin access.' : '');
  async function login(event) {
    event.preventDefault(); setBusy(true); setError('');
    const form = new FormData(event.currentTarget);
    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email: String(form.get('email')).trim(), password: String(form.get('password')) });
      if (authError) throw new Error('Unable to sign in. Check your email and password, then try again.');
      if (data.user?.app_metadata?.portfolio_admin !== true) { await supabase.auth.signOut(); throw new Error('This account does not have portfolio admin access.'); }
      // Full navigation ensures server authorization sees the newly written cookies.
      window.location.assign('/admin');
    } catch (err) { setError(err.message || 'Unable to sign in. Please try again.'); setBusy(false); }
  }
  return <section className="login-card"><div className="admin-icon"><LockKeyhole size={24} /></div><p className="eyebrow">YOUR WORKSPACE</p><h1>Welcome back.</h1><p className="form-description">Sign in to manage your portfolio.</p>{!configured && <p className="notice">Set the Supabase environment variables and run the SQL setup in README.md to enable admin login.</p>}<form onSubmit={login}><label>Email<input name="email" type="email" autoComplete="username" required maxLength={254} placeholder="you@example.com" disabled={!configured || busy} /></label><label>Password<input name="password" type="password" autoComplete="current-password" required maxLength={256} disabled={!configured || busy} /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button primary full-width" disabled={!configured || busy}>{busy ? 'Signing in…' : 'Sign in'}</button></form></section>;
}
