'use client'

import { useAuth } from '@/lib/auth/context'
import { EmployerOnlyNotice } from '@/components/ui/employer-only-notice'

interface JobSeekerNoticeProps {
  children: React.ReactNode
}

export function JobSeekerNotice({ children }: JobSeekerNoticeProps) {
  const { user, isJobSeeker, loading } = useAuth()

  // Show loading state
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    )
  }

  // Show notice to job seekers
  if (user && isJobSeeker) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Job Posting Not Available
          </h1>
          <p className="text-gray-600 mb-8">
            This feature is only available to employer accounts.
          </p>
        </div>
        
        <EmployerOnlyNotice
          title="Switch to Employer Account"
          description="To post jobs, you'll need an employer account. Job seeker accounts are designed for browsing and applying to jobs."
          showUpgradeButton={true}
        />
      </div>
    )
  }

  // Show the form for employers or unauthenticated users
  return <>{children}</>
}