import { redirect } from 'next/navigation'
import { authServer } from '@/lib/auth/server'
import { dashboardServer } from '@/lib/database/dashboard'
import { jobsServer } from '@/lib/database/jobs'
import { DashboardStats } from '@/components/dashboard/stats'
import { RecentJobs } from '@/components/dashboard/recent-jobs'
import { WelcomeSection } from '@/components/dashboard/welcome-section'
import { AccessDenied } from '@/components/dashboard/access-denied'

// Force dynamic rendering since this page uses server-side auth
export const dynamic = 'force-dynamic'

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams
  const user = await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })

  // Check for error parameters
  const error = params?.error as string

  // Show error message if redirected due to access restrictions
  if (error) {
    return <AccessDenied error={error} />
  }
  
  // Get user profile with user type from auth server
  const { profile } = await authServer.getUserProfile()
  
  // TEMPORARY: Redirect job seekers to applications page
  const userType = profile?.user_type || user.user_metadata?.user_type
  if (userType === 'job_seeker') {
    redirect('/dashboard/applications')
  }
  
  // Fetch remaining data for employers
  const [userStats, recentJobsResult] = await Promise.all([
    dashboardServer.getUserJobStats(user.id),
    jobsServer.getByUser(user.id)
  ])
  
  const recentJobs = recentJobsResult.data || []

  return (
    <div className="space-y-6">
      <WelcomeSection 
        userName={profile?.full_name || user.user_metadata?.full_name || user.email || 'there'}
        hasJobs={recentJobs.length > 0}
      />

      <DashboardStats stats={userStats} />
      
      <RecentJobs jobs={recentJobs.slice(0, 5)} />
    </div>
  )
}