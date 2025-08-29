'use client'

import { forwardRef, useEffect } from 'react'
import { clsx } from 'clsx'
import { createPortal } from 'react-dom'

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose?: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnEscape?: boolean
  closeOnOverlayClick?: boolean
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ 
    className, 
    open, 
    onClose, 
    size = 'md',
    closeOnEscape = true,
    closeOnOverlayClick = true,
    children, 
    ...props 
  }, ref) => {
    
    // Handle escape key
    useEffect(() => {
      if (!open || !closeOnEscape) return
      
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose?.()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }, [open, closeOnEscape, onClose])
    
    // Prevent body scroll when modal is open
    useEffect(() => {
      if (open) {
        document.body.style.overflow = 'hidden'
        return () => {
          document.body.style.overflow = 'unset'
        }
      }
    }, [open])
    
    if (!open) return null
    
    const modalContent = (
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-neutral-900/50 transition-opacity duration-base"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        
        {/* Modal */}
        <div
          ref={ref}
          className={clsx(
            'relative bg-white rounded-base shadow-xl transition-all duration-base',
            'max-h-[90vh] overflow-y-auto',
            
            // Sizes
            {
              'w-full max-w-sm': size === 'sm',
              'w-full max-w-md': size === 'md',
              'w-full max-w-lg': size === 'lg',
              'w-full max-w-4xl': size === 'xl',
              'w-full h-full max-w-none max-h-none rounded-none': size === 'full',
            },
            
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    )
    
    // Use portal to render modal at document.body level
    if (typeof document !== 'undefined') {
      return createPortal(modalContent, document.body)
    }
    
    return null
  }
)

Modal.displayName = 'Modal'

// Modal sub-components for better composition
interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  showCloseButton?: boolean
  onClose?: () => void
}

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, title, subtitle, showCloseButton = true, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'flex items-start justify-between p-6 border-b border-neutral-200',
          className
        )}
        {...props}
      >
        <div className="flex-1">
          {title && (
            <h2 className="text-lg font-semibold text-neutral-900">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-neutral-600">
              {subtitle}
            </p>
          )}
          {children}
        </div>
        
        {showCloseButton && onClose && (
          <button
            type="button"
            className="ml-4 -mt-2 -mr-2 p-2 text-neutral-400 hover:text-neutral-600 transition-colors duration-base"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    )
  }
)

ModalHeader.displayName = 'ModalHeader'

interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  // Placeholder to avoid empty interface
  _placeholder?: never
}

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx('p-6', className)}
        {...props}
      />
    )
  }
)

ModalContent.displayName = 'ModalContent'

interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  // Placeholder to avoid empty interface
  _placeholder?: never
}

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          'flex items-center justify-end gap-3 p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-base',
          className
        )}
        {...props}
      />
    )
  }
)

ModalFooter.displayName = 'ModalFooter'

// Simple confirmation modal variant
interface ConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'default' | 'danger'
  loading?: boolean
}

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}: ConfirmModalProps) => {
  return (
    <Modal open={open} onClose={onClose} size="sm">
      <ModalHeader title={title} showCloseButton={false} />
      
      <ModalContent>
        {description && (
          <p className="text-sm text-neutral-600">
            {description}
          </p>
        )}
      </ModalContent>
      
      <ModalFooter>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-base hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
        
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className={clsx(
            'px-4 py-2 text-sm font-medium text-white rounded-base focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-base',
            {
              'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500': variant === 'default',
              'bg-error-600 hover:bg-error-700 focus:ring-error-500': variant === 'danger',
            }
          )}
        >
          {loading && (
            <svg className="w-4 h-4 mr-2 animate-spin inline" fill="none" viewBox="0 0 24 24">
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
          {confirmText}
        </button>
      </ModalFooter>
    </Modal>
  )
}