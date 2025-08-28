import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// For use in Client Components - lazy initialization
let _supabaseClient: ReturnType<typeof createClient> | null = null
export const supabase = () => {
  if (!_supabaseClient) {
    _supabaseClient = createClient()
  }
  return _supabaseClient
}