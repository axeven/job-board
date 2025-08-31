// Load environment variables first
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'

export async function testSupabaseConnection() {
  try {
    // Create Supabase client directly for testing
    const supabase = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    console.log('✅ Environment variables loaded')
    console.log('🔗 Connecting to:', process.env.NEXT_PUBLIC_SUPABASE_URL)

    // Test connection
    const { data, error } = await supabase.from('jobs').select('count')
    
    if (error) {
      console.error('❌ Supabase connection failed:', error)
      return false
    }
    
    console.log('✅ Supabase connection successful')
    console.log('📊 Database accessible, found', data?.length || 0, 'records')
    return true
  } catch (error) {
    console.error('❌ Setup test failed:', error)
    return false
  }
}

export async function cleanupTestData() {
  // Mock cleanup function for tests
  // In a real implementation, this would clean up test data from the database
  // For now, we'll just return a resolved promise since the tests are mocked
  return Promise.resolve()
}

// Test function that can be run from command line
if (typeof window === 'undefined' && require.main === module) {
  testSupabaseConnection()
    .then(success => {
      process.exit(success ? 0 : 1)
    })
    .catch(() => {
      process.exit(1)
    })
}