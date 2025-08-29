import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { jobsServer } from '@/lib/database/jobs'
import { JobDetailView } from '@/components/jobs/job-detail-view'
import { generateJobMetadata } from '@/lib/seo'
import { JobStructuredData, JobBreadcrumbStructuredData } from '@/components/seo/job-structured-data'

interface JobDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateStaticParams() {
  try {
    const { data: jobIds, error } = await jobsServer.getAllJobIds()
    if (error || !jobIds) return []
    
    return jobIds.map(job => ({ id: job.id }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params
    const { data: job, error } = await jobsServer.getJobById(id)
    
    if (error || !job) {
      return {
        title: 'Job Not Found - Job Board',
        description: 'The requested job posting could not be found.'
      }
    }
    
    return generateJobMetadata(job)
  } catch {
    return {
      title: 'Job Not Found - Job Board',
      description: 'The requested job posting could not be found.'
    }
  }
}

export const revalidate = 3600 // Revalidate every hour

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  try {
    const { id } = await params
    const { data: job, error } = await jobsServer.getJobById(id)
    
    if (error || !job) {
      notFound()
    }
    
    return (
      <>
        <JobStructuredData job={job} />
        <JobBreadcrumbStructuredData job={job} />
        <JobDetailView job={job} />
      </>
    )
  } catch {
    notFound()
  }
}