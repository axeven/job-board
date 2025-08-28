import Link from 'next/link'

interface Job {
  id: string
  title: string
  company: string
  location: string
  created_at: string
  is_archived?: boolean
}

interface RecentJobsProps {
  jobs: Job[]
}

export function RecentJobs({ jobs }: RecentJobsProps) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Jobs</h3>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven&apos;t posted any jobs yet.</p>
            <Link
              href="/post-job"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Post your first job
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Recent Jobs</h3>
          <Link
            href="/dashboard/jobs"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            View all
          </Link>
        </div>
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="text-sm font-medium text-gray-900">{job.title}</h4>
                  {job.is_archived && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Archived
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{job.company} • {job.location}</p>
                <p className="text-xs text-gray-400">
                  Posted {new Date(job.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  href={`/jobs/${job.id}`}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/jobs/${job.id}/edit`}
                  className="text-sm text-gray-600 hover:text-gray-500"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}