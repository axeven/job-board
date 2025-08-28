import { authServer } from '../server'

// Mock only server-side utilities for now
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    auth: {
      getUser: jest.fn(),
      getSession: jest.fn()
    }
  })
}))

describe('Auth Utilities', () => {
  // Skip client-side tests for now due to complex window mocking
  describe.skip('authClient', () => {
    // Client-side tests can be added when we implement actual auth forms
  })

  describe('authServer', () => {
    it('should get user from server', async () => {
      const mockClient = await require('@/lib/supabase/server').createClient()
      const mockUser = { id: '123', email: 'test@example.com' }
      
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      })

      const user = await authServer.getUser()
      
      expect(mockClient.auth.getUser).toHaveBeenCalled()
      expect(user).toEqual(mockUser)
    })

    it('should return null on server auth error', async () => {
      const mockClient = await require('@/lib/supabase/server').createClient()
      
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: { message: 'No session' }
      })

      const user = await authServer.getUser()
      
      expect(user).toBeNull()
    })

    it('should require auth and redirect if not authenticated', async () => {
      const mockClient = await require('@/lib/supabase/server').createClient()
      
      mockClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      })

      await expect(authServer.requireAuth()).rejects.toThrow('NEXT_REDIRECT')
    })
  })
})