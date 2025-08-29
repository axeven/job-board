import { Suspense } from 'react'
import { authServer } from '@/lib/auth/server'
import { jobsServer } from '@/lib/database/jobs'
import type { JobStatus } from '@/lib/database/jobs'
import { MyJobsList } from '@/components/dashboard/my-jobs-list'
import { JobFilters } from '@/components/dashboard/job-filters'
import { EmptyJobsState } from '@/components/dashboard/empty-jobs-state'

interface SearchParams {
  status?: 'all' | JobStatus
  sort?: 'newest' | 'oldest' | 'most_views'
  search?: string
  page?: string
}

export const dynamic = 'force-dynamic'

export default async function MyJobsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>
}) {
  const user = await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })
  
  // Await searchParams in Next.js 15
  const params = await searchParams
  
  // Parse search params with defaults
  const filters = {
    status: (params.status || 'all') as 'all' | JobStatus,
    sort: (params.sort || 'newest') as 'newest' | 'oldest' | 'most_views',
    search: params.search || ''
  }
  
  const pagination = {
    page: parseInt(params.page || '1'),
    limit: 12
  }
  
  // Fetch user's jobs with filters
  const result = await jobsServer.getUserJobsWithFilters(user.id, filters, pagination)
  const jobs = result.data || []
  const paginationInfo = result.pagination
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="mt-1 text-sm text-gray-600">
            {paginationInfo ? (
              `${paginationInfo.total} job${paginationInfo.total !== 1 ? 's' : ''} total`
            ) : (
              'Manage your job postings'
            )}
          </p>
        </div>
        
        {jobs.length > 0 && (
          <div className="mt-4 sm:mt-0">
            <a
              href="/post-job"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Post New Job
            </a>
          </div>
        )}
      </div>
      
      {/* Filters */}
      {jobs.length > 0 && (
        <Suspense fallback={<div className="h-16 bg-white rounded-lg border animate-pulse" />}>
          <JobFilters currentFilters={filters} />
        </Suspense>
      )}
      
      {/* Job List or Empty State */}
      {jobs.length === 0 && filters.status === 'all' && !filters.search ? (
        <EmptyJobsState />
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-4">
            <SearchIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 mb-4">
            {filters.search 
              ? `No jobs match your search for "${filters.search}"`
              : `No ${filters.status} jobs found`}
          </p>
          <a
            href="/dashboard/jobs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Clear filters
          </a>
        </div>
      ) : (
        <Suspense fallback={<JobsListSkeleton />}>
          <MyJobsList 
            jobs={jobs} 
            pagination={paginationInfo}
          />
        </Suspense>
      )}
    </div>
  )
}

function JobsListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="h-3 bg-gray-200 rounded w-full mb-2" />
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
          <div className="flex justify-between items-center">
            <div className="h-3 bg-gray-200 rounded w-1/4" />
            <div className="h-8 bg-gray-200 rounded w-20" />
          </div>
        </div>
      ))}
    </div>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}