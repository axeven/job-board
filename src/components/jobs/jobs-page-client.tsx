'use client'

import { useState, useMemo } from 'react'
import { Job } from '@/types/database'
import { useJobFilters, JobFilters } from '@/hooks/use-job-filters'
import { JobFiltersComponent } from './filters/job-filters'
import { JobListingGrid } from './job-listing-grid'

interface JobsPageClientProps {
  initialJobs: Job[]
  initialFilters: JobFilters
  availableLocations: string[]
}

export function JobsPageClient({ 
  initialJobs, 
  initialFilters, 
  availableLocations 
}: JobsPageClientProps) {
  const [jobs] = useState(initialJobs)
  const [loading] = useState(false)
  const { filters, updateFilters, resetFilters, activeFilterCount } = useJobFilters(initialFilters)

  // Filter jobs client-side for better performance with small datasets
  const filteredJobs = useMemo(() => {
    let filtered = jobs

    // Apply location filter
    if (filters.location.length > 0) {
      filtered = filtered.filter(job => 
        job.location && filters.location.includes(job.location)
      )
    }

    // Apply job type filter
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job => 
        job.job_type && filters.jobType.includes(job.job_type as 'Full-Time' | 'Part-Time' | 'Contract')
      )
    }

    // Apply search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      filtered = filtered.filter(job => 
        (job.title?.toLowerCase().includes(query)) ||
        (job.company?.toLowerCase().includes(query)) ||
        (job.description?.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [jobs, filters])


  return (
    <div className="min-h-screen bg-gray-50">
      <JobFiltersComponent
        filters={filters}
        onFiltersChange={updateFilters}
        availableLocations={availableLocations}
        activeFilterCount={activeFilterCount}
        onReset={resetFilters}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Filtering jobs...</span>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-neutral-600">
                {filteredJobs.length === 1 
                  ? '1 job found'
                  : `${filteredJobs.length} jobs found`
                }
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-sm">
                    (filtered from {jobs.length} total)
                  </span>
                )}
              </p>
            </div>
            
            <JobListingGrid jobs={filteredJobs} />
          </>
        )}
      </div>
    </div>
  )
}