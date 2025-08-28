import { testSupabaseConnection } from '../test-setup'

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {})
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

// Mock dotenv
jest.mock('dotenv', () => ({
  config: jest.fn()
}))

// Mock @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createBrowserClient: jest.fn()
}))

describe('Test Setup Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockConsoleLog.mockClear()
    mockConsoleError.mockClear()
    
    // Set up environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'
  })

  afterAll(() => {
    mockConsoleLog.mockRestore()
    mockConsoleError.mockRestore()
  })

  describe('testSupabaseConnection', () => {
    it('should return true when connection is successful', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn().mockResolvedValue({
            data: [{ count: 5 }],
            error: null
          })
        }))
      }

      const { createBrowserClient } = require('@supabase/ssr')
      createBrowserClient.mockReturnValue(mockSupabase)

      const result = await testSupabaseConnection()

      expect(result).toBe(true)
      expect(mockConsoleLog).toHaveBeenCalledWith('✅ Environment variables loaded')
      expect(mockConsoleLog).toHaveBeenCalledWith('🔗 Connecting to:', 'http://localhost:54321')
      expect(mockConsoleLog).toHaveBeenCalledWith('✅ Supabase connection successful')
      expect(mockConsoleLog).toHaveBeenCalledWith('📊 Database accessible, found', 1, 'records')
    })

    it('should return false when connection fails with error', async () => {
      const mockError = { message: 'Connection failed', code: 'CONNECTION_ERROR' }
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: mockError
          })
        }))
      }

      const { createBrowserClient } = require('@supabase/ssr')
      createBrowserClient.mockReturnValue(mockSupabase)

      const result = await testSupabaseConnection()

      expect(result).toBe(false)
      expect(mockConsoleLog).toHaveBeenCalledWith('✅ Environment variables loaded')
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Supabase connection failed:', mockError)
    })

    it('should return false when an exception is thrown', async () => {
      const mockError = new Error('Unexpected error')
      
      const { createBrowserClient } = require('@supabase/ssr')
      createBrowserClient.mockImplementation(() => {
        throw mockError
      })

      const result = await testSupabaseConnection()

      expect(result).toBe(false)
      expect(mockConsoleError).toHaveBeenCalledWith('❌ Setup test failed:', mockError)
    })

    it('should handle empty data response', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn().mockResolvedValue({
            data: [],
            error: null
          })
        }))
      }

      const { createBrowserClient } = require('@supabase/ssr')
      createBrowserClient.mockReturnValue(mockSupabase)

      const result = await testSupabaseConnection()

      expect(result).toBe(true)
      expect(mockConsoleLog).toHaveBeenCalledWith('📊 Database accessible, found', 0, 'records')
    })

    it('should handle null data response', async () => {
      const mockSupabase = {
        from: jest.fn(() => ({
          select: jest.fn().mockResolvedValue({
            data: null,
            error: null
          })
        }))
      }

      const { createBrowserClient } = require('@supabase/ssr')
      createBrowserClient.mockReturnValue(mockSupabase)

      const result = await testSupabaseConnection()

      expect(result).toBe(true)
      expect(mockConsoleLog).toHaveBeenCalledWith('📊 Database accessible, found', 0, 'records')
    })
  })
})