import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Chaves do Supabase não encontradas. Verifique o arquivo .env.local e reinicie o servidor.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);