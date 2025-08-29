import { Skeleton } from '@/components/ui'
import { JobCardSkeletonGrid } from './job-card-skeleton'

export function JobListSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Filter skeleton */}
      <div className="bg-white shadow-sm border-b border-neutral-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-end gap-4">
            <div className="flex-1 max-w-md">
              <Skeleton height={40} width="100%" />
            </div>
            <div className="w-48">
              <Skeleton height={40} width="100%" />
            </div>
            <div className="w-44">
              <Skeleton height={40} width="100%" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Job count skeleton */}
        <div className="mb-8">
          <Skeleton height={20} width={120} />
        </div>
        
        {/* Job cards skeleton */}
        <JobCardSkeletonGrid count={6} />
      </div>
    </div>
  )
}