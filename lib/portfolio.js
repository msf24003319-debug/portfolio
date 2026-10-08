import 'server-only';
import { isSupabaseConfigured } from '@/lib/config';
import { createPublicSupabase } from '@/lib/supabase-server';
import { initialProjects, initialExperience, initialEducation } from '@/lib/content';

export async function getPortfolio() {
  if (!isSupabaseConfigured()) return { projects: initialProjects, experience: initialExperience, education: initialEducation, certificates: [], preview: true };
  const supabase = createPublicSupabase();
  const [projects, experience, education, certificates] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }).order('id'),
    supabase.from('experience').select('*').order('order_id').order('id'),
    supabase.from('education').select('*').order('order_id').order('id'),
    supabase.from('certificates').select('*').order('order_id').order('id'),
  ]);
  // Never substitute sample records for real empty tables or failed live queries.
  if (projects.error || experience.error || education.error || certificates.error) console.error('Portfolio query failed:', projects.error?.code, experience.error?.code, education.error?.code, certificates.error?.code);
  return { projects: projects.data ?? [], experience: experience.data ?? [], education: education.data ?? [], certificates: certificates.data ?? [], educationFailed: Boolean(education.error), certificatesFailed: Boolean(certificates.error), failed: Boolean(projects.error || experience.error || education.error || certificates.error), preview: false };
}
