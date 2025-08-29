'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { restoreJobAction, deleteJobAction } from '@/lib/actions/job-actions'
import { DeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog'
import type { Tables } from '@/types/supabase'

type Job = Tables<'jobs'> & { deleted_at: string }

interface DeletedJobsProps {
  jobs: Job[]
}

export function DeletedJobs({ jobs }: DeletedJobsProps) {
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleRestore = (jobId: string) => {
    startTransition(async () => {
      try {
        const result = await restoreJobAction(jobId)
        
        if (result.errors || result.message?.includes('Failed')) {
          console.error('Restore failed:', result.message)
        } else {
          console.log('Job restored successfully')
          router.refresh()
        }
      } catch (error) {
        console.error('Restore error:', error)
      }
    })
  }

  const handlePermanentDelete = (jobId: string) => {
    startTransition(async () => {
      try {
        const result = await deleteJobAction(jobId, true) // permanent = true
        
        if (result.errors || result.message?.includes('Failed')) {
          console.error('Permanent delete failed:', result.message)
        } else {
          console.log('Job permanently deleted')
          setShowPermanentDeleteConfirm(null)
          router.refresh()
        }
      } catch (error) {
        console.error('Permanent delete error:', error)
      }
    })
  }

  const formatDeletedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    })
  }

  const getDaysUntilPermanentDelete = (deletedDate: string) => {
    const date = new Date(deletedDate)
    const expiryDate = new Date(date.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 days
    const now = new Date()
    const diffTime = expiryDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return Math.max(0, diffDays)
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <TrashIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No deleted jobs</h3>
        <p className="text-gray-600">
          Jobs you delete will appear here for 30 days before being permanently removed.
        </p>
      </div>
    )
  }

  const jobToDelete = jobs.find(job => job.id === showPermanentDeleteConfirm)

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <InfoIcon className="h-5 w-5 text-yellow-400 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">
              Deleted jobs are kept for 30 days
            </h4>
            <p className="text-sm text-yellow-700 mt-1">
              You can restore jobs within 30 days. After that, they&apos;ll be permanently deleted.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => {
          const daysLeft = getDaysUntilPermanentDelete(job.deleted_at)
          const isExpiringSoon = daysLeft <= 7
          
          return (
            <div 
              key={job.id}
              className="bg-white border border-gray-200 rounded-lg p-6 opacity-75"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {job.title}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      Deleted
                    </span>
                  </div>
                  
                  <p className="text-base text-gray-600 font-medium mb-2">
                    {job.company}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      Deleted {formatDeletedDate(job.deleted_at)}
                    </span>
                    <span className={isExpiringSoon ? 'text-red-600 font-medium' : ''}>
                      {daysLeft > 0 
                        ? `${daysLeft} days left to restore`
                        : 'Will be permanently deleted soon'
                      }
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 ml-6">
                  <button
                    onClick={() => handleRestore(job.id)}
                    disabled={isPending}
                    className="inline-flex items-center px-3 py-1.5 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <>
                        <LoadingSpinner className="w-3 h-3 mr-1.5" />
                        Restoring...
                      </>
                    ) : (
                      <>
                        <RestoreIcon className="w-3 h-3 mr-1.5" />
                        Restore
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setShowPermanentDeleteConfirm(job.id)}
                    disabled={isPending}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon className="w-3 h-3 mr-1.5" />
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {jobToDelete && (
        <DeleteConfirmationDialog
          isOpen={!!showPermanentDeleteConfirm}
          title="Permanently Delete Job"
          message={`Are you sure you want to permanently delete "${jobToDelete.title}" at ${jobToDelete.company}? This action cannot be undone and the job will be removed forever.`}
          confirmText="Delete Forever"
          isLoading={isPending}
          onConfirm={() => handlePermanentDelete(jobToDelete.id)}
          onCancel={() => setShowPermanentDeleteConfirm(null)}
        />
      )}
    </div>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  )
}

function RestoreIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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