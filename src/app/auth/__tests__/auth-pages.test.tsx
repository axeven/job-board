/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock Next.js navigation
const mockSearchParamsGet = jest.fn<string | null, [string]>(() => null)

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: mockSearchParamsGet
  }),
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn()
  })
}))

// Mock auth context
jest.mock('@/lib/auth/context', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signOut: jest.fn(),
    refreshSession: jest.fn()
  })
}))

// Mock auth client
jest.mock('@/lib/auth/client', () => ({
  authClient: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    resetPassword: jest.fn()
  }
}))

describe('Auth Pages Components', () => {
  describe('AuthError', () => {
    beforeEach(() => {
      mockSearchParamsGet.mockReturnValue(null)
    })

    it('should render nothing when no error', async () => {
      const { AuthError } = await import('@/components/auth/auth-error')
      
      const { container } = render(<AuthError />)
      expect(container.firstChild).toBeNull()
    })

    it('should render error message when error exists', async () => {
      mockSearchParamsGet.mockReturnValue('invalid_credentials')

      const { AuthError } = await import('@/components/auth/auth-error')
      
      render(<AuthError />)
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })

    it('should show resend link for email_not_confirmed error', async () => {
      mockSearchParamsGet.mockReturnValue('email_not_confirmed')

      const { AuthError } = await import('@/components/auth/auth-error')
      
      render(<AuthError />)
      expect(screen.getByText(/please check your email/i)).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /resend verification email/i })).toBeInTheDocument()
    })
  })
})