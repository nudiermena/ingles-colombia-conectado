import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL) {
  throw new Error('Missing env.VITE_SUPABASE_URL');
}

if (!/^https?:\/\/.+/i.test(SUPABASE_URL)) {
  throw new Error('env.VITE_SUPABASE_URL must include http(s)://');
}

if (!SUPABASE_ANON_KEY) {
  throw new Error('Missing env.VITE_SUPABASE_ANON_KEY (or env.VITE_SUPABASE_PUBLISHABLE_KEY)');
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});