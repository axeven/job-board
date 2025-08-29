'use client'

import { useEffect, useRef } from 'react'

interface DeleteConfirmationDialogProps {
  isOpen: boolean
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmationDialog({
  isOpen,
  title = 'Confirm Deletion',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
  onConfirm,
  onCancel
}: DeleteConfirmationDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  // Focus management and escape key handling
  useEffect(() => {
    if (isOpen) {
      // Focus the confirm button when dialog opens
      setTimeout(() => {
        confirmButtonRef.current?.focus()
      }, 100)

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onCancel()
        }
      }

      // Prevent background scroll
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = 'unset'
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        ref={dialogRef}
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        {/* Header */}
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 id="dialog-title" className="text-lg font-medium text-gray-900">
              {title}
            </h3>
          </div>
        </div>
        
        {/* Content */}
        <div className="mb-6">
          <p id="dialog-description" className="text-sm text-gray-700">
            {message}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading && (
              <LoadingSpinner className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

function ExclamationTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
  )
}

function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  )
}