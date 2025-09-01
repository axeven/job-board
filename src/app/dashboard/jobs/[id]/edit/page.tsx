import { notFound, redirect } from 'next/navigation'
import { authServer } from '@/lib/auth/server'
import { jobsServer } from '@/lib/database/jobs'
import { DynamicJobEditForm } from '@/lib/dynamic-imports'

interface PageProps {
  params: Promise<{ id: string }>
}

export const dynamic = 'force-dynamic'

export default async function JobEditPage({ params }: PageProps) {
  const { id: jobId } = await params
  
  // Require employer authentication
  const { user } = await authServer.requireEmployer()
  
  // Fetch the job and validate ownership
  const { data: job, error } = await jobsServer.getById(jobId)
  
  if (error || !job) {
    notFound()
  }
  
  // Check ownership
  if (job.user_id !== user.id) {
    redirect('/dashboard/jobs')
  }
  
  // Get job metadata for the header
  const lastUpdated = job.updated_at 
    ? new Date(job.updated_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
            <ChevronRightIcon className="h-4 w-4" />
            <a href="/dashboard/jobs" className="hover:text-gray-700">My Jobs</a>
            <ChevronRightIcon className="h-4 w-4" />
            <span className="text-gray-900">Edit Job</span>
          </nav>
          
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="text-gray-600 mt-1">{job.company}</p>
              {lastUpdated && (
                <p className="text-sm text-gray-500 mt-2">
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              <a
                href={`/jobs/${job.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ExternalLinkIcon className="w-4 h-4 mr-2" />
                Preview
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg">
          <DynamicJobEditForm job={job} />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: PageProps) {
  const { id: jobId } = await params
  
  try {
    const { data: job } = await jobsServer.getById(jobId)
    
    return {
      title: job ? `Edit ${job.title} - Job Board` : 'Edit Job - Job Board',
      description: job ? `Edit job posting for ${job.title} at ${job.company}` : 'Edit job posting'
    }
  } catch {
    return {
      title: 'Edit Job - Job Board',
      description: 'Edit job posting'
    }
  }
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}