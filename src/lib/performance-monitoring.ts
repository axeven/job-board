/**
 * Frontend Performance Monitoring Library
 * 
 * This library helps you measure and understand your website's performance from the user's perspective.
 * It tracks Core Web Vitals and other important metrics that affect user experience.
 * 
 * === CORE WEB VITALS (Google's key metrics) ===
 * 1. LCP (Largest Contentful Paint) - Loading performance
 * 2. CLS (Cumulative Layout Shift) - Visual stability  
 * 3. FID (First Input Delay) - Interactivity
 * 
 * === HOW TO USE ===
 * ```typescript
 * import { performanceMonitor, usePerformanceMonitoring } from '@/lib/performance-monitoring'
 * 
 * // In a React component:
 * usePerformanceMonitoring('jobs-page')
 * 
 * // Or manually:
 * window.addEventListener('load', () => {
 *   const metrics = performanceMonitor.measurePageLoad('home-page')
 *   console.log('Page loaded in:', metrics?.loadTime, 'ms')
 * })
 * 
 * // Monitor specific Web Vitals:
 * performanceMonitor.observeLargestContentfulPaint((lcp) => {
 *   if (lcp > 2500) console.warn('LCP is poor:', lcp, 'ms')
 * })
 * ```
 * 
 * === WHAT GOOD SCORES LOOK LIKE ===
 * - LCP: < 2.5 seconds ✅
 * - FID: < 100 milliseconds ✅
 * - CLS: < 0.1 ✅
 * - FCP: < 1.8 seconds ✅
 * - TTFB: < 800 milliseconds ✅
 */

export interface PerformanceMetrics {
  page: string
  
  // === LOADING PERFORMANCE ===
  /** 
   * Total page load time in milliseconds (from navigation start to load event)
   * Good: < 3000ms, Poor: > 5000ms
   * Measures how long it takes for the entire page and all resources to load
   */
  loadTime?: number
  
  /** 
   * Time until DOM is fully loaded and parsed (in milliseconds)
   * Good: < 1500ms, Poor: > 3000ms
   * When the HTML document has been completely loaded and parsed
   */
  domContentLoaded?: number
  
  /** 
   * Time to First Paint (FP) - when browser renders first pixels (in milliseconds)
   * Good: < 1000ms, Poor: > 2000ms
   * First visual change the user sees (even if it's just background color)
   */
  firstPaint?: number
  
  /** 
   * First Contentful Paint (FCP) - when first text/image is rendered (in milliseconds)
   * Good: < 1800ms, Needs Improvement: 1800-3000ms, Poor: > 3000ms
   * When the first text, image, or other content becomes visible to users
   */
  firstContentfulPaint?: number
  
  /** 
   * Largest Contentful Paint (LCP) - when largest content element is rendered (in milliseconds)
   * Good: < 2500ms, Needs Improvement: 2500-4000ms, Poor: > 4000ms
   * Loading performance - measures when the main content is likely visible
   */
  largestContentfulPaint?: number
  
  // === USER EXPERIENCE METRICS ===
  /** 
   * Cumulative Layout Shift (CLS) - visual stability score (unitless)
   * Good: < 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25
   * Measures unexpected layout shifts that cause elements to move around
   */
  cumulativeLayoutShift?: number
  
  /** 
   * First Input Delay (FID) - interactivity delay in milliseconds
   * Good: < 100ms, Needs Improvement: 100-300ms, Poor: > 300ms
   * Time from user's first interaction to browser's response
   */
  firstInputDelay?: number
  
  // === NETWORK PERFORMANCE ===
  /** 
   * Time to First Byte (TTFB) - server response time in milliseconds
   * Good: < 800ms, Needs Improvement: 800-1800ms, Poor: > 1800ms
   * Time from navigation start to when browser receives first byte from server
   */
  timeToFirstByte?: number
  
  /** Raw navigation timing data for detailed analysis */
  navigationTiming?: PerformanceNavigationTiming
}

export const performanceMonitor = {
  /**
   * Measures comprehensive page loading performance metrics
   * Call this after the page has fully loaded (e.g., in window 'load' event)
   * 
   * @param pageName - Identifier for the page (e.g., 'home', 'jobs-list', 'job-detail')
   * @returns Object with all measured performance metrics or null if measurement fails
   * 
   * Example usage:
   * ```js
   * window.addEventListener('load', () => {
   *   setTimeout(() => performanceMonitor.measurePageLoad('jobs-page'), 100)
   * })
   * ```
   */
  measurePageLoad: (pageName: string): PerformanceMetrics | null => {
    if (typeof window === 'undefined') return null

    try {
      // Get navigation timing data (when page started loading, when resources finished, etc.)
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (!navigationTiming) return null

      // Get paint timing data (when visual elements first appeared)
      const paintEntries = performance.getEntriesByType('paint')
      const firstPaint = paintEntries.find(entry => entry.name === 'first-paint')
      const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint')

      const metrics: PerformanceMetrics = {
        page: pageName,
        // Total time from navigation start to load event complete
        loadTime: navigationTiming.loadEventEnd - navigationTiming.fetchStart,
        // Time until DOM parsing is complete (HTML fully loaded)
        domContentLoaded: navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart,
        // When first visual change occurs (even if just background color)
        firstPaint: firstPaint?.startTime,
        // When first meaningful content (text/images) becomes visible
        firstContentfulPaint: firstContentfulPaint?.startTime,
        // Server response time (how fast your backend/CDN responds)
        timeToFirstByte: navigationTiming.responseStart - navigationTiming.requestStart,
        // Raw timing data for detailed analysis
        navigationTiming,
      }

      // Log metrics for debugging in development
      if (process.env.NODE_ENV === 'development') {
        console.group(`📊 Performance Metrics for ${pageName}`)
        console.log('🚀 Load Time:', `${metrics.loadTime?.toFixed(0)}ms`)
        console.log('📄 DOM Content Loaded:', `${metrics.domContentLoaded?.toFixed(0)}ms`)
        console.log('🎨 First Paint:', `${metrics.firstPaint?.toFixed(0)}ms`)
        console.log('📝 First Contentful Paint:', `${metrics.firstContentfulPaint?.toFixed(0)}ms`)
        console.log('⚡ Time to First Byte:', `${metrics.timeToFirstByte?.toFixed(0)}ms`)
        console.groupEnd()
      }

      // In production, send to analytics service
      if (process.env.NODE_ENV === 'production') {
        // Example: sendToAnalytics(metrics)
        // You can integrate with services like Google Analytics, Vercel Analytics, etc.
      }

      return metrics
    } catch (error) {
      console.warn('Failed to collect performance metrics:', error)
      return null
    }
  },

  measureResourceLoad: (resourceUrl: string): PerformanceResourceTiming | null => {
    if (typeof window === 'undefined') return null

    try {
      const resourceTiming = performance
        .getEntriesByType('resource')
        .find(entry => entry.name.includes(resourceUrl)) as PerformanceResourceTiming

      if (resourceTiming && process.env.NODE_ENV === 'development') {
        console.log(`Resource ${resourceUrl} load time:`, {
          duration: resourceTiming.duration,
          transferSize: resourceTiming.transferSize,
          encodedBodySize: resourceTiming.encodedBodySize,
        })
      }

      return resourceTiming || null
    } catch (error) {
      console.warn('Failed to measure resource load:', error)
      return null
    }
  },

  /**
   * Observes Largest Contentful Paint (LCP) - Core Web Vital for loading performance
   * 
   * LCP measures when the largest text block or image element becomes visible.
   * This tells us when the main content is likely loaded and visible to users.
   * 
   * Why it matters:
   * - Users want to see the main content quickly
   * - Google uses LCP as a ranking factor
   * - Poor LCP means users might leave before seeing your content
   * 
   * Common causes of poor LCP:
   * - Slow server response times
   * - Large, unoptimized images  
   * - Blocking JavaScript/CSS
   * - Client-side rendering delays
   * 
   * @param callback - Function called with LCP value in milliseconds
   */
  observeLargestContentfulPaint: (callback: (lcp: number) => void): void => {
    if (typeof window === 'undefined') return

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        // Get the most recent LCP entry (it can change as larger elements load)
        const lastEntry = entries[entries.length - 1] as PerformanceEntry
        callback(lastEntry.startTime)
      })

      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (error) {
      console.warn('LCP observation not supported:', error)
    }
  },

  /**
   * Observes Cumulative Layout Shift (CLS) - Core Web Vital for visual stability
   * 
   * CLS measures unexpected layout shifts that push content around as the page loads.
   * A score of 0 means no shifts, higher scores mean more disruptive shifts.
   * 
   * Why it matters:
   * - Users get frustrated when content jumps around
   * - Can cause accidental clicks on wrong elements
   * - Google uses CLS as a ranking factor
   * - Creates a poor user experience
   * 
   * Common causes of high CLS:
   * - Images without defined dimensions
   * - Ads/widgets loaded dynamically
   * - Web fonts causing text to shift
   * - Content injected above existing content
   * 
   * How to fix:
   * - Always specify image dimensions
   * - Reserve space for dynamic content
   * - Use font-display: swap carefully
   * - Load critical resources first
   * 
   * @param callback - Function called with cumulative CLS score (unitless)
   */
  observeCumulativeLayoutShift: (callback: (cls: number) => void): void => {
    if (typeof window === 'undefined') return

    try {
      let cumulativeScore = 0

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & { 
            hadRecentInput?: boolean 
            value?: number 
          }
          // Only count shifts that weren't caused by user interaction
          if (!layoutShiftEntry.hadRecentInput) {
            cumulativeScore += layoutShiftEntry.value || 0
          }
        }
        callback(cumulativeScore)
      })

      observer.observe({ entryTypes: ['layout-shift'] })
    } catch (error) {
      console.warn('CLS observation not supported:', error)
    }
  },

  /**
   * Observes First Input Delay (FID) - Core Web Vital for interactivity
   * 
   * FID measures the delay between user's first interaction (click, tap, key press) 
   * and when the browser can respond to that interaction.
   * 
   * Why it matters:
   * - Users expect immediate feedback when they interact
   * - Long delays make the site feel broken or frozen
   * - Google uses FID as a ranking factor
   * - Poor FID indicates JavaScript is blocking the main thread
   * 
   * Common causes of poor FID:
   * - Heavy JavaScript execution during load
   * - Large JavaScript bundles
   * - Long-running tasks that block the main thread
   * - Third-party scripts that aren't optimized
   * 
   * How to improve FID:
   * - Code splitting to reduce JavaScript bundle size
   * - Defer non-critical JavaScript
   * - Use web workers for heavy computations
   * - Optimize third-party code
   * - Break up long tasks with setTimeout
   * 
   * @param callback - Function called with FID value in milliseconds
   */
  observeFirstInputDelay: (callback: (fid: number) => void): void => {
    if (typeof window === 'undefined') return

    try {
      const observer = new PerformanceObserver((list) => {
        const firstEntry = list.getEntries()[0] as PerformanceEntry & {
          processingStart?: number
        }
        // Calculate delay between user input and browser processing
        const fid = (firstEntry.processingStart || 0) - firstEntry.startTime
        callback(fid)
      })

      observer.observe({ entryTypes: ['first-input'] })
    } catch (error) {
      console.warn('FID observation not supported:', error)
    }
  },
}

// Hook for using performance monitoring in React components
export function usePerformanceMonitoring(pageName: string) {
  if (typeof window === 'undefined') return

  // Measure initial load
  window.addEventListener('load', () => {
    // Slight delay to ensure all metrics are available
    setTimeout(() => {
      performanceMonitor.measurePageLoad(pageName)
    }, 100)
  })

  // Observe Web Vitals
  performanceMonitor.observeLargestContentfulPaint((lcp) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`LCP for ${pageName}:`, lcp)
    }
  })

  performanceMonitor.observeCumulativeLayoutShift((cls) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`CLS for ${pageName}:`, cls)
    }
  })

  performanceMonitor.observeFirstInputDelay((fid) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`FID for ${pageName}:`, fid)
    }
  })
}