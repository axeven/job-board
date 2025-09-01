import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { User } from '@supabase/supabase-js'
import { userProfilesServer } from '@/lib/database/user-profiles'
import type { UserProfile } from '@/types/database'

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
        // Get the current path from headers
        const { headers } = await import('next/headers')
        const headersList = await headers()
        const pathname = headersList.get('x-pathname') || '/post-job'
        
        const loginUrl = new URL(redirectTo, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
        loginUrl.searchParams.set('return', pathname)
        redirect(loginUrl.toString())
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

  async getUserProfile(): Promise<{ user: User; profile: UserProfile | null }> {
    const user = await this.requireAuth()
    
    try {
      const { data: profile, error } = await userProfilesServer.getByUserId(user.id)
      
      if (error) {
        console.error('Failed to fetch user profile:', error)
        return { user, profile: null }
      }
      
      return { user, profile }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return { user, profile: null }
    }
  },

  async requireEmployer(): Promise<{ user: User; profile: UserProfile }> {
    const { user, profile } = await this.getUserProfile()
    
    // If no profile exists, check user metadata for fallback
    const userType = profile?.user_type || user.user_metadata?.user_type
    
    if (userType !== 'employer') {
      redirect('/dashboard?error=employer_access_required')
    }
    
    // If profile doesn't exist but user is an employer via metadata, still allow access
    return { user, profile: profile || {
      id: '',
      user_id: user.id,
      user_type: 'employer' as const,
      full_name: user.user_metadata?.full_name || null,
      profile_data: {},
      resume_file_path: null,
      created_at: null,
      updated_at: null
    }}
  },

  async requirePermission(permission: string): Promise<User> {
    const user = await this.requireAuth()
    
    if (permission === 'post_jobs' || permission === 'manage_jobs') {
      return user
    }
    
    redirect('/dashboard?error=insufficient_permissions')
  }
}