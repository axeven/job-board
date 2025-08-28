import { createClient } from '@/lib/supabase/server'

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