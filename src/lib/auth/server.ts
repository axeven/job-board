import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'

export interface AuthRequirement {
  redirectTo?: string
  redirectWithReturn?: boolean
}

// Server-side auth utilities
export const authServer = {
  async getUser(): Promise<User | null> {
    try {
      const supabase = await createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.warn('Auth check failed:', error.message)
        return null
      }
      
      return user
    } catch (error) {
      console.error('Unexpected auth error:', error)
      return null
    }
  },

  async getSession() {
    try {
      const supabase = await createClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.warn('Session check failed:', error.message)
        return null
      }
      
      return session
    } catch (error) {
      console.error('Unexpected session error:', error)
      return null
    }
  },

  async requireAuth(options: AuthRequirement = {}): Promise<User> {
    const user = await this.getUser()
    
    if (!user) {
      const redirectTo = options.redirectTo || '/auth/login'
      
      if (options.redirectWithReturn) {
        const currentPath = new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
        currentPath.pathname = redirectTo
        currentPath.searchParams.set('redirectedFrom', '/dashboard')
        redirect(currentPath.toString())
      } else {
        redirect(redirectTo)
      }
    }
    
    return user
  },

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser()
    return !!user
  },

  async requirePermission(permission: string): Promise<User> {
    const user = await this.requireAuth()
    
    if (permission === 'post_jobs' || permission === 'manage_jobs') {
      return user
    }
    
    redirect('/dashboard?error=insufficient_permissions')
  }
}