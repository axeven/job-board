import { NextRequest, NextResponse } from 'next/server'
import { middleware } from '../middleware'
import { createServerClient } from '@supabase/ssr'

// Mock @supabase/ssr
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn()
}))

// Mock next/server
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({
      cookies: {
        set: jest.fn()
      }
    })),
    redirect: jest.fn()
  }
}))

const mockCreateServerClient = createServerClient as jest.MockedFunction<typeof createServerClient>
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>

describe('Middleware', () => {
  let mockRequest: Partial<NextRequest>
  
  beforeEach(() => {
    // Set up environment variables
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'
    
    // Reset mocks
    jest.clearAllMocks()
    
    // Mock request object with essential properties
    mockRequest = {
      nextUrl: {
        pathname: '/',
        clone: jest.fn()
      } as any,
      cookies: {
        getAll: jest.fn(() => []),
        set: jest.fn()
      } as any
    }
  })

  it('should allow access to public routes without authentication', async () => {
    
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null }
        })
      }
    }
    
    mockCreateServerClient.mockReturnValue(mockSupabase)
    mockRequest.nextUrl!.pathname = '/public-page'
    
    const result = await middleware(mockRequest as NextRequest)
    
    expect(result).toBeDefined()
    expect(mockNextResponse.redirect).not.toHaveBeenCalled()
  })

  it('should redirect unauthenticated users from protected routes', async () => {
    
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null }
        })
      }
    }
    
    // Create a more detailed mock for the cloned URL
    const mockSearchParams = {
      set: jest.fn()
    }
    
    const mockClonedUrl = {
      pathname: '/auth/login',
      searchParams: mockSearchParams
    } as any
    
    mockCreateServerClient.mockReturnValue(mockSupabase)
    mockRequest.nextUrl!.pathname = '/dashboard'
    ;(mockRequest.nextUrl!.clone as jest.Mock).mockReturnValue(mockClonedUrl)
    
    await middleware(mockRequest as NextRequest)
    
    expect(mockNextResponse.redirect).toHaveBeenCalledWith(mockClonedUrl)
    expect(mockSearchParams.set).toHaveBeenCalledWith('redirectedFrom', '/dashboard')
  })

  it('should allow authenticated users to access protected routes', async () => {
    
    const mockSession = {
      user: { id: '123' },
      access_token: 'mock-token'
    }
    
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: mockSession }
        })
      }
    }
    
    mockCreateServerClient.mockReturnValue(mockSupabase)
    mockRequest.nextUrl!.pathname = '/dashboard'
    
    const result = await middleware(mockRequest as NextRequest)
    
    expect(result).toBeDefined()
    expect(mockNextResponse.redirect).not.toHaveBeenCalled()
  })

  it('should handle post-job route as protected', async () => {
    
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null }
        })
      }
    }
    
    const mockSearchParams = {
      set: jest.fn()
    }
    
    const mockClonedUrl = {
      pathname: '/auth/login',
      searchParams: mockSearchParams
    } as any
    
    mockCreateServerClient.mockReturnValue(mockSupabase)
    mockRequest.nextUrl!.pathname = '/post-job'
    ;(mockRequest.nextUrl!.clone as jest.Mock).mockReturnValue(mockClonedUrl)
    
    await middleware(mockRequest as NextRequest)
    
    expect(mockNextResponse.redirect).toHaveBeenCalledWith(mockClonedUrl)
  })

  it('should handle cookie operations correctly', async () => {
    let cookieConfig: any
    mockCreateServerClient.mockImplementation((url: string, key: string, config: any) => {
      cookieConfig = config
      return {
        auth: {
          getSession: jest.fn().mockResolvedValue({
            data: { session: null }
          })
        }
      }
    })
    
    mockRequest.nextUrl!.pathname = '/public-page'
    
    await middleware(mockRequest as NextRequest)
    
    // Test cookie operations
    expect(cookieConfig.cookies.getAll()).toEqual([])
    
    const testCookies = [
      { name: 'test', value: 'value', options: {} }
    ]
    
    expect(() => {
      cookieConfig.cookies.setAll(testCookies)
    }).not.toThrow()
  })

  it('should create server client with correct parameters', async () => {
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null }
        })
      }
    }
    
    mockCreateServerClient.mockReturnValue(mockSupabase)
    
    await middleware(mockRequest as NextRequest)
    
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
})