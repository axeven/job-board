import { Job } from '@/types/database'
import { Navbar } from '@/components/layout/navbar'
import { JobDetailHeader } from './job-detail-header'
import { JobDetailContent } from './job-detail-content'
import { JobDetailActions } from './job-detail-actions'
import { JobDetailNavigation } from './job-detail-navigation'

interface JobDetailViewProps {
  job: Job
}

export function JobDetailView({ job }: JobDetailViewProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-white mt-4 rounded-lg shadow-sm">
        <article>
          <JobDetailHeader job={job} />
          <JobDetailContent job={job} />
          <JobDetailActions job={job} />
          <JobDetailNavigation />
        </article>
      </div>
    </div>
  )
}