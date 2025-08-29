import { authServer } from '@/lib/auth/server'
import { dashboardServer } from '@/lib/database/dashboard'
import { jobsServer } from '@/lib/database/jobs'
import { DashboardStats } from '@/components/dashboard/stats'
import { RecentJobs } from '@/components/dashboard/recent-jobs'
import { WelcomeSection } from '@/components/dashboard/welcome-section'

// Force dynamic rendering since this page uses server-side auth
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const user = await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })
  
  // Fetch real user data and stats
  const [userStats, userProfile, recentJobsResult] = await Promise.all([
    dashboardServer.getUserJobStats(user.id),
    dashboardServer.getUserProfile(user.id),
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