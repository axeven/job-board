import { Metadata } from 'next'
import { jobsServer } from '@/lib/database/jobs'
import { JobListingGrid } from '@/components/jobs/job-listing-grid'
import { JobsPageHeader } from '@/components/jobs/jobs-page-header'
import { JobErrorState } from '@/components/jobs/job-error-state'

export const metadata: Metadata = {
  title: 'Jobs - Job Board',
  description: 'Browse available job opportunities from top companies',
  keywords: ['jobs', 'careers', 'employment', 'opportunities'],
}

export default async function JobsPage() {
  try {
    const { data: jobs, error } = await jobsServer.getAll()
    
    if (error) {
      throw new Error(error.message || 'Failed to load jobs')
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <JobsPageHeader />
          <JobListingGrid jobs={jobs || []} />
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <JobsPageHeader />
          <JobErrorState 
            error={error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.'}
          />
        </div>
      </div>
    )
  }
}