'use client'

import Link from 'next/link'
import { JobCard } from './job-card'
import type { Tables } from '@/types/supabase'
import type { JobsPagination } from '@/lib/database/jobs'

type Job = Tables<'jobs'>

interface MyJobsListProps {
  jobs: Job[]
  pagination: JobsPagination
}

export function MyJobsList({ jobs, pagination }: MyJobsListProps) {
  return (
    <div className="space-y-6">
      {/* Jobs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
      
      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
          <div className="flex flex-1 justify-between sm:hidden">
            <PaginationButton
              href={getPaginationUrl(pagination.page - 1)}
              disabled={pagination.page <= 1}
              direction="prev"
            >
              Previous
            </PaginationButton>
            <PaginationButton
              href={getPaginationUrl(pagination.page + 1)}
              disabled={!pagination.hasMore}
              direction="next"
            >
              Next
            </PaginationButton>
          </div>
          
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.page - 1) * pagination.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <PaginationButton
                  href={getPaginationUrl(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  direction="prev"
                  className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </PaginationButton>
                
                {/* Page Numbers */}
                {getPageNumbers(pagination.page, Math.ceil(pagination.total / pagination.limit)).map((pageNum) => (
                  <PaginationButton
                    key={pageNum}
                    href={getPaginationUrl(pageNum)}
                    disabled={false}
                    active={pageNum === pagination.page}
                    className={
                      pageNum === pagination.page
                        ? "relative z-10 inline-flex items-center bg-blue-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                        : "relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    }
                  >
                    {pageNum}
                  </PaginationButton>
                ))}
                
                <PaginationButton
                  href={getPaginationUrl(pagination.page + 1)}
                  disabled={!pagination.hasMore}
                  direction="next"
                  className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </PaginationButton>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface PaginationButtonProps {
  href: string
  disabled: boolean
  children: React.ReactNode
  direction?: 'prev' | 'next'
  active?: boolean
  className?: string
}

function PaginationButton({ 
  href, 
  disabled, 
  children, 
  direction, 
  active = false,
  className 
}: PaginationButtonProps) {
  if (disabled) {
    return (
      <span className={className || "relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-300 bg-white border border-gray-300 cursor-default"}>
        {children}
      </span>
    )
  }

  return (
    <Link 
      href={href}
      className={className || `relative inline-flex items-center px-4 py-2 text-sm font-medium ${
        active 
          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  )
}

function getPaginationUrl(page: number): string {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    url.searchParams.set('page', page.toString())
    return url.pathname + url.search
  }
  return `?page=${page}`
}

function getPageNumbers(currentPage: number, totalPages: number): number[] {
  const pages: number[] = []
  const showPages = 5 // Number of page buttons to show
  
  let start = Math.max(1, currentPage - Math.floor(showPages / 2))
  let end = Math.min(totalPages, start + showPages - 1)
  
  // Adjust start if we're near the end
  if (end - start + 1 < showPages) {
    start = Math.max(1, end - showPages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}