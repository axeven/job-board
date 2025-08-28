import { GET } from '@/app/auth/callback/route'
import { NextRequest } from 'next/server'

// Mock the Supabase server client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      exchangeCodeForSession: jest.fn()
    }
  })
}))

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn()
  },
  NextRequest: jest.fn()
}))

describe('Auth Callback Route', () => {
  function createMockRequest(url: string): NextRequest {
    return { url } as any
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to dashboard on successful code exchange', async () => {
    const { createClient } = require('@/lib/supabase/server')
    const { NextResponse } = require('next/server')
    
    const mockClient = await createClient()
    mockClient.auth.exchangeCodeForSession.mockResolvedValue({ error: null })

    const mockRequest = createMockRequest('http://localhost:3000/auth/callback?code=valid-code')

    await GET(mockRequest)

    expect(mockClient.auth.exchangeCodeForSession).toHaveBeenCalledWith('valid-code')
    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/dashboard')
      })
    )
  })

  it('should redirect to custom next URL when provided', async () => {
    const { createClient } = require('@/lib/supabase/server')
    const { NextResponse } = require('next/server')
    
    const mockClient = await createClient()
    mockClient.auth.exchangeCodeForSession.mockResolvedValue({ error: null })

    const mockRequest = createMockRequest('http://localhost:3000/auth/callback?code=valid-code&next=/profile')

    await GET(mockRequest)

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/profile')
      })
    )
  })

  it('should redirect to login with error on failed code exchange', async () => {
    const { createClient } = require('@/lib/supabase/server')
    const { NextResponse } = require('next/server')
    
    const mockClient = await createClient()
    mockClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: { message: 'Invalid code' }
    })

    const mockRequest = createMockRequest('http://localhost:3000/auth/callback?code=invalid-code')

    await GET(mockRequest)

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/auth/login')
      })
    )
  })

  it('should redirect to login when no code is provided', async () => {
    const { NextResponse } = require('next/server')

    const mockRequest = createMockRequest('http://localhost:3000/auth/callback')

    await GET(mockRequest)

    expect(NextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/auth/login')
      })
    )
  })
})