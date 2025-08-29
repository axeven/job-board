import { Job } from '@/types/database'

interface JobDetailHeaderProps {
  job: Job
}

function JobTypeBadge({ type }: { type: string | null }) {
  if (!type) return null
  
  const getJobTypeBadgeStyles = (jobType: string) => {
    switch (jobType) {
      case 'Full-Time':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Part-Time':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Contract':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getJobTypeBadgeStyles(type)}`}>
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
      </svg>
      {type}
    </span>
  )
}

function LocationBadge({ location }: { location: string | null }) {
  if (!location) return null

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      {location}
    </span>
  )
}

function PostedDate({ date }: { date: string | null }) {
  if (!date) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Posted yesterday'
    if (diffDays < 7) return `Posted ${diffDays} days ago`
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `Posted ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
    }
    
    return `Posted on ${date.toLocaleDateString()}`
  }

  return (
    <span className="text-sm text-gray-500">
      {formatDate(date)}
    </span>
  )
}

export function JobDetailHeader({ job }: JobDetailHeaderProps) {
  return (
    <header className="border-b border-gray-200 pb-6 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl">
            {job.title}
          </h1>
          <p className="text-xl text-gray-600 mt-2 font-medium">
            {job.company}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4">
            <JobTypeBadge type={job.job_type} />
            <LocationBadge location={job.location} />
            <PostedDate date={job.created_at} />
          </div>
        </div>
        
        {/* Share button will be added later */}
        <div className="mt-6 lg:mt-0 lg:ml-6">
          <div className="flex gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}