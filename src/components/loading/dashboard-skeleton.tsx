import { Skeleton } from '@/components/ui'
import { JobCardSkeleton } from './job-card-skeleton'

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Dashboard header skeleton */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton height={28} width={200} />
              <Skeleton height={16} width={300} />
            </div>
            <Skeleton height={40} width={120} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-base border border-neutral-200 p-6 space-y-6">
              <div className="space-y-3">
                <Skeleton height={18} width="60%" />
                <div className="space-y-2">
                  <Skeleton height={16} width="80%" />
                  <Skeleton height={16} width="70%" />
                  <Skeleton height={16} width="90%" />
                </div>
              </div>
              
              <div className="space-y-3">
                <Skeleton height={18} width="50%" />
                <div className="space-y-2">
                  <Skeleton height={16} width="85%" />
                  <Skeleton height={16} width="75%" />
                </div>
              </div>
            </div>
          </div>

          {/* Main content skeleton */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="bg-white rounded-base border border-neutral-200 p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton height={14} width={80} />
                      <Skeleton height={28} width={60} />
                    </div>
                    <Skeleton height={40} width={40} rounded />
                  </div>
                </div>
              ))}
            </div>

            {/* Job list skeleton */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton height={24} width={150} />
                <Skeleton height={36} width={100} />
              </div>
              
              <div className="space-y-4">
                {Array.from({ length: 4 }, (_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="bg-white rounded-base border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton height={14} width={80} />
              <Skeleton height={28} width={60} />
            </div>
            <Skeleton height={40} width={40} rounded />
          </div>
        </div>
      ))}
    </div>
  )
}

export function DashboardJobListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }, (_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  )
}