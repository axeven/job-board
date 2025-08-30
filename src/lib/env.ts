function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  
  return value
}

export const env = {
  SUPABASE_URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVar('SUPABASE_SERVICE_ROLE_KEY', ''),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  AI_FEATURES_ENABLED: getEnvVar('NEXT_PUBLIC_AI_FEATURES_ENABLED', 'false') === 'true',
} as const

// Validate environment on startup
export function validateEnv() {
  try {
    // Access the environment variables to validate they exist
    const url = env.SUPABASE_URL
    const key = env.SUPABASE_ANON_KEY
    console.log('✅ Environment variables validated')
    return { url, key }
  } catch (error) {
    console.error('❌ Environment validation failed:', error)
    throw error
  }
}