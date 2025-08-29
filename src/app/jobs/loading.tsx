import { JobListSkeleton } from '@/components/loading/job-list-skeleton'
import { Navbar } from '@/components/layout/navbar'

export default function JobsLoading() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Header skeleton */}
          <div className="mb-16">
            <div className="w-96 h-12 bg-neutral-200 rounded animate-pulse mx-auto mb-4" />
            <div className="w-128 h-6 bg-neutral-200 rounded animate-pulse mx-auto mb-2" />
            <div className="w-112 h-6 bg-neutral-200 rounded animate-pulse mx-auto" />
          </div>
        </div>
      </div>
      <JobListSkeleton />
    </div>
  )
}