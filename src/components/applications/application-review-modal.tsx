'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { X, Download, FileText, User, Clock } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDistance } from 'date-fns'
import { updateApplicationStatusAction } from '@/lib/actions/application-actions'
import { getResumeDownloadUrlClient } from '@/lib/storage/resume-storage'
import { useToast } from '@/lib/toast-context'

type ApplicationStatus = 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'

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

interface ApplicationReviewModalProps {
  application: JobApplicationWithProfile
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: () => void
}

export function ApplicationReviewModal({
  application,
  isOpen,
  onClose,
  onStatusUpdate
}: ApplicationReviewModalProps) {
  const { toast } = useToast()
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isDownloadingResume, setIsDownloadingResume] = useState(false)

  if (!isOpen) return null

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    setIsUpdatingStatus(true)
    try {
      const result = await updateApplicationStatusAction(
        application.id,
        newStatus
      )

      if (!result.success) {
        throw new Error(result.error || 'Failed to update status')
      }

      toast.success('Status Updated', `Application status changed to ${newStatus}`)
      onStatusUpdate()
    } catch (error) {
      toast.error('Update Failed', 'Failed to update application status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleResumeDownload = async () => {
    if (!application.resume_file_path) return
    
    setIsDownloadingResume(true)
    try {
      const { url, error } = await getResumeDownloadUrlClient(application.resume_file_path)
      
      if (error) throw new Error(error)
      
      if (url) {
        window.open(url, '_blank')
      } else {
        throw new Error('No download URL received')
      }
    } catch (error) {
      toast.error('Download Failed', 'Unable to download resume')
    } finally {
      setIsDownloadingResume(false)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'default'
      case 'reviewing': return 'info' as const
      case 'shortlisted': return 'success' as const
      case 'rejected': return 'error' as const
      case 'accepted': return 'success' as const
      default: return 'default'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">
                {application.user_profiles?.full_name || 'Anonymous Applicant'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusVariant(application.status)}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Applied {application.applied_at ? formatDistance(new Date(application.applied_at), new Date(), { addSuffix: true }) : 'Unknown date'}
                </span>
              </div>
            </div>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cover Letter */}
              {application.cover_letter && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Cover Letter</h3>
                  </div>
                  <Card className="p-4">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">
                        {application.cover_letter}
                      </p>
                    </div>
                  </Card>
                </div>
              )}

              {/* Resume Section */}
              {application.resume_file_path && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Download className="h-5 w-5" />
                    <h3 className="text-lg font-medium">Resume</h3>
                  </div>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Resume attached</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResumeDownload}
                        disabled={isDownloadingResume}
                        className="gap-2"
                      >
                        {isDownloadingResume ? (
                          <div className="animate-spin h-4 w-4 border border-current border-t-transparent rounded-full" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        Download Resume
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status Management */}
              <div>
                <h3 className="text-lg font-medium mb-3">Update Status</h3>
                <div className="space-y-3">
                  <Select
                    value={application.status}
                    onValueChange={(value) => handleStatusUpdate(value as ApplicationStatus)}
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Under Review</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="accepted">Accepted</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate('shortlisted')}
                      disabled={isUpdatingStatus || application.status === 'shortlisted'}
                    >
                      Shortlist
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={isUpdatingStatus || application.status === 'rejected'}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>

              {/* Application Details */}
              <div>
                <h3 className="text-lg font-medium mb-3">Application Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>Applicant ID: {application.applicant_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Applied: {application.applied_at ? new Date(application.applied_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  {application.updated_at !== application.applied_at && application.updated_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        Updated: {new Date(application.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </Card>
    </div>
  )
}