'use client'

import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { Toast, ToastProps } from './toast'

interface ToastContainerProps {
  toasts: ToastProps[]
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
}

export function ToastContainer({ 
  toasts, 
  position = 'top-right' 
}: ToastContainerProps) {
  if (typeof document === 'undefined' || toasts.length === 0) {
    return null
  }

  return createPortal(
    <div
      className={clsx(
        'fixed z-50 flex flex-col gap-2 p-4 pointer-events-none',
        {
          'top-4 right-4': position === 'top-right',
          'top-4 left-4': position === 'top-left',
          'bottom-4 right-4': position === 'bottom-right',
          'bottom-4 left-4': position === 'bottom-left',
          'top-4 left-1/2 transform -translate-x-1/2': position === 'top-center',
          'bottom-4 left-1/2 transform -translate-x-1/2': position === 'bottom-center',
        }
      )}
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className={clsx(
            'transform transition-all duration-300 ease-in-out',
            'animate-in slide-in-from-top-full fade-in',
            {
              'animate-out slide-out-to-right-full fade-out': false, // Will be controlled by exit animation
            }
          )}
          style={{
            zIndex: 1000 - index, // Stack toasts properly
          }}
        >
          <Toast {...toast} />
        </div>
      ))}
    </div>,
    document.body
  )
}