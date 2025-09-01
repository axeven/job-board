import { authServer } from '@/lib/auth/server'
import { jobsServer } from '@/lib/database/jobs'
import { DeletedJobs } from '@/components/dashboard/deleted-jobs'
import type { Tables } from '@/types/supabase'

export const dynamic = 'force-dynamic'

export default async function DeletedJobsPage() {
  // Require employer authentication
  const { user } = await authServer.requireEmployer()
  
  // Fetch user's deleted jobs
  let deletedJobs: (Tables<'jobs'> & { deleted_at: string })[] = []
  
  try {
    const result = await jobsServer.getUserDeletedJobs(user.id)
    deletedJobs = (result.data || []).filter(job => 
      job && typeof job === 'object' && 'deleted_at' in job && job.deleted_at
    ).map(job => ({
      ...job,
      deleted_at: (job as Tables<'jobs'> & { deleted_at: string }).deleted_at
    }))
  } catch {
    // If the deleted_at column doesn't exist yet, just show empty state
    console.log('Deleted jobs feature not available yet - migration may not be applied')
    deletedJobs = []
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Deleted Jobs</h1>
          <p className="mt-1 text-sm text-gray-600">
            {deletedJobs.length > 0 
              ? `${deletedJobs.length} deleted job${deletedJobs.length !== 1 ? 's' : ''}`
              : 'No deleted jobs'
            }
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <a
            href="/dashboard/jobs"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <BackIcon className="w-4 h-4 mr-2" />
            Back to Jobs
          </a>
        </div>
      </div>
      
      {/* Deleted Jobs */}
      <DeletedJobs jobs={deletedJobs} />
    </div>
  )
}

export async function generateMetadata() {
  return {
    title: 'Deleted Jobs - Job Board',
    description: 'Manage and restore your deleted job postings'
  }
}

function BackIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}