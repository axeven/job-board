import { redirect } from 'next/navigation'
import { authServer } from '@/lib/auth/server'

interface ServerProtectedProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  requirePermission?: string
}

export async function ServerProtected({ 
  children, 
  redirectTo = '/auth/login',
  requirePermission
}: ServerProtectedProps) {
  const user = await authServer.getUser()

  if (!user) {
    redirect(redirectTo)
  }

  if (requirePermission) {
    await authServer.requirePermission(requirePermission)
  }

  return <>{children}</>
}

export function createProtectedPage<T extends object>(
  PageComponent: React.ComponentType<T>,
  options: {
    redirectTo?: string
    requirePermission?: string
  } = {}
) {
  return async function ProtectedPage(props: T) {
    await authServer.requireAuth({
      redirectTo: options.redirectTo,
      redirectWithReturn: true
    })

    if (options.requirePermission) {
      await authServer.requirePermission(options.requirePermission)
    }

    return <PageComponent {...props} />
  }
}