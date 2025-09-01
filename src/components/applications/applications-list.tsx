'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import { getResumeDownloadUrlClient } from '@/lib/storage/resume-storage'
import { useToast } from '@/lib/toast-context'
import { ApplicationTimeline } from './application-timeline'
import { generateTimeline } from '@/lib/timeline/timeline-generator'
import type { JobApplicationWithJob } from '@/types/database'
import type { ApplicationStatus, TimelineConfig } from '@/types/timeline'

interface ApplicationsListProps {
  applications: JobApplicationWithJob[]
}

export function ApplicationsList({ applications }: ApplicationsListProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No applications yet</h3>
        <p className="text-muted-foreground">
          Start browsing jobs and submit your first application!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {applications.map((application) => {
        const timeline = generateTimeline(
          application.status as ApplicationStatus,
          application.applied_at || new Date().toISOString(),
          application.updated_at || application.applied_at || new Date().toISOString()
        )

        return (
          <ApplicationCard 
            key={application.id}
            application={application}
            timeline={timeline}
          />
        )
      })}
    </div>
  )
}

// Enhanced Application Card Component with Timeline
function ApplicationCard({ 
  application, 
  timeline 
}: { 
  application: JobApplicationWithJob
  timeline: TimelineConfig
}) {
  const additionalActions = (
    <>
      <ApplicationStatusBadge status={application.status} />
      <Badge variant="primary">
        {application.jobs.job_type}
      </Badge>
      {application.resume_file_path && (
        <ResumeDownloadLink filePath={application.resume_file_path} />
      )}
    </>
  )

  return (
    <ApplicationTimeline
      jobTitle={application.jobs.title}
      companyName={application.jobs.company}
      location={application.jobs.location}
      timeline={timeline}
      additionalActions={additionalActions}
    />
  )
}

// Resume Download Component
function ResumeDownloadLink({ filePath }: { filePath: string }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const { url, error } = await getResumeDownloadUrlClient(filePath)
      
      if (error) {
        throw new Error(error)
      }
      
      if (url) {
        // Open in new tab/window for download
        window.open(url, '_blank')
      } else {
        throw new Error('No download URL received')
      }
    } catch (error) {
      console.error('Failed to download resume:', error)
      toast.error(
        'Download Failed', 
        'Unable to download resume. Please try again.'
      )
    } finally {
      setIsDownloading(false)
    }
  }


  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={isDownloading}
      className="gap-1 text-xs h-7 px-2"
      title="Download your uploaded resume"
    >
      {isDownloading ? (
        <>
          <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full" />
          Downloading...
        </>
      ) : (
        <>
          <FileText className="h-3 w-3" />
          <Download className="h-3 w-3" />
          Resume
        </>
      )}
    </Button>
  )
}

function ApplicationStatusBadge({ status }: { status: string }) {
  const variants: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
    pending: 'default',
    reviewing: 'info',
    shortlisted: 'success',
    rejected: 'error',
    accepted: 'success'
  }

  return (
    <Badge variant={variants[status] || 'default'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  )
}