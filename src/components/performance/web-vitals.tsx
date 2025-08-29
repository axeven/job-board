'use client'

import { useReportWebVitals } from 'next/web-vitals'

interface WebVitalsProps {
  debug?: boolean
}

export function WebVitals({ debug = false }: WebVitalsProps) {
  useReportWebVitals((metric) => {
    // Log in development or debug mode
    if (debug || process.env.NODE_ENV === 'development') {
      console.log('Web Vital:', metric)
    }

    // In production, you would send these to your analytics service
    if (process.env.NODE_ENV === 'production') {
      // Example implementations:
      
      // Google Analytics 4
      if (typeof window !== 'undefined' && 'gtag' in window) {
        const gtag = (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag
        gtag('event', metric.name, {
          custom_parameter_1: metric.value,
          custom_parameter_2: metric.id,
          custom_parameter_3: metric.label,
        })
      }

      // Vercel Analytics (if using @vercel/analytics)
      // analytics.track(metric.name, {
      //   value: metric.value,
      //   label: metric.label,
      //   id: metric.id,
      // })

      // Custom analytics endpoint
      // fetch('/api/analytics/web-vitals', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(metric),
      // })
    }

    // Performance thresholds based on Core Web Vitals
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      LCP: { good: 2500, poor: 4000 },
      FCP: { good: 1800, poor: 3000 },
      TTFB: { good: 800, poor: 1800 },
    }

    const threshold = thresholds[metric.name as keyof typeof thresholds]
    if (threshold) {
      const rating = 
        metric.value <= threshold.good ? 'good' : 
        metric.value <= threshold.poor ? 'needs-improvement' : 
        'poor'

      // Log performance issues in development
      if (debug || process.env.NODE_ENV === 'development') {
        if (rating === 'poor') {
          console.warn(`Poor ${metric.name} performance:`, {
            value: metric.value,
            threshold: threshold.poor,
            rating,
          })
        }
      }

      // You could also trigger alerts for poor performance in production
      if (process.env.NODE_ENV === 'production' && rating === 'poor') {
        // Example: send alert to monitoring service
        console.warn(`Performance alert: Poor ${metric.name}`, metric.value)
      }
    }
  })

  return null // This component doesn't render anything
}

// Performance monitoring component for specific pages
interface PagePerformanceMonitorProps {
  pageName: string
  children: React.ReactNode
}

export function PagePerformanceMonitor({ 
  pageName, 
  children 
}: PagePerformanceMonitorProps) {
  // Custom performance tracking for specific pages
  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const startTime = performance.now()
    
    // Track page load completion
    const handleLoad = () => {
      const loadTime = performance.now() - startTime
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`${pageName} total load time:`, loadTime)
      }

      // Track component-specific metrics
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigationTiming) {
        const metrics = {
          pageName,
          componentLoadTime: loadTime,
          domInteractive: navigationTiming.domInteractive - navigationTiming.fetchStart,
          domComplete: navigationTiming.domComplete - navigationTiming.fetchStart,
        }

        if (process.env.NODE_ENV === 'development') {
          console.log(`${pageName} component metrics:`, metrics)
        }
      }
    }

    // Track when page becomes interactive
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad, { once: true })
    }

    return () => {
      window.removeEventListener('load', handleLoad)
    }
  }, [pageName])

  return <>{children}</>
}

// React hook import
import React from 'react'