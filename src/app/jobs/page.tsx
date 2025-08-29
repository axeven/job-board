import { Metadata } from 'next'
import { jobsServer } from '@/lib/database/jobs'
import { JobsPageClient } from '@/components/jobs/jobs-page-client'
import { JobsPageHeader } from '@/components/jobs/jobs-page-header'
import { JobErrorState } from '@/components/jobs/job-error-state'
import { Navbar } from '@/components/layout/navbar'
import { urlParamsToFilters } from '@/lib/utils/url-filters'
import { generateJobsPageMetadata } from '@/lib/seo'

export const metadata: Metadata = generateJobsPageMetadata()

export default async function JobsPage({ 
  searchParams 
}: { 
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  try {
    // Await searchParams and parse initial filters from URL params
    const params = await searchParams
    const urlSearchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        urlSearchParams.set(key, Array.isArray(value) ? value.join(',') : value)
      }
    })
    const initialFilters = urlParamsToFilters(urlSearchParams)
    
    // Get all jobs and available locations
    const [jobsResult, locationsResult] = await Promise.all([
      jobsServer.getAll(),
      jobsServer.getUniqueLocations()
    ])
    
    if (jobsResult.error) {
      throw new Error(jobsResult.error.message || 'Failed to load jobs')
    }

    // Extract unique locations from the results
    const uniqueLocations = [...new Set(
      (locationsResult.data || [])
        .map(item => item.location)
        .filter(Boolean)
    )].sort()

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <JobsPageHeader />
          </div>
        </div>
        
        <JobsPageClient 
          initialJobs={jobsResult.data || []}
          initialFilters={initialFilters}
          availableLocations={uniqueLocations}
        />
      </div>
    )
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <JobsPageHeader />
            <JobErrorState 
              error={error instanceof Error ? error.message : 'An unexpected error occurred. Please try again later.'}
            />
          </div>
        </div>
      </div>
    )
  }
}