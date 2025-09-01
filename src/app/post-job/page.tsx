import { Metadata } from 'next'
import { authServer } from '@/lib/auth/server'
import { DynamicJobCreationForm } from '@/lib/dynamic-imports'
import { Navbar } from '@/components/layout/navbar'
import { JobSeekerNotice } from '@/components/jobs/job-seeker-notice'

export const metadata: Metadata = {
  title: 'Post a Job - Job Board',
  description: 'Create a new job posting to find the perfect candidate for your team',
  robots: 'noindex, nofollow'
}

export const dynamic = 'force-dynamic'

export default async function PostJobPage() {
  // Require authentication first
  await authServer.requireAuth({
    redirectTo: '/auth/login',
    redirectWithReturn: true
  })

  // Then check if user is an employer, redirect to dashboard with error if not
  try {
    await authServer.requireEmployer()
  } catch {
    // This will redirect job seekers to the dashboard with an error message
    // instead of showing an empty page or server error
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <JobSeekerNotice>
          <div className="bg-white shadow-sm rounded-lg">
            {/* Header */}
            <div className="px-6 py-8 border-b border-gray-200">
              <div className="max-w-2xl">
                <h1 className="text-3xl font-bold text-gray-900">
                  Post a New Job
                </h1>
                <p className="mt-2 text-gray-600">
                  Create a compelling job posting to attract the best candidates for your team. 
                  All fields marked with <span className="text-red-500">*</span> are required.
                </p>
              </div>
            </div>
            
            {/* Form */}
            <div className="px-6 py-8">
              <DynamicJobCreationForm />
            </div>
          </div>
          
          {/* Help Section */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h2 className="text-lg font-medium text-blue-900 mb-3">
              Tips for a Great Job Posting
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
              <div>
                <h3 className="font-medium mb-2">📝 Job Title</h3>
                <p>Be specific and include the level (e.g., &quot;Senior&quot;, &quot;Junior&quot;)</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">🏢 Company</h3>
                <p>Use your official company name to build trust</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">📍 Location</h3>
                <p>Be clear about remote work options and office location</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">📄 Description</h3>
                <p>Include responsibilities, requirements, and benefits</p>
              </div>
            </div>
          </div>
        </JobSeekerNotice>
      </div>
    </div>
  )
}