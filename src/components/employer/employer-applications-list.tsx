'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { User, Calendar, FileText, Download } from 'lucide-react'
import { updateApplicationStatusAction } from '@/lib/actions/application-actions'
import { getResumeDownloadUrlClient } from '@/lib/storage/resume-storage'
import { useToast } from '@/lib/toast-context'
import { formatDistance } from 'date-fns'
import type { ApplicationStatus } from '@/types/database'

interface JobApplicationWithProfile {
  id: string
  job_id: string
  applicant_id: string
  status: ApplicationStatus
  cover_letter: string | null
  resume_file_path: string | null
  applied_at: string | null
  updated_at: string | null
  user_profiles: {
    full_name: string | null
    user_type: string
  } | null
}

interface EmployerApplicationsListProps {
  jobTitle: string
  applications: JobApplicationWithProfile[]
}

export function EmployerApplicationsList({ 
  jobTitle, 
  applications 
}: EmployerApplicationsListProps) {
  const [filteredApplications, setFilteredApplications] = useState(applications)
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest')

  // Filter and sort applications
  const processedApplications = filteredApplications
    .filter(app => statusFilter === 'all' || app.status === statusFilter)
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.applied_at || 0).getTime() - new Date(a.applied_at || 0).getTime()
      }
      if (sortBy === 'oldest') {
        return new Date(a.applied_at || 0).getTime() - new Date(b.applied_at || 0).getTime()
      }
      if (sortBy === 'name') {
        const nameA = a.user_profiles?.full_name || 'Unknown'
        const nameB = b.user_profiles?.full_name || 'Unknown'
        return nameA.localeCompare(nameB)
      }
      return 0
    })

  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No applications yet</h3>
        <p className="text-muted-foreground">
          Applications for &quot;{jobTitle}&quot; will appear here when candidates apply.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Status ({applications.length})</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">By Name</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing {processedApplications.length} of {applications.length} applications
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {processedApplications.map((application) => (
          <ApplicationCard 
            key={application.id} 
            application={application}
            onStatusUpdate={(newStatus) => {
              // Update local state optimistically
              setFilteredApplications(prev => 
                prev.map(app => 
                  app.id === application.id 
                    ? { ...app, status: newStatus, updated_at: new Date().toISOString() }
                    : app
                )
              )
            }}
          />
        ))}
      </div>
    </div>
  )
}

function ApplicationCard({ 
  application, 
  onStatusUpdate 
}: { 
  application: JobApplicationWithProfile
  onStatusUpdate: (status: ApplicationStatus) => void
}) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [showCoverLetter, setShowCoverLetter] = useState(false)
  const { toast } = useToast()

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    setIsUpdating(true)
    try {
      const result = await updateApplicationStatusAction(application.id, newStatus)
      
      if (result.success) {
        onStatusUpdate(newStatus)
        toast.success('Status Updated', `Application status changed to ${newStatus}`)
      } else {
        toast.error('Update Failed', result.error || 'Failed to update application status')
      }
    } catch (error) {
      console.error('Status update error:', error)
      toast.error('Update Failed', 'Something went wrong. Please try again.')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleResumeDownload = async () => {
    if (!application.resume_file_path) return

    try {
      const { url, error } = await getResumeDownloadUrlClient(application.resume_file_path)
      
      if (error) {
        throw new Error(error)
      }
      
      if (url) {
        window.open(url, '_blank')
      }
    } catch (error) {
      console.error('Failed to download resume:', error)
      toast.error('Download Failed', 'Unable to download resume. Please try again.')
    }
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Applicant Info */}
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg">
                {application.user_profiles?.full_name || 'Anonymous Applicant'}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Applied {application.applied_at ? formatDistance(new Date(application.applied_at), new Date(), { addSuffix: true }) : 'Unknown date'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Documents */}
          <div className="flex gap-2 mt-4">
            {application.cover_letter && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCoverLetter(true)}
                className="gap-1"
              >
                <FileText className="h-4 w-4" />
                Cover Letter
              </Button>
            )}
            {application.resume_file_path && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleResumeDownload}
                className="gap-1"
              >
                <Download className="h-4 w-4" />
                Resume
              </Button>
            )}
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex flex-col items-end gap-3">
          <ApplicationStatusBadge status={application.status} />
          
          <select
            value={application.status}
            onChange={(e) => handleStatusUpdate(e.target.value as ApplicationStatus)}
            disabled={isUpdating}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm min-w-[140px]"
          >
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="accepted">Accepted</option>
          </select>
          
          {isUpdating && (
            <div className="text-xs text-muted-foreground">Updating...</div>
          )}
        </div>
      </div>

      {/* Cover Letter Modal */}
      {showCoverLetter && application.cover_letter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={() => setShowCoverLetter(false)}
          />
          <Card className="relative z-10 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-lg font-semibold">Cover Letter</h3>
                <p className="text-sm text-muted-foreground">
                  From {application.user_profiles?.full_name || 'Anonymous Applicant'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCoverLetter(false)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
            <div className="p-6 overflow-y-auto max-h-96">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {application.cover_letter}
              </div>
            </div>
            <div className="flex justify-end p-4 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setShowCoverLetter(false)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}

function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const variants: Record<ApplicationStatus, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'default',
    reviewing: 'info',
    shortlisted: 'success',
    rejected: 'error',
    accepted: 'success'
  }

  return (
    <Badge variant={variants[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}