import { NextRequest } from 'next/server'
import { middleware } from '../middleware'

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
    const { createServerClient } = require('@supabase/ssr')
    const { NextResponse } = require('next/server')
    
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null }
        })
      }
    }
    
    createServerClient.mockReturnValue(mockSupabase)
    mockRequest.nextUrl!.pathname = '/public-page'
    
    const result = await middleware(mockRequest as NextRequest)
    
    expect(result).toBeDefined()
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  it('should redirect unauthenticated users from protected routes', async () => {
    const { createServerClient } = require('@supabase/ssr')
    const { NextResponse } = require('next/server')
    
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
    
    createServerClient.mockReturnValue(mockSupabase)
    mockRequest.nextUrl!.pathname = '/dashboard'
    ;(mockRequest.nextUrl!.clone as jest.Mock).mockReturnValue(mockClonedUrl)
    
    await middleware(mockRequest as NextRequest)
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(mockClonedUrl)
    expect(mockSearchParams.set).toHaveBeenCalledWith('redirectedFrom', '/dashboard')
  })

  it('should allow authenticated users to access protected routes', async () => {
    const { createServerClient } = require('@supabase/ssr')
    const { NextResponse } = require('next/server')
    
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
    
    createServerClient.mockReturnValue(mockSupabase)
    mockRequest.nextUrl!.pathname = '/dashboard'
    
    const result = await middleware(mockRequest as NextRequest)
    
    expect(result).toBeDefined()
    expect(NextResponse.redirect).not.toHaveBeenCalled()
  })

  it('should handle post-job route as protected', async () => {
    const { createServerClient } = require('@supabase/ssr')
    const { NextResponse } = require('next/server')
    
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
    
    createServerClient.mockReturnValue(mockSupabase)
    mockRequest.nextUrl!.pathname = '/post-job'
    ;(mockRequest.nextUrl!.clone as jest.Mock).mockReturnValue(mockClonedUrl)
    
    await middleware(mockRequest as NextRequest)
    
    expect(NextResponse.redirect).toHaveBeenCalledWith(mockClonedUrl)
  })

  it('should handle cookie operations correctly', async () => {
    const { createServerClient } = require('@supabase/ssr')
    
    let cookieConfig: any
    createServerClient.mockImplementation((url: string, key: string, config: any) => {
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
    const { createServerClient } = require('@supabase/ssr')
    
    const mockSupabase = {
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: { session: null }
        })
      }
    }
    
    createServerClient.mockReturnValue(mockSupabase)
    
    await middleware(mockRequest as NextRequest)
    
    expect(createServerClient).toHaveBeenCalledWith(
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