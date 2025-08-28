import { GET } from '@/app/auth/callback/route'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Type for the mocked Supabase client
type MockSupabaseClient = {
  auth: {
    exchangeCodeForSession: jest.MockedFunction<(code: string) => Promise<{ error: { message: string } | null }>>
  }
}

// Mock the Supabase server client
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn()
}))

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    redirect: jest.fn()
  },
  NextRequest: jest.fn()
}))

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockNextResponse = NextResponse as jest.Mocked<typeof NextResponse>

// Create a mock client instance with proper typing
const mockClient: MockSupabaseClient = {
  auth: {
    exchangeCodeForSession: jest.fn()
  }
}

// Set up the mock to return our typed mock client
// Using 'unknown' first to allow the type conversion as suggested by TypeScript
mockCreateClient.mockResolvedValue(mockClient as unknown as Awaited<ReturnType<typeof mockCreateClient>>)

describe('Auth Callback Route', () => {
  function createMockRequest(url: string): NextRequest {
    return { url } as NextRequest
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to dashboard on successful code exchange', async () => {
    mockClient.auth.exchangeCodeForSession.mockResolvedValue({ error: null })

    const mockRequest = createMockRequest('http://localhost:3000/auth/callback?code=valid-code')

    await GET(mockRequest)

    expect(mockClient.auth.exchangeCodeForSession).toHaveBeenCalledWith('valid-code')
    expect(mockNextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/dashboard')
      })
    )
  })

  it('should redirect to custom next URL when provided', async () => {
    mockClient.auth.exchangeCodeForSession.mockResolvedValue({ error: null })

    const mockRequest = createMockRequest('http://localhost:3000/auth/callback?code=valid-code&next=/profile')

    await GET(mockRequest)

    expect(mockNextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/profile')
      })
    )
  })

  it('should redirect to login with error on failed code exchange', async () => {
    mockClient.auth.exchangeCodeForSession.mockResolvedValue({
      error: { message: 'Invalid code' }
    })

    const mockRequest = createMockRequest('http://localhost:3000/auth/callback?code=invalid-code')

    await GET(mockRequest)

    expect(mockNextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/auth/login')
      })
    )
  })

  it('should redirect to login when no code is provided', async () => {

    const mockRequest = createMockRequest('http://localhost:3000/auth/callback')

    await GET(mockRequest)

    expect(mockNextResponse.redirect).toHaveBeenCalledWith(
      expect.objectContaining({
        href: expect.stringContaining('/auth/login')
      })
    )
  })
})