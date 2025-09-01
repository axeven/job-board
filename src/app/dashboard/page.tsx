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
  
  // Fetch real user data and stats
  const [userStats, userProfile, recentJobsResult] = await Promise.all([
    dashboardServer.getUserJobStats(user.id),
    dashboardServer.getUserProfile(),
    jobsServer.getByUser(user.id)
  ])
  
  const recentJobs = recentJobsResult.data || []

  return (
    <div className="space-y-6">
      <WelcomeSection 
        userName={userProfile?.full_name || userProfile?.email || 'there'}
        hasJobs={recentJobs.length > 0}
      />

      <DashboardStats stats={userStats} />
      
      <RecentJobs jobs={recentJobs.slice(0, 5)} />
    </div>
  )
}