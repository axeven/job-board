import { createClient } from '../supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Mock Next.js cookies function
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve({
    getAll: jest.fn(() => [
      { name: 'session', value: 'mock-session', options: {} }
    ]),
    set: jest.fn(),
    delete: jest.fn()
  }))
}))

// Mock the @supabase/ssr package
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn(() => ({
    from: jest.fn(),
    auth: jest.fn(),
    channel: jest.fn()
  }))
}))

const mockCreateServerClient = createServerClient as jest.MockedFunction<typeof createServerClient>
const mockCookies = cookies as jest.MockedFunction<typeof cookies>

describe('Supabase Server Client', () => {
  beforeEach(() => {
    // Set up environment variables for tests
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'
    
    // Reset mocks
    jest.clearAllMocks()
  })

  describe('createClient', () => {
    it('should create a server Supabase client', async () => {
      const client = await createClient()
      
      expect(client).toBeDefined()
      expect(client.from).toBeDefined()
      expect(client.auth).toBeDefined()
    })

    it('should use environment variables and cookies for configuration', async () => {
      await createClient()
      
      expect(mockCreateServerClient).toHaveBeenCalledWith(
        'http://localhost:54321',
        'mock-anon-key',
        expect.objectContaining({
          cookies: expect.objectContaining({
            getAll: expect.any(Function),
            setAll: expect.any(Function)
          })
        })
      )
    })

    it('should handle cookie operations correctly', async () => {
      let cookieConfig: any

      mockCreateServerClient.mockImplementation((url: string, key: string, config: any) => {
        cookieConfig = config
        return {
          from: jest.fn(),
          auth: jest.fn(),
          channel: jest.fn()
        }
      })

      await createClient()

      // Test getAll function
      const cookies = cookieConfig.cookies.getAll()
      expect(cookies).toEqual([
        { name: 'session', value: 'mock-session', options: {} }
      ])

      // Test setAll function
      const mockCookiesToSet = [
        { name: 'new-cookie', value: 'new-value', options: { httpOnly: true } }
      ]
      
      // Should not throw when setting cookies
      expect(() => {
        cookieConfig.cookies.setAll(mockCookiesToSet)
      }).not.toThrow()
    })

    it('should handle cookie setting errors gracefully', async () => {
      const mockCookieStore = {
        getAll: jest.fn(() => []),
        set: jest.fn(() => {
          throw new Error('Cannot set cookie in Server Component')
        })
      }
      mockCookies.mockResolvedValue(mockCookieStore)

      let cookieConfig: any

      mockCreateServerClient.mockImplementation((url: string, key: string, config: any) => {
        cookieConfig = config
        return {
          from: jest.fn(),
          auth: jest.fn(),
          channel: jest.fn()
        }
      })

      await createClient()

      // Test that setAll handles errors gracefully (try-catch block)
      const mockCookiesToSet = [
        { name: 'failing-cookie', value: 'value', options: {} }
      ]
      
      expect(() => {
        cookieConfig.cookies.setAll(mockCookiesToSet)
      }).not.toThrow()
    })
  })
})