import { supabase } from '@/lib/supabase/client'

// Client-side auth utilities
export const authClient = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase().auth.signInWithPassword({
      email,
      password
    })
    
    if (error) {
      throw new AuthError(error.message)
    }
    
    return data
  },

  async signUp(email: string, password: string, userType: 'employer' | 'job_seeker' = 'job_seeker') {
    const { data, error } = await supabase().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          user_type: userType
        }
      }
    })
    
    if (error) {
      throw new AuthError(error.message)
    }

    // Profile creation is handled by AuthProvider in auth context
    // to avoid race conditions and duplicate key errors
    
    return data
  },

  async signOut() {
    const { error } = await supabase().auth.signOut()
    
    if (error) {
      throw new AuthError(error.message)
    }
  },

  async resetPassword(email: string) {
    const { error } = await supabase().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`
    })
    
    if (error) {
      throw new AuthError(error.message)
    }
  }
}

class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'AuthError'
  }
}