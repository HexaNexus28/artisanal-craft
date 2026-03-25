import { createClient } from '@supabase/supabase-js';

// Standalone Supabase client for build-time usage (generateStaticParams, generateMetadata)
// Does NOT depend on cookies() — safe to call outside request scope
export function createStaticClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
