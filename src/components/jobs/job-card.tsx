import Link from 'next/link'
import type { Job } from '@/types/database'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date unknown'
    
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    })
  }

  return (
    <Link href={`/jobs/${job.id}`} className="block group h-full">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 h-full">
        <div className="p-6 h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {job.title}
            </h3>
            <p className="text-base text-gray-600 mt-1 font-medium">
              {job.company}
            </p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getJobTypeBadgeStyles(job.job_type)} ml-3 flex-shrink-0`}>
            {job.job_type}
          </span>
        </div>
        
        <div className="mb-4">
          <p className="text-sm text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
            {truncateDescription(job.description)}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Posted {formatDate(job.created_at)}
          </span>
          <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
            View Details →
          </span>
        </div>
        </div>
      </div>
    </Link>
  )
}