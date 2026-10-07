import LoginForm from '@/components/login-form';
import { isSupabaseConfigured } from '@/lib/config';
export const metadata = { title: 'Admin login — Saba Rasheed', robots: { index: false, follow: false } };
export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  return <main id="main" className="login-page"><a href="/" className="wordmark">saba<span>.</span></a><LoginForm configured={isSupabaseConfigured()} denied={params.denied === '1'} /><a href="/" className="muted-link">Back to portfolio</a></main>;
}
