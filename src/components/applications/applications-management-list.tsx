'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Eye, FileText, Download } from 'lucide-react'
import { ApplicationReviewModal } from './application-review-modal'
import { formatDistance } from 'date-fns'
import { getResumeDownloadUrlClient } from '@/lib/storage/resume-storage'
import { useToast } from '@/lib/toast-context'

interface JobApplicationWithProfile {
  id: string
  job_id: string
  applicant_id: string
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted'
  cover_letter: string | null
  resume_file_path: string | null
  applied_at: string | null
  updated_at: string | null
  user_profiles: {
    full_name: string | null
    user_type: string
  } | null
}

interface ApplicationsManagementListProps {
  jobId: string
  applications: JobApplicationWithProfile[]
  initialFilters: {
    status: string[]
    sort: string
  }
}

export function ApplicationsManagementList({ 
  jobId, 
  applications, 
  initialFilters 
}: ApplicationsManagementListProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedApplication, setSelectedApplication] = useState<JobApplicationWithProfile | null>(null)
  const [statusFilter, setStatusFilter] = useState(initialFilters.status.join(',') || 'all')
  const [sortBy, setSortBy] = useState(initialFilters.sort)
  const [searchTerm, setSearchTerm] = useState('')

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || statusFilter.split(',').includes(app.status)
    const matchesSearch = !searchTerm || 
      app.user_profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.cover_letter?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSearch
  })

  // Sort applications
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.applied_at || 0).getTime() - new Date(a.applied_at || 0).getTime()
      case 'oldest':
        return new Date(a.applied_at || 0).getTime() - new Date(b.applied_at || 0).getTime()
      case 'name':
        const nameA = a.user_profiles?.full_name || ''
        const nameB = b.user_profiles?.full_name || ''
        return nameA.localeCompare(nameB)
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return 0
    }
  })

  const updateURL = (newStatus: string, newSort: string) => {
    const params = new URLSearchParams()
    if (newStatus !== 'all') params.set('status', newStatus)
    if (newSort !== 'newest') params.set('sort', newSort)
    
    const queryString = params.toString()
    router.push(`/dashboard/jobs/${jobId}/applications${queryString ? `?${queryString}` : ''}`)
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    updateURL(value, sortBy)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    updateURL(statusFilter, value)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <Input
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {sortedApplications.length} of {applications.length} applications
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {sortedApplications.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No applications found matching your criteria.</p>
          </Card>
        ) : (
          sortedApplications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              onViewDetails={() => setSelectedApplication(application)}
            />
          ))
        )}
      </div>

      {/* Application Review Modal */}
      {selectedApplication && (
        <ApplicationReviewModal
          application={selectedApplication}
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusUpdate={() => {
            setSelectedApplication(null)
            router.refresh()
          }}
        />
      )}
    </div>
  )
}

function ApplicationCard({ 
  application, 
  onViewDetails 
}: { 
  application: JobApplicationWithProfile
  onViewDetails: () => void
}) {
  const { toast } = useToast()
  const [isDownloadingResume, setIsDownloadingResume] = useState(false)

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
      toast.error('Download Failed', 'Unable to download resume. Please try again.')
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
    <Card className="p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {application.user_profiles?.full_name || 'Anonymous Applicant'}
              </h3>
              <p className="text-sm text-muted-foreground">
                Applied {application.applied_at ? formatDistance(new Date(application.applied_at), new Date(), { addSuffix: true }) : 'Unknown date'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(application.status)}>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
          </div>

          {/* Cover Letter Preview */}
          {application.cover_letter && (
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700 line-clamp-2">
                {application.cover_letter}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onViewDetails}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Review Application
            </Button>

            {application.resume_file_path && (
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
                Resume
              </Button>
            )}

            {application.cover_letter && (
              <Badge variant="default" className="gap-1">
                <FileText className="h-3 w-3" />
                Cover Letter
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}