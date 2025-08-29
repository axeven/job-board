import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'error' | 'success'
  label?: string
  error?: string
  success?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    size = 'md', 
    variant = 'default',
    label,
    error,
    success,
    helperText,
    disabled,
    required,
    id,
    ...props 
  }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const finalVariant = error ? 'error' : success ? 'success' : variant

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className={clsx(
              'block text-sm font-medium',
              disabled ? 'text-neutral-400' : 'text-neutral-700'
            )}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={clsx(
            'block w-full border transition-colors duration-base',
            'placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed',
            
            // Sizes
            {
              'px-3 py-1.5 text-sm rounded-sm': size === 'sm',
              'px-3.5 py-2 text-sm rounded-base': size === 'md',
              'px-4 py-3 text-base rounded-base': size === 'lg',
            },
            
            // Variants
            {
              'border-neutral-300 bg-white text-neutral-900 focus:border-primary-500 focus:ring-primary-500': finalVariant === 'default',
              'border-error-300 bg-error-50 text-error-900 focus:border-error-500 focus:ring-error-500': finalVariant === 'error',
              'border-success-300 bg-success-50 text-success-900 focus:border-success-500 focus:ring-success-500': finalVariant === 'success',
            },
            
            className
          )}
          {...props}
        />
        
        {(error || success || helperText) && (
          <div className="text-sm">
            {error && (
              <p className="text-error-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            {success && (
              <p className="text-success-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p className="text-neutral-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea variant
interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'error' | 'success'
  label?: string
  error?: string
  success?: string
  helperText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    size = 'md', 
    variant = 'default',
    label,
    error,
    success,
    helperText,
    disabled,
    required,
    id,
    rows = 3,
    ...props 
  }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const finalVariant = error ? 'error' : success ? 'success' : variant

    return (
      <div className="space-y-1">
        {label && (
          <label 
            htmlFor={inputId}
            className={clsx(
              'block text-sm font-medium',
              disabled ? 'text-neutral-400' : 'text-neutral-700'
            )}
          >
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}
        
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          rows={rows}
          className={clsx(
            'block w-full border transition-colors duration-base resize-vertical',
            'placeholder:text-neutral-400',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'disabled:bg-neutral-100 disabled:border-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed',
            
            // Sizes
            {
              'px-3 py-1.5 text-sm rounded-sm': size === 'sm',
              'px-3.5 py-2 text-sm rounded-base': size === 'md',
              'px-4 py-3 text-base rounded-base': size === 'lg',
            },
            
            // Variants
            {
              'border-neutral-300 bg-white text-neutral-900 focus:border-primary-500 focus:ring-primary-500': finalVariant === 'default',
              'border-error-300 bg-error-50 text-error-900 focus:border-error-500 focus:ring-error-500': finalVariant === 'error',
              'border-success-300 bg-success-50 text-success-900 focus:border-success-500 focus:ring-success-500': finalVariant === 'success',
            },
            
            className
          )}
          {...props}
        />
        
        {(error || success || helperText) && (
          <div className="text-sm">
            {error && (
              <p className="text-error-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
            {success && (
              <p className="text-success-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {success}
              </p>
            )}
            {helperText && !error && !success && (
              <p className="text-neutral-500">{helperText}</p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'