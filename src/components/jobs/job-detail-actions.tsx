'use client'

import { Job } from '@/types/database'

interface JobDetailActionsProps {
  job: Job
}

function ApplyButton({ job }: { job: Job }) {
  const handleApply = () => {
    // Create a professional email template
    const subject = encodeURIComponent(`Application for ${job.title} position at ${job.company}`)
    const body = encodeURIComponent(`Hello,

I am interested in the ${job.title} position at ${job.company} that I found on your job board.

I would like to learn more about this opportunity and submit my application.

Best regards`)
    
    // Open default email client
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <button
      onClick={handleApply}
      className="flex-1 sm:flex-none inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Apply Now
    </button>
  )
}

function SaveJobButton({ jobId }: { jobId: string }) {
  const handleSave = () => {
    // For now, just show an alert - in production, this would save to user's profile
    console.log('Saving job:', jobId)
    alert('Job saved! (This feature will be implemented when user authentication is added)')
  }

  return (
    <button
      onClick={handleSave}
      className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      Save Job
    </button>
  )
}

function ShareDropdown({ job }: { job: Job }) {
  const handleShare = async () => {
    const shareData = {
      title: `${job.title} at ${job.company}`,
      text: `Check out this job opportunity: ${job.title} at ${job.company}`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed')
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert('Job URL copied to clipboard!')
      } catch {
        // Fallback: Show the URL
        prompt('Copy this URL:', window.location.href)
      }
    }
  }

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
      Share
    </button>
  )
}

function ReportJobLink({ jobId }: { jobId: string }) {
  const handleReport = () => {
    const subject = encodeURIComponent(`Report Job Posting: ${jobId}`)
    const body = encodeURIComponent(`I would like to report the following job posting for review:

Job ID: ${jobId}
URL: ${window.location.href}

Reason for reporting:
[Please describe the issue]

Thank you for your attention to this matter.`)
    
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <button
      onClick={handleReport}
      className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none focus:underline"
    >
      Report this job
    </button>
  )
}

export function JobDetailActions({ job }: JobDetailActionsProps) {
  return (
    <aside className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        <ApplyButton job={job} />
        <SaveJobButton jobId={job.id} />
        <ShareDropdown job={job} />
      </div>
      
      <div className="mt-6 pt-6 border-t border-gray-200">
        <ReportJobLink jobId={job.id} />
      </div>
    </aside>
  )
}