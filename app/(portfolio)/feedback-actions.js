'use server';

import { revalidatePath } from 'next/cache';
import { isSupabaseConfigured } from '@/lib/config';
import { createPublicSupabase } from '@/lib/supabase-server';
import { validateFeedback } from '@/lib/feedback-validation.mjs';

export async function submitFeedback(previousState, formData) {
  if (!isSupabaseConfigured()) return { error: 'Feedback is not available yet. Please try again later.' };
  const validated = validateFeedback(formData);
  if (validated.error) return validated;
  try {
    const { error } = await createPublicSupabase().from('feedback').insert(validated.data);
    if (error) return { error: 'Your feedback could not be saved. Please try again later.' };
  } catch {
    return { error: 'Your feedback could not be saved. Please try again later.' };
  }
  revalidatePath('/');
  return { success: true };
}
