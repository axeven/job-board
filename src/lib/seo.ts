import { Metadata } from 'next'
import type { Job } from '@/types/database'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
}

export function generateJobMetadata(job: Job): Metadata {
  const title = `${job.title} at ${job.company} | Job Board`
  const description = job.description.slice(0, 160).replace(/<[^>]*>/g, '') + '...'
  
  return {
    title,
    description,
    keywords: [
      job.title,
      job.company,
      job.location,
      job.job_type,
      'jobs',
      'careers',
      'employment'
    ],
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/${job.id}`,
      siteName: 'Job Board',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-job.jpg`,
          width: 1200,
          height: 630,
          alt: `${job.title} at ${job.company}`,
        }
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-job.jpg`],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/${job.id}`,
    },
  }
}

export function generateJobsPageMetadata(): Metadata {
  return {
    title: 'Browse Jobs | Job Board',
    description: 'Find your next career opportunity. Browse the latest job postings from top companies across various industries and locations.',
    keywords: [
      'jobs',
      'careers',
      'employment',
      'hiring',
      'job search',
      'job listings'
    ],
    openGraph: {
      title: 'Browse Jobs | Job Board',
      description: 'Find your next career opportunity. Browse the latest job postings from top companies.',
      type: 'website',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs`,
      siteName: 'Job Board',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-jobs.jpg`,
          width: 1200,
          height: 630,
          alt: 'Job Board - Browse Jobs',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Browse Jobs | Job Board',
      description: 'Find your next career opportunity. Browse the latest job postings from top companies.',
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs`,
    },
  }
}

export function generateHomeMetadata(): Metadata {
  return {
    title: 'Job Board - Find Your Dream Job',
    description: 'Connect with top employers and discover amazing career opportunities. Post jobs or find your next role with our comprehensive job board platform.',
    keywords: [
      'job board',
      'careers',
      'employment',
      'hiring',
      'job search',
      'recruiters',
      'job postings'
    ],
    openGraph: {
      title: 'Job Board - Find Your Dream Job',
      description: 'Connect with top employers and discover amazing career opportunities.',
      type: 'website',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: 'Job Board',
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-home.jpg`,
          width: 1200,
          height: 630,
          alt: 'Job Board - Find Your Dream Job',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Job Board - Find Your Dream Job',
      description: 'Connect with top employers and discover amazing career opportunities.',
    },
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  }
}