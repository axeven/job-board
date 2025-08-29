import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  padding?: 'sm' | 'md' | 'lg'
  hoverable?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', padding = 'md', hoverable = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'bg-white transition-colors duration-base',
          
          // Variants
          {
            'shadow-sm border border-neutral-200': variant === 'default',
            'shadow-md border border-neutral-200': variant === 'elevated',
            'border-2 border-neutral-200 shadow-none': variant === 'outlined',
          },
          
          // Padding
          {
            'p-4': padding === 'sm',
            'p-6': padding === 'md',
            'p-8': padding === 'lg',
          },
          
          // Hoverable state
          hoverable && {
            'hover:shadow-md cursor-pointer': variant === 'default',
            'hover:shadow-lg': variant === 'elevated',
            'hover:border-neutral-300': variant === 'outlined',
          },
          
          'rounded-base',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card sub-components for better composition
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('flex flex-col space-y-1.5 pb-6', className)}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold leading-none tracking-tight text-neutral-900">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-neutral-600">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  // Placeholder to avoid empty interface
  _placeholder?: never
}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('pt-0', className)}
        {...props}
      />
    )
  }
)

CardContent.displayName = 'CardContent'

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  // Placeholder to avoid empty interface
  _placeholder?: never
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('flex items-center pt-6', className)}
        {...props}
      />
    )
  }
)

CardFooter.displayName = 'CardFooter'