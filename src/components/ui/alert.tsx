import { forwardRef } from 'react'
import { clsx } from 'clsx'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  title?: string
  dismissible?: boolean
  onDismiss?: () => void
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', title, dismissible = false, onDismiss, children, ...props }, ref) => {
    const Icon = getAlertIcon(variant)
    
    return (
      <div
        ref={ref}
        role="alert"
        className={clsx(
          'relative rounded-base border p-4 transition-colors duration-base',
          
          // Variants
          {
            'bg-neutral-50 border-neutral-200 text-neutral-900': variant === 'default',
            'bg-success-50 border-success-200 text-success-900': variant === 'success',
            'bg-warning-50 border-warning-200 text-warning-900': variant === 'warning',
            'bg-error-50 border-error-200 text-error-900': variant === 'error',
            'bg-info-50 border-info-200 text-info-900': variant === 'info',
          },
          
          className
        )}
        {...props}
      >
        <div className="flex">
          <div className="flex-shrink-0">
            <Icon className={clsx(
              'h-5 w-5',
              {
                'text-neutral-400': variant === 'default',
                'text-success-400': variant === 'success',
                'text-warning-400': variant === 'warning',
                'text-error-400': variant === 'error',
                'text-info-400': variant === 'info',
              }
            )} />
          </div>
          
          <div className="ml-3 flex-1">
            {title && (
              <h3 className={clsx(
                'text-sm font-medium',
                {
                  'text-neutral-800': variant === 'default',
                  'text-success-800': variant === 'success',
                  'text-warning-800': variant === 'warning',
                  'text-error-800': variant === 'error',
                  'text-info-800': variant === 'info',
                }
              )}>
                {title}
              </h3>
            )}
            
            <div className={clsx(
              'text-sm',
              title ? 'mt-2' : '',
              {
                'text-neutral-700': variant === 'default',
                'text-success-700': variant === 'success',
                'text-warning-700': variant === 'warning',
                'text-error-700': variant === 'error',
                'text-info-700': variant === 'info',
              }
            )}>
              {children}
            </div>
          </div>
          
          {dismissible && (
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  type="button"
                  onClick={onDismiss}
                  className={clsx(
                    'inline-flex rounded-base p-1.5 transition-colors duration-base',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2',
                    {
                      'text-neutral-400 hover:bg-neutral-100 focus:ring-neutral-600': variant === 'default',
                      'text-success-400 hover:bg-success-100 focus:ring-success-600': variant === 'success',
                      'text-warning-400 hover:bg-warning-100 focus:ring-warning-600': variant === 'warning',
                      'text-error-400 hover:bg-error-100 focus:ring-error-600': variant === 'error',
                      'text-info-400 hover:bg-info-100 focus:ring-info-600': variant === 'info',
                    }
                  )}
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
)

Alert.displayName = 'Alert'

// Helper function to get the appropriate icon for each variant
function getAlertIcon(variant: string) {
  switch (variant) {
    case 'success': {
      const SuccessIcon = ({ className }: { className?: string }) => (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      )
      SuccessIcon.displayName = 'SuccessIcon'
      return SuccessIcon
    }
    
    case 'warning': {
      const WarningIcon = ({ className }: { className?: string }) => (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      )
      WarningIcon.displayName = 'WarningIcon'
      return WarningIcon
    }
    
    case 'error': {
      const ErrorIcon = ({ className }: { className?: string }) => (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      )
      ErrorIcon.displayName = 'ErrorIcon'
      return ErrorIcon
    }
    
    case 'info': {
      const InfoIcon = ({ className }: { className?: string }) => (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
      InfoIcon.displayName = 'InfoIcon'
      return InfoIcon
    }
    
    default: {
      const DefaultIcon = ({ className }: { className?: string }) => (
        <svg className={className} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
      DefaultIcon.displayName = 'DefaultIcon'
      return DefaultIcon
    }
  }
}