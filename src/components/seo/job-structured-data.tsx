import type { Job } from '@/types/database'

interface JobStructuredDataProps {
  job: Job
}

export function JobStructuredData({ job }: JobStructuredDataProps) {
  // Map job_type to schema.org employment type
  const getEmploymentType = (jobType: string) => {
    const typeMap: Record<string, string> = {
      'full-time': 'FULL_TIME',
      'part-time': 'PART_TIME',
      'contract': 'CONTRACTOR',
      'remote': 'OTHER',
      'freelance': 'OTHER'
    }
    return typeMap[jobType] || 'OTHER'
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description.replace(/<[^>]*>/g, ''), // Strip HTML tags
    datePosted: job.created_at,
    employmentType: getEmploymentType(job.job_type),
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company,
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
      },
    },
    identifier: {
      '@type': 'PropertyValue',
      name: 'Job ID',
      value: job.id,
    },
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/${job.id}`,
    workHours: job.job_type === 'Full-Time' ? '40 hours per week' : undefined,
  }

  // Remove undefined values
  const cleanStructuredData = JSON.parse(
    JSON.stringify(structuredData, (key, value) => value === undefined ? undefined : value)
  )

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(cleanStructuredData, null, 0) 
      }}
    />
  )
}

// Breadcrumb structured data for job pages
interface JobBreadcrumbProps {
  job: Job
}

export function JobBreadcrumbStructuredData({ job }: JobBreadcrumbProps) {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Jobs',
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: job.title,
        item: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/${job.id}`,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(breadcrumbData, null, 0) 
      }}
    />
  )
}

// Organization structured data for company pages
interface OrganizationStructuredDataProps {
  company: string
  logoUrl?: string
  jobs: Job[]
}

export function OrganizationStructuredData({ 
  company, 
  logoUrl, 
  jobs 
}: OrganizationStructuredDataProps) {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company,
    logo: logoUrl || undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/companies/${encodeURIComponent(company)}`,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Job Listings',
      itemListElement: jobs.map((job, index) => ({
        '@type': 'Offer',
        position: index + 1,
        itemOffered: {
          '@type': 'JobPosting',
          title: job.title,
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs/${job.id}`,
        },
      })),
    },
  }

  // Remove undefined values
  const cleanOrganizationData = JSON.parse(
    JSON.stringify(organizationData, (key, value) => value === undefined ? undefined : value)
  )

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(cleanOrganizationData, null, 0) 
      }}
    />
  )
}

// Website structured data for the main site
export function WebsiteStructuredData() {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Job Board',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    description: 'Find your dream job or post job openings. Connect employers with talented professionals.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/jobs?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Job Board',
      url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(websiteData, null, 0) 
      }}
    />
  )
}