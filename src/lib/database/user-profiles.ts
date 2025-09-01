import { supabase } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'
import type { UserProfileInsert, UserProfileUpdate } from '@/types/database'

// Client-side operations
export const userProfilesClient = {
  async getByUserId(userId: string) {
    const client = supabase()
    try {
      // Check current auth state before making the query
      const { data: { user }, error: authError } = await client.auth.getUser()
      console.log('Auth state during profile fetch:', {
        hasUser: !!user,
        userId: user?.id,
        requestedUserId: userId,
        userMatch: user?.id === userId,
        authError: authError?.message
      })
      
      const result = await client
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle() // Use maybeSingle to handle no rows gracefully
      
      // Log detailed error information for debugging
      if (result.error) {
        console.error('Profile fetch error details:', {
          error: result.error,
          code: result.error.code,
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          userId,
          authUser: user?.id
        })
      }
      
      return result
    } catch (error) {
      console.error('Profile fetch exception:', error)
      return { 
        data: null, 
        error: { 
          message: error instanceof Error ? error.message : 'Unknown error',
          code: '',
          details: null,
          hint: null
        }
      }
    }
  },

  async create(profile: UserProfileInsert) {
    const client = supabase()
    return client
      .from('user_profiles')
      .insert(profile)
      .select()
      .single()
  },

  async update(userId: string, profile: UserProfileUpdate) {
    const client = supabase()
    return client
      .from('user_profiles')
      .update(profile)
      .eq('user_id', userId)
      .select()
      .single()
  }
}

// Server-side operations
export const userProfilesServer = {
  async getByUserId(userId: string) {
    const supabase = await createClient()
    return supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
  },

  async create(profile: UserProfileInsert) {
    const supabase = await createClient()
    return supabase
      .from('user_profiles')
      .insert({
        ...profile,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
  },

  async update(userId: string, profile: UserProfileUpdate) {
    const supabase = await createClient()
    return supabase
      .from('user_profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()
  }
}