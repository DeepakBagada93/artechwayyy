
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase credentials not found or are placeholders. The app will run without database functionality. Please update your .env.local file.');
}

export { supabase };
