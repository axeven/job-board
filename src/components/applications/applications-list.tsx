'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
// Note: Resume download will be handled by server actions in Phase 2
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
                <ResumeDownloadLink />
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// Resume Download Component - Simplified for Phase 1
function ResumeDownloadLink() {
  return (
    <div className="inline-flex items-center gap-1 text-blue-600">
      <FileText className="h-3 w-3" />
      Resume Available
    </div>
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