'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth/context'
import { AuthLoading } from './auth-loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  requirePermission?: string
}

export function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/auth/login',
  requirePermission
}: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      const loginUrl = new URL(redirectTo, window.location.origin)
      loginUrl.searchParams.set('redirectedFrom', pathname)
      router.push(loginUrl.toString())
      return
    }

    if (requirePermission) {
      const hasPermission = checkPermission(user, requirePermission)
      
      if (!hasPermission) {
        router.push('/dashboard?error=insufficient_permissions')
        return
      }
    }

    setIsAuthorized(true)
  }, [user, loading, router, pathname, redirectTo, requirePermission])

  if (loading || (!isAuthorized && user)) {
    return fallback || <AuthLoading />
  }

  if (!user || !isAuthorized) {
    return fallback || <AuthLoading />
  }

  return <>{children}</>
}

export function withAuth<T extends object>(
  Component: React.ComponentType<T>,
  options: Omit<ProtectedRouteProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: T) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

function checkPermission(user: unknown, permission: string): boolean {
  switch (permission) {
    case 'post_jobs':
    case 'manage_jobs':
      return !!user
    default:
      return false
  }
}