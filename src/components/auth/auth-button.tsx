'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useAuth } from '@/lib/auth/context'
import { Button } from '@/components/ui/button'

interface AuthButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  showProfile?: boolean
}

export function AuthButton({ variant = 'primary', size = 'md', showProfile = true }: AuthButtonProps) {
  const { user, loading, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await signOut()
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Failed to sign out:', error)
    } finally {
      setSigningOut(false)
    }
  }

  if (loading) {
    return (
      <Button variant={variant} size={size} disabled>
        Loading...
      </Button>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button
          as={Link}
          href="/auth/login"
          variant="outline"
          size={size}
        >
          Sign in
        </Button>
        <Button
          as={Link}
          href="/auth/signup"
          variant={variant}
          size={size}
        >
          Get started
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {showProfile && (
        <div className="hidden sm:flex items-center gap-3">
          <span className="text-sm text-gray-700">
            {user.email}
          </span>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Dashboard
          </Link>
        </div>
      )}
      
      <Button
        onClick={handleSignOut}
        variant="outline"
        size={size}
        loading={signingOut}
      >
        Sign out
      </Button>
    </div>
  )
}