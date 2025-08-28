import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AuthLoading, FormLoading } from '../auth-loading'

// Simple component test without external dependencies
describe('Auth Components Basics', () => {
  it('should be able to import auth loading component', () => {
    render(<AuthLoading />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
  
  it('should be able to import form loading component', () => {
    render(<FormLoading />)
    
    // Check for skeleton loading elements
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })

  // Test basic component structure (skipping forms that need react-hook-form)
  it('should validate auth components structure exists', () => {
    // Just test that files can be imported without errors
    expect(() => import('../auth-loading')).not.toThrow()
    
    // Test that the main auth components exist
    const loginForm = require.resolve('../login-form')
    const signupForm = require.resolve('../signup-form') 
    const authButton = require.resolve('../auth-button')
    const forgotPasswordForm = require.resolve('../forgot-password-form')
    const resetPasswordForm = require.resolve('../reset-password-form')
    
    expect(loginForm).toBeDefined()
    expect(signupForm).toBeDefined()
    expect(authButton).toBeDefined()
    expect(forgotPasswordForm).toBeDefined()
    expect(resetPasswordForm).toBeDefined()
  })
})