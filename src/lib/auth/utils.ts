import { supabase } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

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

  async signUp(email: string, password: string) {
    const { data, error } = await supabase().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    
    if (error) {
      throw new AuthError(error.message)
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

// Server-side auth utilities
export const authServer = {
  async getUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      return null
    }
    
    return user
  },

  async getSession() {
    const supabase = await createClient()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      return null
    }
    
    return session
  },

  async requireAuth() {
    const user = await this.getUser()
    
    if (!user) {
      throw new Error('Authentication required')
    }
    
    return user
  }
}

class AuthError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'AuthError'
  }
}