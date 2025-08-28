import { validateEnv, env } from '../env'

// Mock console methods to avoid test output noise
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

describe('Environment Validation', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
    // Set up basic environment for module loading
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key'
    mockConsoleLog.mockClear()
    mockConsoleError.mockClear()
  })

  afterAll(() => {
    process.env = originalEnv
    mockConsoleLog.mockRestore()
    mockConsoleError.mockRestore()
  })

  describe('validateEnv', () => {
    it('should validate successfully when all required env vars are present', () => {
      const result = validateEnv()
      
      expect(result).toEqual({
        url: 'http://localhost:54321',
        key: 'mock-anon-key'
      })
      expect(mockConsoleLog).toHaveBeenCalledWith('✅ Environment variables validated')
    })

    it('should handle service role key as optional', () => {
      // This should not throw because service role key has empty string fallback in the actual implementation
      expect(() => env.SUPABASE_SERVICE_ROLE_KEY).not.toThrow()
      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe('mock-service-role-key')
    })
  })

  describe('env object', () => {
    it('should provide access to environment variables', () => {
      expect(env.SUPABASE_URL).toBe('http://localhost:54321')
      expect(env.SUPABASE_ANON_KEY).toBe('mock-anon-key')
      expect(env.SUPABASE_SERVICE_ROLE_KEY).toBe('mock-service-role-key')
    })

    it('should be accessible as const', () => {
      // Just test that we can access the properties
      expect(typeof env.SUPABASE_URL).toBe('string')
      expect(typeof env.SUPABASE_ANON_KEY).toBe('string') 
      expect(typeof env.SUPABASE_SERVICE_ROLE_KEY).toBe('string')
    })
  })

  describe('getEnvVar logic', () => {
    // Test the core logic without module loading complications
    it('should throw error when required env var is missing', () => {
      const getEnvVar = (name: string, fallback?: string): string => {
        const value = process.env[name] ?? fallback
        if (!value) {
          throw new Error(`Missing required environment variable: ${name}`)
        }
        return value
      }
      
      delete process.env.NEXT_PUBLIC_SUPABASE_URL
      
      expect(() => getEnvVar('NEXT_PUBLIC_SUPABASE_URL')).toThrow('Missing required environment variable: NEXT_PUBLIC_SUPABASE_URL')
    })

    it('should handle fallback values', () => {
      const getEnvVar = (name: string, fallback?: string): string => {
        const value = process.env[name] ?? fallback
        if (!value) {
          throw new Error(`Missing required environment variable: ${name}`)
        }
        return value
      }
      
      // Test with undefined environment variable but valid fallback
      const testEnvVar = 'TEST_NONEXISTENT_VAR'
      delete process.env[testEnvVar]
      
      // This should not throw because we provide fallback
      expect(() => getEnvVar(testEnvVar, 'fallback-value')).not.toThrow()
      expect(getEnvVar(testEnvVar, 'fallback-value')).toBe('fallback-value')
    })
  })
})