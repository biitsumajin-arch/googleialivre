import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co')
);

// Graceful singleton client
let clientInstance: SupabaseClient;

if (isSupabaseConfigured) {
  clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
} else {
  // Provide a safe placeholder client that doesn't crash at load time
  // but indicates configuration status
  clientInstance = createClient(
    'https://placeholder-project.supabase.co',
    'placeholder-anon-key-abc123xyz456',
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      }
    }
  );
}

export const supabase = clientInstance;
