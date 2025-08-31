import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FormField } from '../form-field'
import { Button } from '../button'

describe('UI Components', () => {
  describe('FormField', () => {
    it('should render label and input', () => {
      render(<FormField label="Test Label" placeholder="Test placeholder" />)
      
      expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
    })

    it('should show error message when error prop is provided', () => {
      render(<FormField label="Test Label" error="Test error message" />)
      
      expect(screen.getByText('Test error message')).toBeInTheDocument()
      expect(screen.getByRole('alert')).toHaveTextContent('Test error message')
    })

    it('should show helper text when no error', () => {
      render(<FormField label="Test Label" helperText="Test helper text" />)
      
      expect(screen.getByText('Test helper text')).toBeInTheDocument()
    })

    it('should prioritize error over helper text', () => {
      render(
        <FormField 
          label="Test Label" 
          error="Test error" 
          helperText="Test helper text"
        />
      )
      
      expect(screen.getByText('Test error')).toBeInTheDocument()
      expect(screen.queryByText('Test helper text')).not.toBeInTheDocument()
    })

    it('should apply error styles when error is present', () => {
      render(<FormField label="Test Label" error="Test error" />)
      
      const input = screen.getByLabelText('Test Label')
      expect(input).toHaveClass('border-red-300', 'text-red-900')
    })
  })

  describe('Button', () => {
    it('should render button with default props', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-primary-600') // primary variant
    })

    it('should apply variant classes correctly', () => {
      render(<Button variant="outline">Outline Button</Button>)
      
      const button = screen.getByRole('button', { name: 'Outline Button' })
      expect(button).toHaveClass('border-neutral-300', 'bg-white', 'text-neutral-700')
    })

    it('should apply size classes correctly', () => {
      render(<Button size="lg">Large Button</Button>)
      
      const button = screen.getByRole('button', { name: 'Large Button' })
      expect(button).toHaveClass('px-6', 'py-3', 'text-base')
    })

    it('should show loading spinner when loading prop is true', () => {
      render(<Button loading>Loading Button</Button>)
      
      const button = screen.getByRole('button', { name: 'Loading Button' })
      expect(button).toBeDisabled()
      
      // Check for loading spinner SVG
      const spinner = button.querySelector('svg')
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('animate-spin')
    })

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled Button</Button>)
      
      const button = screen.getByRole('button', { name: 'Disabled Button' })
      expect(button).toBeDisabled()
    })

    it('should handle click events', () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Clickable Button</Button>)
      
      const button = screen.getByRole('button', { name: 'Clickable Button' })
      fireEvent.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should render as link when href is provided', () => {
      render(<Button href="/test">Link Button</Button>)
      
      const link = screen.getByRole('link', { name: 'Link Button' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/test')
    })
  })
})