'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface UnsavedChangesGuardProps {
  hasUnsavedChanges: boolean
  message?: string
}

export function UnsavedChangesGuard({ 
  hasUnsavedChanges, 
  message = 'You have unsaved changes. Are you sure you want to leave without saving?' 
}: UnsavedChangesGuardProps) {
  const router = useRouter()

  useEffect(() => {
    // Warn before browser navigation (refresh, close tab, back button)
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        // Modern browsers ignore custom messages and show their own
        e.returnValue = message
        return message
      }
    }

    // Note: Next.js 13+ App Router doesn't have routeChangeStart
    // We handle navigation through click and popstate events instead

    if (hasUnsavedChanges) {
      // Add browser navigation warning
      window.addEventListener('beforeunload', handleBeforeUnload)
      
      // For Next.js 13+ App Router, we need to handle this differently
      // since routeChangeStart is not available
      // We'll use a combination of click and popstate events
      
      const handleLinkClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const link = target.closest('a')
        
        if (link && link.href && !link.href.startsWith('javascript:') && !link.href.startsWith('#')) {
          // Check if it's an internal link
          const url = new URL(link.href, window.location.origin)
          if (url.origin === window.location.origin && url.pathname !== window.location.pathname) {
            if (!confirm(message)) {
              e.preventDefault()
              e.stopPropagation()
            }
          }
        }
      }

      const handlePopState = () => {
        if (!confirm(message)) {
          // Push the current state back
          history.pushState(null, '', window.location.href)
        }
      }

      document.addEventListener('click', handleLinkClick, true)
      window.addEventListener('popstate', handlePopState)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload)
        document.removeEventListener('click', handleLinkClick, true)
        window.removeEventListener('popstate', handlePopState)
      }
    }
  }, [hasUnsavedChanges, message, router])

  return null // This component doesn't render anything
}

// Hook version for more advanced usage
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean, message?: string) {
  return UnsavedChangesGuard({ hasUnsavedChanges, message })
}

// Higher-order component version
export function withUnsavedChangesGuard<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  hasUnsavedChanges: boolean,
  message?: string
) {
  return function WithUnsavedChangesGuard(props: P) {
    return (
      <>
        <UnsavedChangesGuard hasUnsavedChanges={hasUnsavedChanges} message={message} />
        <WrappedComponent {...props} />
      </>
    )
  }
}