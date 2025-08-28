import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Cria o client só quando for chamado (no browser).
 * Evita erro no build estático do Next/GitHub Pages.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Não crie o client se as envs não existirem (ex.: durante o build)
  if (!url || !key) {
    // Não lance erro aqui para não quebrar o build; apenas loga.
    console.warn("Supabase env vars ausentes. Verifique NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    // Retornar algo inválido aqui quebraria depois; então só para segurança:
    // Você pode optar por lançar erro aqui se quiser falhar explicitamente no runtime.
  }

  client = createClient(url as string, key as string);
  return client;
}
