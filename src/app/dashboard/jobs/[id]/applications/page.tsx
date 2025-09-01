import { redirect } from 'next/navigation'
import { getJobApplicationsServer } from '@/lib/database/applications'
import { jobsServer } from '@/lib/database/jobs'
import { authServer } from '@/lib/auth/server'
import { EmployerApplicationsList } from '@/components/employer/employer-applications-list'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function JobApplicationsPage({ params }: PageProps) {
  const { id: jobId } = await params
  const user = await authServer.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: job, error: jobError } = await jobsServer.getJobById(jobId)
  if (jobError || !job) {
    redirect('/dashboard/jobs')
  }

  // Ensure user owns this job
  if (job.user_id !== user.id) {
    redirect('/dashboard/jobs')
  }

  const applications = await getJobApplicationsServer(jobId)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>Dashboard</span>
          <span>/</span>
          <span>Jobs</span>
          <span>/</span>
          <span>{job.title}</span>
          <span>/</span>
          <span>Applications</span>
        </div>
        <h1 className="text-3xl font-bold">Applications</h1>
        <div className="flex items-center gap-4 mt-2">
          <div>
            <h2 className="text-xl font-semibold">{job.title}</h2>
            <p className="text-muted-foreground">{job.company} • {job.location}</p>
          </div>
          <div className="ml-auto">
            <div className="text-right">
              <p className="text-2xl font-bold">{applications.length}</p>
              <p className="text-sm text-muted-foreground">Total Applications</p>
            </div>
          </div>
        </div>
      </div>

      <EmployerApplicationsList 
        jobTitle={job.title}
        applications={applications} 
      />
    </div>
  )
}