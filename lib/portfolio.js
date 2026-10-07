import 'server-only';
import { isSupabaseConfigured } from '@/lib/config';
import { createPublicSupabase } from '@/lib/supabase-server';
import { initialProjects, initialExperience } from '@/lib/content';

export async function getPortfolio() {
  if (!isSupabaseConfigured()) return { projects: initialProjects, experience: initialExperience, preview: true };
  const supabase = createPublicSupabase();
  const [projects, experience] = await Promise.all([
    supabase.from('projects').select('*').order('created_at', { ascending: false }).order('id'),
    supabase.from('experience').select('*').order('order_id').order('id'),
  ]);
  // Never substitute sample records for real empty tables or failed live queries.
  if (projects.error || experience.error) console.error('Portfolio query failed:', projects.error?.code, experience.error?.code);
  return { projects: projects.data ?? [], experience: experience.data ?? [], failed: Boolean(projects.error || experience.error), preview: false };
}
