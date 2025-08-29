import { Job } from '@/types/database'

interface JobDetailContentProps {
  job: Job
}

export function JobDetailContent({ job }: JobDetailContentProps) {
  // Simple HTML sanitization - in production, consider using DOMPurify
  const sanitizeHtml = (html: string) => {
    // For now, we'll just escape HTML and preserve line breaks
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\n/g, '<br>')
  }

  return (
    <main className="prose prose-lg max-w-none">
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
        
        {job.description ? (
          <div 
            className="text-gray-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
          />
        ) : (
          <p className="text-gray-500 italic">No job description provided.</p>
        )}
      </section>

      {/* Additional job details section */}
      <section className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Job Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {job.job_type && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Employment Type</dt>
              <dd className="text-base text-gray-900">{job.job_type}</dd>
            </div>
          )}
          
          {job.location && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
              <dd className="text-base text-gray-900">{job.location}</dd>
            </div>
          )}
          
          {job.company && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Company</dt>
              <dd className="text-base text-gray-900">{job.company}</dd>
            </div>
          )}
          
          {job.created_at && (
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Posted Date</dt>
              <dd className="text-base text-gray-900">
                {new Date(job.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </dd>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}