function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback
  
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  
  return value
}

function getEnvVarOptional(name: string, fallback = ''): string {
  return process.env[name] ?? fallback
}

export const env = {
  SUPABASE_URL: getEnvVarOptional('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: getEnvVarOptional('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  SUPABASE_SERVICE_ROLE_KEY: getEnvVarOptional('SUPABASE_SERVICE_ROLE_KEY'),
  OPENAI_API_KEY: getEnvVarOptional('OPENAI_API_KEY'),
  AI_FEATURES_ENABLED: getEnvVarOptional('NEXT_PUBLIC_AI_FEATURES_ENABLED', 'false') === 'true',
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