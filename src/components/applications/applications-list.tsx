'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { getResumeDownloadUrlClient } from '@/lib/storage/resume-storage'
import { useToast } from '@/lib/toast-context'
import type { JobApplicationWithJob } from '@/types/database'

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
    <div className="space-y-4">
      {applications.map((application) => (
        <Card key={application.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">
                {application.jobs.title}
              </h3>
              <p className="text-muted-foreground">
                {application.jobs.company} • {application.jobs.location}
              </p>
              <p className="text-sm text-muted-foreground">
                Applied {formatDistanceToNow(new Date(application.applied_at || new Date()), { addSuffix: true })}
              </p>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <ApplicationStatusBadge status={application.status} />
              <Badge variant="default">
                {application.jobs.job_type}
              </Badge>
              {application.resume_file_path && (
                <ResumeDownloadLink filePath={application.resume_file_path} />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
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