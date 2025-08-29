import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { jobsServer } from '@/lib/database/jobs'
import { JobDetailView } from '@/components/jobs/job-detail-view'

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
    
    const description = job.description && job.description.length > 160
      ? `${job.description.substring(0, 160)}...`
      : job.description || 'Job opportunity available.'
    
    return {
      title: `${job.title} at ${job.company} - Job Board`,
      description,
      keywords: [job.title, job.company, job.location, job.job_type, 'jobs', 'careers'].filter(Boolean),
      openGraph: {
        title: `${job.title} at ${job.company}`,
        description: job.description && job.description.length > 200
          ? `${job.description.substring(0, 200)}...`
          : job.description || 'Job opportunity available.',
        type: 'article',
        url: `/jobs/${job.id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${job.title} at ${job.company}`,
        description: description,
      }
    }
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
    
    return <JobDetailView job={job} />
  } catch {
    notFound()
  }
}