import { createClient as createServerClient } from '@/lib/supabase/server'

export interface UserStats {
  totalJobs: number
  activeJobs: number
  totalViews: number
  jobsThisMonth: number
}

export interface UserProfile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
}

export const dashboardServer = {
  // Get user dashboard statistics
  async getUserJobStats(userId: string): Promise<UserStats> {
    const supabase = await createServerClient()
    
    // Get current date for this month calculation
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    try {
      // Get total jobs count
      const { count: totalJobs, error: totalError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      
      if (totalError) {
        console.error('Error fetching total jobs:', totalError)
        throw totalError
      }
      
      // Get active jobs count (assuming we'll add status later, for now all are active)
      const { count: activeJobs, error: activeError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
      
      if (activeError) {
        console.error('Error fetching active jobs:', activeError)
        throw activeError
      }
      
      // Get jobs posted this month
      const { count: jobsThisMonth, error: monthError } = await supabase
        .from('jobs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())
      
      if (monthError) {
        console.error('Error fetching jobs this month:', monthError)
        throw monthError
      }
      
      return {
        totalJobs: totalJobs || 0,
        activeJobs: activeJobs || 0,
        totalViews: 0, // Placeholder for future implementation
        jobsThisMonth: jobsThisMonth || 0
      }
    } catch (error) {
      console.error('Error fetching user job stats:', error)
      return {
        totalJobs: 0,
        activeJobs: 0,
        totalViews: 0,
        jobsThisMonth: 0
      }
    }
  },
  
  // Get user profile information
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = await createServerClient()
    
    try {
      const { data, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Error fetching user profile:', error)
        return null
      }
      
      if (!data.user) {
        return null
      }
      
      return {
        id: data.user.id,
        email: data.user.email || '',
        full_name: data.user.user_metadata?.full_name,
        avatar_url: data.user.user_metadata?.avatar_url,
        created_at: data.user.created_at
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
  },
  
  // Get recent activity (placeholder for future implementation)
  async getRecentActivity(userId: string) {
    // This is a placeholder for future activity tracking
    return []
  }
}