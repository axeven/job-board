import { redirect, notFound } from 'next/navigation'
import { getJobApplicationsServer } from '@/lib/database/applications'
import { jobsServer } from '@/lib/database/jobs'
import { authServer } from '@/lib/auth/server'
import { ApplicationsManagementList } from '@/components/applications/applications-management-list'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ status?: string; sort?: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: job } = await jobsServer.getJobById(id)

  return {
    title: `Applications - ${job?.title || 'Job'} | Dashboard`,
    description: `Manage applications for ${job?.title || 'your job'}`
  }
}

export default async function JobApplicationsPage({ params, searchParams }: PageProps) {
  const { id: jobId } = await params
  const searchParamsResolved = await searchParams
  const user = await authServer.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: job, error: jobError } = await jobsServer.getJobById(jobId)
  if (jobError || !job) {
    notFound()
  }

  // Ensure user owns this job
  if (job.user_id !== user.id) {
    redirect('/dashboard/jobs')
  }

  const applications = await getJobApplicationsServer(jobId)

  // Parse search params for filters
  const statusFilter = searchParamsResolved.status?.split(',') || []
  const sortBy = searchParamsResolved.sort || 'newest'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-muted-foreground">
            {job.company} • {applications?.length || 0} applications
          </p>
        </div>
      </div>

      <ApplicationsManagementList
        jobId={job.id}
        applications={applications || []}
        initialFilters={{
          status: statusFilter,
          sort: sortBy
        }}
      />
    </div>
  )
}