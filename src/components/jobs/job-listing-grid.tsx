import type { Job } from '@/types/database'
import { JobCard } from './job-card'
import { EmptyJobsState } from './empty-jobs-state'

interface JobListingGridProps {
  jobs: Job[]
}

export function JobListingGrid({ jobs }: JobListingGridProps) {
  if (jobs.length === 0) {
    return <EmptyJobsState />
  }

  return (
    <div className="mt-8">
      <div className="mb-6">
        <p className="text-sm text-gray-600">
          Showing {jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>
    </div>
  )
}