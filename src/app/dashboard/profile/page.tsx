import { Suspense } from 'react'
import { authServer } from '@/lib/auth/server'
import { ProfileCard } from '@/components/dashboard/profile-card'

// Force dynamic rendering since this page uses server-side auth
export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Profile - Job Board',
  description: 'View and manage your profile information',
}

export default async function ProfilePage() {
  // Require authentication and get user profile
  const { user, profile } = await authServer.getUserProfile()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-600">
          View your account and profile information
        </p>
      </div>

      {/* Profile Information */}
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileCard user={user} profile={profile} />
      </Suspense>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="space-y-4">
        {/* Header skeleton */}
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}