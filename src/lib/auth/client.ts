import { supabase } from '@/lib/supabase/client'
import { userProfilesClient } from '@/lib/database/user-profiles'

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

    // Create user profile if user was created successfully
    if (data.user && data.user.id && data.user.email) {
      try {
        await userProfilesClient.create({
          id: data.user.id,
          email: data.user.email,
          full_name: null
        })
      } catch (profileError) {
        console.error('Failed to create user profile:', profileError)
        // Don't throw here as the user account was created successfully
        // The profile can be created later if needed
      }
    }
    
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