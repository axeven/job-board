import { Skeleton } from '@/components/ui'

export function JobCardSkeleton() {
  return (
    <div className="bg-white border border-neutral-200 rounded-base p-6 space-y-4">
      {/* Job title and company */}
      <div className="space-y-2">
        <Skeleton height={20} width="75%" />
        <Skeleton height={16} width="50%" />
      </div>
      
      {/* Job description */}
      <div className="space-y-2">
        <Skeleton height={14} width="100%" />
        <Skeleton height={14} width="90%" />
        <Skeleton height={14} width="80%" />
      </div>
      
      {/* Job type badge and location */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Skeleton height={24} width={80} rounded />
          <Skeleton height={16} width={60} />
        </div>
        <Skeleton height={32} width={100} rounded />
      </div>
    </div>
  )
}

export function JobCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}