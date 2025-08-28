import { render, screen, waitFor, act } from '@testing-library/react'
import { useAuth, AuthProvider } from '../context'
import { useEffect } from 'react'
import '@testing-library/jest-dom'

// Create mock auth object that persists across calls
const mockAuth = {
  getSession: jest.fn().mockResolvedValue({
    data: { session: null },
    error: null
  }),
  onAuthStateChange: jest.fn((callback) => {
    // Simulate immediate call with no session
    callback('SIGNED_OUT', null)
    return {
      data: {
        subscription: {
          unsubscribe: jest.fn()
        }
      }
    }
  }),
  signOut: jest.fn().mockResolvedValue({ error: null }),
  refreshSession: jest.fn().mockResolvedValue({
    data: { session: null },
    error: null
  })
}

// Mock supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: jest.fn(() => ({
    auth: mockAuth
  }))
}))

// Test component that uses auth
function TestComponent() {
  const { user, loading, signOut, refreshSession } = useAuth()
  
  useEffect(() => {
    // Test that we can call auth functions
    if (!loading && !user) {
      refreshSession()
    }
  }, [loading, user, refreshSession])

  return (
    <div>
      <div data-testid="loading">{loading.toString()}</div>
      <div data-testid="user">{user ? 'authenticated' : 'not authenticated'}</div>
      <button onClick={signOut} data-testid="signout">Sign Out</button>
    </div>
  )
}

describe('AuthProvider and useAuth', () => {
  it('should provide auth context with initial state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    // Initially loading should be true, then false
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    expect(screen.getByTestId('user')).toHaveTextContent('not authenticated')
  })

  it('should throw error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleError.mockRestore()
  })

  it('should handle signOut function', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('false')
    })

    // Click sign out button wrapped in act
    await act(async () => {
      screen.getByTestId('signout').click()
    })

    expect(mockAuth.signOut).toHaveBeenCalled()
  })
})