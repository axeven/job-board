import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  as?: React.ElementType
  href?: string
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, as: Component = 'button', href, ...props }, ref) => {
    const FinalComponent = href ? 'a' : Component
    
    return (
      <FinalComponent
        ref={ref}
        href={href}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-colors duration-base',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Variants
          {
            'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500': variant === 'primary',
            'bg-neutral-600 text-white hover:bg-neutral-700 focus:ring-neutral-500': variant === 'secondary',
            'border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 focus:ring-primary-500': variant === 'outline',
            'text-neutral-700 hover:bg-neutral-100 focus:ring-primary-500': variant === 'ghost',
            'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500': variant === 'danger',
          },
          
          // Sizes
          {
            'px-3 py-1.5 text-sm rounded-sm': size === 'sm',
            'px-4 py-2 text-sm rounded-base': size === 'md',
            'px-6 py-3 text-base rounded-base': size === 'lg',
          },
          
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </FinalComponent>
    )
  }
)

Button.displayName = 'Button'