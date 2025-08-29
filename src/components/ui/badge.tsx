import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', rounded = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center font-medium transition-colors duration-base',
          
          // Sizes
          {
            'px-1.5 py-0.5 text-xs': size === 'sm',
            'px-2 py-1 text-xs': size === 'md',
            'px-2.5 py-1.5 text-sm': size === 'lg',
          },
          
          // Border radius
          rounded ? 'rounded-full' : {
            'rounded-xs': size === 'sm',
            'rounded-sm': size === 'md',
            'rounded-base': size === 'lg',
          },
          
          // Variants
          {
            'bg-neutral-100 text-neutral-800 border border-neutral-200': variant === 'default',
            'bg-primary-100 text-primary-800 border border-primary-200': variant === 'primary',
            'bg-success-100 text-success-800 border border-success-200': variant === 'success',
            'bg-warning-100 text-warning-800 border border-warning-200': variant === 'warning',
            'bg-error-100 text-error-800 border border-error-200': variant === 'error',
            'bg-info-100 text-info-800 border border-info-200': variant === 'info',
          },
          
          className
        )}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// Dot variant for status indicators
interface DotBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

export const DotBadge = forwardRef<HTMLSpanElement, DotBadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center gap-1.5 font-medium text-neutral-900',
          
          // Sizes
          {
            'text-xs': size === 'sm',
            'text-sm': size === 'md',
            'text-base': size === 'lg',
          },
          
          className
        )}
        {...props}
      >
        <span
          className={clsx(
            'inline-block rounded-full',
            
            // Dot sizes
            {
              'h-1.5 w-1.5': size === 'sm',
              'h-2 w-2': size === 'md',
              'h-2.5 w-2.5': size === 'lg',
            },
            
            // Dot colors
            {
              'bg-neutral-400': variant === 'default',
              'bg-primary-500': variant === 'primary',
              'bg-success-500': variant === 'success',
              'bg-warning-500': variant === 'warning',
              'bg-error-500': variant === 'error',
              'bg-info-500': variant === 'info',
            }
          )}
        />
        {children}
      </span>
    )
  }
)

DotBadge.displayName = 'DotBadge'