'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteJobAction } from '@/lib/actions/job-actions'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'
import type { Tables } from '@/types/supabase'

type Job = Tables<'jobs'>

interface DeleteJobButtonProps {
  job: Job
  permanent?: boolean
  variant?: 'button' | 'menu-item'
  className?: string
  onDeleted?: () => void
}

export function DeleteJobButton({ 
  job, 
  permanent = false, 
  variant = 'button',
  className = '',
  onDeleted 
}: DeleteJobButtonProps) {
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteJobAction(job.id, permanent)
        
        if (result.errors || result.message?.includes('Failed')) {
          // Show error toast in real implementation
          console.error('Delete failed:', result.message)
        } else {
          // Success - call callback and close dialog
          onDeleted?.()
          setShowConfirmation(false)
          
          // Refresh the page to show updated job list
          router.refresh()
          
          // Show success message (toast in real implementation)
          console.log('Job deleted successfully')
        }
      } catch (error) {
        console.error('Delete error:', error)
      }
    })
  }

  const confirmationMessage = permanent
    ? `Are you sure you want to permanently delete "${job.title}" at ${job.company}? This action cannot be undone and will remove the job from all listings immediately.`
    : `Are you sure you want to delete "${job.title}" at ${job.company}? The job will be moved to trash and can be restored within 30 days.`

  const confirmText = permanent ? 'Delete Permanently' : 'Delete Job'
  const title = permanent ? 'Permanently Delete Job' : 'Delete Job'

  if (variant === 'menu-item') {
    return (
      <>
        <button
          onClick={() => setShowConfirmation(true)}
          disabled={isPending}
          className={`flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        >
          {isPending ? (
            <>
              <LoadingSpinner className="mr-3 h-4 w-4" />
              Deleting...
            </>
          ) : (
            <>
              <TrashIcon className="mr-3 h-4 w-4" />
              {permanent ? 'Delete Permanently' : 'Delete Job'}
            </>
          )}
        </button>
        
        <DeleteConfirmationDialog
          isOpen={showConfirmation}
          title={title}
          message={confirmationMessage}
          confirmText={confirmText}
          isLoading={isPending}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowConfirmation(true)}
        disabled={isPending}
        className={`inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isPending ? (
          <>
            <LoadingSpinner className="w-4 h-4 mr-2" />
            Deleting...
          </>
        ) : (
          <>
            <TrashIcon className="w-4 h-4 mr-2" />
            {permanent ? 'Delete Permanently' : 'Delete Job'}
          </>
        )}
      </button>
      
      <DeleteConfirmationDialog
        isOpen={showConfirmation}
        title={title}
        message={confirmationMessage}
        confirmText={confirmText}
        isLoading={isPending}
        onConfirm={handleDelete}
        onCancel={() => setShowConfirmation(false)}
      />
    </>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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