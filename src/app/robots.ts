import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/jobs',
          '/jobs/*',
          '/companies/*',
          '/auth/login',
          '/auth/register',
        ],
        disallow: [
          '/dashboard',
          '/dashboard/*',
          '/api/*',
          '/auth/reset-password',
          '/auth/verify',
          '/_next/*',
          '/admin/*',
        ],
      },
      {
        userAgent: 'GPTBot',
        disallow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: '/',
      },
      {
        userAgent: 'CCBot',
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}