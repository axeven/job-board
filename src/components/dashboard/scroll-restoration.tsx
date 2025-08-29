'use client'

import { useEffect } from 'react'

export function ScrollRestoration() {
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('dashboardScrollPosition')
    
    if (savedScrollPosition) {
      const position = parseInt(savedScrollPosition, 10)
      
      // Restore scroll position after a short delay to ensure content is rendered
      const timer = setTimeout(() => {
        window.scrollTo(0, position)
        // Clear the saved position after restoring
        sessionStorage.removeItem('dashboardScrollPosition')
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [])

  return null
}