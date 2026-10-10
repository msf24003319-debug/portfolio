import 'server-only';
import { isSupabaseConfigured } from '@/lib/config';
import { createPublicSupabase } from '@/lib/supabase-server';

export async function getFeedback() {
  const configured = isSupabaseConfigured();
  if (!configured) return { entries: [], configured, failed: false };
  try {
    const { data, error } = await createPublicSupabase().from('feedback')
      .select('id, name, message, rating, created_at')
      .order('created_at', { ascending: false }).order('id').limit(50);
    if (error) console.error('Feedback query failed:', error.code);
    return { entries: data ?? [], configured, failed: Boolean(error) };
  } catch {
    return { entries: [], configured, failed: true };
  }
}
