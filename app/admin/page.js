import { redirect } from 'next/navigation';
import { isSupabaseConfigured } from '@/lib/config';
import { createServerSupabase } from '@/lib/supabase-server';
import AdminDashboard from '@/components/admin-dashboard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Admin — Saba Rasheed', robots: { index: false, follow: false } };

export default async function AdminPage() {
  if (!isSupabaseConfigured()) redirect('/admin/login');
  const supabase = await createServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect('/admin/login');
  if (user.app_metadata?.portfolio_admin !== true) redirect('/admin/login?denied=1');
  const [projects, experience, education, certificates] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }).order('id'),
    supabase.from('experience').select('*').order('order_id').order('id'),
    supabase.from('education').select('*').order('order_id').order('id'),
    supabase.from('certificates').select('*').order('order_id').order('id'),
  ]);
  return <AdminDashboard email={user.email} projects={projects.data ?? []} experience={experience.data ?? []} education={education.data ?? []} certificates={certificates.data ?? []} loadError={Boolean(projects.error || experience.error || education.error || certificates.error)} />;
}
