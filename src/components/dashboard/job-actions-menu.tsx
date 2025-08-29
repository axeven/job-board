'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DeleteJobButton } from './delete-job-button'
import type { JobStatus } from '@/lib/database/jobs'
import type { Tables } from '@/types/supabase'

type Job = Tables<'jobs'> & { status?: JobStatus }

interface JobActionsMenuProps {
  job: Job
  isOpen: boolean
  onToggle: () => void
}

export function JobActionsMenu({ job, isOpen, onToggle }: JobActionsMenuProps) {
  const [isLoading, setIsLoading] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onToggle()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onToggle])

  const handleStatusChange = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    onToggle()
    
    try {
      // In a real implementation, this would be a server action
      // For now, we'll just refresh the page to simulate the change
      router.refresh()
    } catch (error) {
      console.error('Failed to update job status:', error)
      // Show error toast in real implementation
    } finally {
      setIsLoading(false)
    }
  }

  const handleDuplicate = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    onToggle()
    
    try {
      // In a real implementation, this would be a server action
      // For now, we'll just refresh the page
      router.refresh()
    } catch (error) {
      console.error('Failed to duplicate job:', error)
    } finally {
      setIsLoading(false)
    }
  }


  const getStatusToggleText = () => {
    switch (job.status) {
      case 'active':
        return 'Mark as Closed'
      case 'closed':
        return 'Mark as Active'
      case 'draft':
        return 'Publish Job'
      default:
        return 'Change Status'
    }
  }

  const getNextStatus = (): JobStatus => {
    switch (job.status) {
      case 'active':
        return 'closed'
      case 'closed':
        return 'active'
      case 'draft':
        return 'active'
      default:
        return 'active'
    }
  }


  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={onToggle}
        className="p-2 text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
        disabled={isLoading}
      >
        <span className="sr-only">Open job actions menu</span>
        {isLoading ? (
          <LoadingSpinner className="h-4 w-4" />
        ) : (
          <DotsVerticalIcon className="h-4 w-4" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Link
            href={`/dashboard/jobs/${job.id}/edit`}
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onToggle}
          >
            <PencilIcon className="mr-3 h-4 w-4" />
            Edit Job
          </Link>
          
          <Link
            href={`/jobs/${job.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={onToggle}
          >
            <ExternalLinkIcon className="mr-3 h-4 w-4" />
            View Public Page
          </Link>
          
          <button
            onClick={handleStatusChange}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <StatusIcon status={getNextStatus()} className="mr-3 h-4 w-4" />
            {getStatusToggleText()}
          </button>
          
          <button
            onClick={handleDuplicate}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <DuplicateIcon className="mr-3 h-4 w-4" />
            Duplicate Job
          </button>
          
          <hr className="my-1" />
          
          <DeleteJobButton 
            job={job}
            variant="menu-item"
            onDeleted={() => {
              onToggle()
              router.refresh()
            }}
          />
        </div>
      )}
    </div>
  )
}

function StatusIcon({ status, className }: { status: JobStatus; className?: string }) {
  switch (status) {
    case 'active':
      return <CheckCircleIcon className={`${className} text-green-500`} />
    case 'closed':
      return <XCircleIcon className={`${className} text-gray-500`} />
    case 'draft':
      return <ClockIcon className={`${className} text-yellow-500`} />
    default:
      return null
  }
}

function DotsVerticalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
    </svg>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function DuplicateIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
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