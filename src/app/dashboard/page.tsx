import { authServer } from '@/lib/auth/server'
import { DashboardStats } from '@/components/dashboard/stats'
import { RecentJobs } from '@/components/dashboard/recent-jobs'
import { Tables } from '@/types/supabase'

// Job type from database schema
type Job = Tables<'jobs'>

// Force dynamic rendering since this page uses server-side auth
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  await authServer.requireAuth()
  
  // TODO: In Phase 3, we'll fetch actual user jobs from database
  // For now, use mock data to show the dashboard structure
  const mockJobs: Job[] = []
  
  const stats = {
    totalJobs: mockJobs.length,
    // Since there's no is_archived field in the database schema,
    // we'll consider all jobs as active for now
    activeJobs: mockJobs.length,
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to your dashboard. Here&apos;s what&apos;s happening with your job postings.
        </p>
      </div>

      <DashboardStats stats={stats} />
      
      <RecentJobs jobs={mockJobs.slice(0, 5)} />
    </div>
  )
}