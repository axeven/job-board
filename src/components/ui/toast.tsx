'use client'

import { forwardRef, useEffect } from 'react'
import { clsx } from 'clsx'

export interface ToastProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  onClose: (id: string) => void
}

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ id, type, title, description, duration = 5000, onClose, ...props }, ref) => {
    
    // Auto-dismiss logic
    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          onClose(id)
        }, duration)

        return () => clearTimeout(timer)
      }
    }, [id, duration, onClose])

    const getIcon = () => {
      switch (type) {
        case 'success':
          return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        case 'error':
          return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )
        case 'warning':
          return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        case 'info':
          return (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )
      }
    }

    return (
      <div
        ref={ref}
        className={clsx(
          'relative pointer-events-auto w-full max-w-md overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5',
          'transform transition-all duration-300 ease-in-out',
          'hover:shadow-xl'
        )}
        role="alert"
        {...props}
      >
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className={clsx(
                'rounded-full p-1',
                {
                  'text-success-600 bg-success-100': type === 'success',
                  'text-error-600 bg-error-100': type === 'error',
                  'text-warning-600 bg-warning-100': type === 'warning',
                  'text-info-600 bg-info-100': type === 'info',
                }
              )}>
                {getIcon()}
              </div>
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 leading-tight">
                {title}
              </p>
              {description && (
                <p className="mt-1 text-sm text-neutral-600 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
            
            <div className="ml-4 flex flex-shrink-0">
              <button
                type="button"
                className="inline-flex rounded-base bg-white text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                onClick={() => onClose(id)}
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Progress bar for auto-dismiss */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-200">
            <div 
              className={clsx(
                'h-full transition-all ease-linear',
                {
                  'bg-success-500': type === 'success',
                  'bg-error-500': type === 'error',
                  'bg-warning-500': type === 'warning',
                  'bg-info-500': type === 'info',
                }
              )}
              style={{
                animation: `toast-progress ${duration}ms linear forwards`,
              }}
            />
          </div>
        )}
      </div>
    )
  }
)

Toast.displayName = 'Toast'