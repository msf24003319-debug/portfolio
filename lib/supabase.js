'use client';
import { createBrowserClient } from '@supabase/ssr';
import { supabaseConfig } from '@/lib/config';

let client;
// Lazy initialization lets the portfolio preview render before setup.
export function createClient() {
  const { url, key } = supabaseConfig();
  if (!url || !key) throw new Error('Supabase is not configured. Follow README.md.');
  client ??= createBrowserClient(url, key);
  return client;
}
