'use client'

import Link from 'next/link'
import { useState } from 'react'
import { JobActionsMenu } from './job-actions-menu'
import { stripMarkdownFormatting } from '@/lib/utils/markdown-formatter'
import type { Tables } from '@/types/supabase'
import type { JobStatus } from '@/lib/database/jobs'

type Job = Tables<'jobs'> & { status?: JobStatus }

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const truncateDescription = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date unknown'
    
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

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-1.5" />
            Active
          </span>
        )
      case 'draft':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <span className="w-1.5 h-1.5 bg-yellow-600 rounded-full mr-1.5" />
            Draft
          </span>
        )
      case 'closed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
            <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-1.5" />
            Closed
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="p-6">
        {/* Header with status and actions */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            {job.status && getStatusBadge(job.status)}
          </div>
          <div className="relative">
            <JobActionsMenu 
              job={job}
              isOpen={isMenuOpen}
              onToggle={() => setIsMenuOpen(!isMenuOpen)}
            />
          </div>
        </div>
        
        {/* Job Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
            <Link 
              href={`/jobs/${job.id}`}
              className="hover:text-blue-600 transition-colors duration-200"
            >
              {job.title}
            </Link>
          </h3>
          <p className="text-base text-gray-600 font-medium mb-2">
            {job.company}
          </p>
          <p className="text-sm text-gray-500 flex items-center mb-3">
            <LocationIcon className="w-4 h-4 mr-1.5 text-gray-400" />
            {job.location}
          </p>
        </div>
        
        {/* Description */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {truncateDescription(stripMarkdownFormatting(job.description))}
          </p>
        </div>
        
        {/* Footer with stats and actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col space-y-1">
            <span className="text-xs text-gray-500">
              Posted {formatDate(job.created_at)}
            </span>
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500">
                <EyeIcon className="w-3 h-3 inline mr-1" />
                0 views
              </span>
              <span className="text-xs text-gray-500">
                <UserIcon className="w-3 h-3 inline mr-1" />
                0 applications
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              href={`/dashboard/jobs/${job.id}/edit`}
              className="text-sm text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              Edit
            </Link>
            <Link
              href={`/jobs/${job.id}`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              View →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}