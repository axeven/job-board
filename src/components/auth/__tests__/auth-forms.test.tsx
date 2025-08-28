import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

// Mock the auth context
const mockRefreshSession = jest.fn()
const mockSignOut = jest.fn()

jest.mock('@/lib/auth/context', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signOut: mockSignOut,
    refreshSession: mockRefreshSession
  })
}))

// Mock Next.js router
const mockPush = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh
  }),
  useSearchParams: () => ({
    get: jest.fn(() => null)
  })
}))

// Mock auth client
const mockSignIn = jest.fn()
const mockSignUp = jest.fn()
const mockResetPassword = jest.fn()

jest.mock('@/lib/auth/utils', () => ({
  authClient: {
    signIn: mockSignIn,
    signUp: mockSignUp,
    resetPassword: mockResetPassword
  }
}))

describe('Auth Form Components', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('LoginForm', () => {
    it('should render login form with all fields', async () => {
      const { LoginForm } = await import('../login-form')
      
      render(<LoginForm />)
      
      expect(screen.getByRole('heading', { name: /sign in to your account/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /create a new account/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /forgot your password/i })).toBeInTheDocument()
    })

    it('should show validation errors for empty fields', async () => {
      const { LoginForm } = await import('../login-form')
      const user = userEvent.setup()
      
      render(<LoginForm />)
      
      const submitButton = screen.getByRole('button', { name: /sign in/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      })
    })

    it('should accept user input in form fields', async () => {
      const { LoginForm } = await import('../login-form')
      const user = userEvent.setup()
      
      render(<LoginForm />)
      
      const emailInput = screen.getByLabelText(/email address/i)
      const passwordInput = screen.getByLabelText(/password/i)
      
      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'password123')
      
      expect(emailInput).toHaveValue('test@example.com')
      expect(passwordInput).toHaveValue('password123')
    })
  })

  describe('SignupForm', () => {
    it('should render signup form with all fields', async () => {
      const { SignupForm } = await import('../signup-form')
      
      render(<SignupForm />)
      
      expect(screen.getByRole('heading', { name: /create your account/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByLabelText('Password')).toBeInTheDocument()
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /sign in to your existing account/i })).toBeInTheDocument()
    })

    it('should show password requirements', async () => {
      const { SignupForm } = await import('../signup-form')
      
      render(<SignupForm />)
      
      expect(screen.getByText(/must contain at least 6 characters with uppercase, lowercase, and number/i)).toBeInTheDocument()
    })

    it('should validate password confirmation', async () => {
      const { SignupForm } = await import('../signup-form')
      const user = userEvent.setup()
      
      render(<SignupForm />)
      
      const passwordInput = screen.getByLabelText('Password')
      const confirmPasswordInput = screen.getByLabelText(/confirm password/i)
      
      await user.type(passwordInput, 'Password123')
      await user.type(confirmPasswordInput, 'Different123')
      
      const submitButton = screen.getByRole('button', { name: /create account/i })
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument()
      })
    })
  })

  describe('ForgotPasswordForm', () => {
    it('should render forgot password form', async () => {
      const { ForgotPasswordForm } = await import('../forgot-password-form')
      
      render(<ForgotPasswordForm />)
      
      expect(screen.getByRole('heading', { name: /reset your password/i })).toBeInTheDocument()
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument()
    })
  })

  describe('AuthButton', () => {
    it('should render sign in and get started buttons when not authenticated', async () => {
      const { AuthButton } = await import('../auth-button')
      
      render(<AuthButton />)
      
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument()
    })
  })
})