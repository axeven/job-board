import { supabase } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'
import type { UserProfileInsert, UserProfileUpdate } from '@/types/database'

// Client-side operations
export const userProfilesClient = {
  async getByUserId(userId: string) {
    const client = supabase()
    return client
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()
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