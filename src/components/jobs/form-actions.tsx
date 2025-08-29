'use client'

import { useFormStatus } from 'react-dom'
import { clsx } from 'clsx'
import type { ActionState } from '@/lib/actions/job-actions'

interface FormActionsProps {
  state?: ActionState
  submitText?: string
  showDraftButton?: boolean
  onDraft?: () => void
}

export function FormActions({ 
  state, 
  submitText = 'Post Job',
  showDraftButton = false,
  onDraft 
}: FormActionsProps) {
  const { pending } = useFormStatus()
  
  return (
    <div className="space-y-4">
      {state?.message && (
        <div className={clsx(
          "p-4 rounded-md border",
          state.errors 
            ? "bg-red-50 text-red-700 border-red-200" 
            : "bg-green-50 text-green-700 border-green-200"
        )}>
          <div className="flex">
            <div className="flex-shrink-0">
              {state.errors ? (
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{state.message}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        {showDraftButton && (
          <button
            type="button"
            onClick={onDraft}
            disabled={pending}
            className={clsx(
              "px-4 py-2 text-sm font-medium rounded-md transition-colors",
              "text-gray-700 bg-white border border-gray-300",
              "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Save as Draft
          </button>
        )}
        
        <button
          type="submit"
          disabled={pending}
          className={clsx(
            "px-6 py-2 text-sm font-medium text-white rounded-md transition-colors",
            "bg-blue-600 hover:bg-blue-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center space-x-2"
          )}
        >
          {pending && (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          <span>{pending ? 'Creating...' : submitText}</span>
        </button>
      </div>
    </div>
  )
}