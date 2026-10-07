'use server';
import { revalidatePath } from 'next/cache';
import { createServerSupabase } from '@/lib/supabase-server';
import { validateProject, validateExperience } from '@/lib/validation.mjs';

async function authorizedClient() {
  const supabase = await createServerSupabase();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user || user.app_metadata?.portfolio_admin !== true) throw new Error('Your admin session has expired. Please sign in again.');
  return supabase;
}

export async function saveRecord(kind, input, id = null) {
  try {
    if (!['projects', 'experience'].includes(kind)) throw new Error('Invalid record type.');
    if (id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) throw new Error('Invalid record ID.');
    const supabase = await authorizedClient();
    const payload = kind === 'projects' ? validateProject(input) : validateExperience(input);
    // RLS is enforced even if somebody bypasses these server-side checks.
    const query = id ? supabase.from(kind).update(payload).eq('id', id) : supabase.from(kind).insert(payload);
    const { error, data } = await query.select('id').single();
    if (error || !data) { console.error('Portfolio save failed:', error?.code); return { error: 'Unable to save. Check your admin access and database setup, then try again.' }; }
    revalidatePath('/'); revalidatePath(kind === 'projects' ? '/projects' : '/experience'); revalidatePath('/admin');
    return { success: true };
  } catch (error) { return { error: error.message || 'Unable to save this record.' }; }
}

export async function deleteRecord(kind, id) {
  try {
    if (!['projects', 'experience'].includes(kind) || !/^[0-9a-f-]{36}$/i.test(id)) throw new Error('Invalid record.');
    const supabase = await authorizedClient();
    const { error, data } = await supabase.from(kind).delete().eq('id', id).select('id').single();
    if (error || !data) return { error: 'Unable to delete this record. Refresh and try again.' };
    revalidatePath('/'); revalidatePath(kind === 'projects' ? '/projects' : '/experience'); revalidatePath('/admin');
    return { success: true };
  } catch (error) { return { error: error.message || 'Unable to delete this record.' }; }
}
