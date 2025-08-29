import { MetadataRoute } from 'next'
import { jobsServer } from '@/lib/database/jobs'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  // Get all jobs for sitemap
  const jobsResult = await jobsServer.getAll()
  const jobs = jobsResult.data || []
  
  // Create job pages entries
  const jobPages = jobs.map((job) => ({
    url: `${baseUrl}/jobs/${job.id}`,
    lastModified: new Date(job.updated_at || job.created_at || new Date().toISOString()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
  
  // Get unique companies for company pages
  const companies = [...new Set(jobs.map(job => job.company))]
  const companyPages = companies.map((company) => ({
    url: `${baseUrl}/companies/${encodeURIComponent(company)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  // Get unique locations for location pages
  const locations = [...new Set(jobs.map(job => job.location))]
  const locationPages = locations.map((location) => ({
    url: `${baseUrl}/jobs?location=${encodeURIComponent(location)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))
  
  // Get unique job types for job type pages
  const jobTypes = [...new Set(jobs.map(job => job.job_type))]
  const jobTypePages = jobTypes.map((jobType) => ({
    url: `${baseUrl}/jobs?job_type=${encodeURIComponent(jobType)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    // Main pages
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/jobs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/post-job`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // Dynamic pages
    ...jobPages,
    ...companyPages,
    ...locationPages,
    ...jobTypePages,
  ]
}