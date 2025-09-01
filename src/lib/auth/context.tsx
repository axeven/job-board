'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import { userProfilesClient } from '@/lib/database/user-profiles'
import type { UserProfile } from '@/types/database'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
  refreshSession: () => Promise<void>
  isJobSeeker: boolean
  isEmployer: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch user profile - non-blocking for auth operations
  const fetchUserProfile = async (currentUser: User) => {
    console.log('🔍 Fetching profile for user:', currentUser.id)
    console.log('🔍 User metadata:', currentUser.user_metadata)
    
    try {
      console.log('🔍 Starting profile query...')
      const startTime = Date.now()
      const { data, error } = await userProfilesClient.getByUserId(currentUser.id)
      const queryTime = Date.now() - startTime
      console.log('🔍 Profile fetch result:', { data: !!data, error, queryTime: `${queryTime}ms` })
      
      if (!error && data) {
        console.log('✅ Profile found, setting profile')
        setProfile(data)
        return
      }
      
      console.log('❌ No profile found, attempting to create...')
      // Profile doesn't exist, try to create one from user metadata
      if (currentUser.user_metadata?.user_type) {
        console.log('🔨 Creating profile with user_type:', currentUser.user_metadata.user_type)
        
        try {
          const profileData = {
            user_id: currentUser.id,
            user_type: currentUser.user_metadata.user_type,
            full_name: currentUser.user_metadata.full_name || null,
            profile_data: {},
            resume_file_path: null
          }
          console.log('🔨 Profile creation data:', profileData)
          console.log('🔨 Starting profile creation...')
          
          const createStartTime = Date.now()
          const { data: newProfile, error: createError } = await userProfilesClient.create(profileData)
          const createTime = Date.now() - createStartTime
          console.log('🔨 Profile creation result:', { 
            data: !!newProfile, 
            error: createError, 
            createTime: `${createTime}ms`,
            errorDetails: createError ? {
              message: createError.message,
              details: createError.details,
              hint: createError.hint,
              code: createError.code
            } : null
          })
          
          if (!createError && newProfile) {
            console.log('✅ Profile created successfully')
            setProfile(newProfile)
          } else {
            console.error('❌ Profile creation failed:', createError)
            setProfile(null)
          }
        } catch (createError) {
          console.error('❌ Profile creation exception:', {
            error: createError,
            message: createError instanceof Error ? createError.message : 'Unknown error',
            stack: createError instanceof Error ? createError.stack : undefined
          })
          setProfile(null)
        }
      } else {
        console.log('❌ No user_type in metadata, cannot create profile')
        setProfile(null)
      }
    } catch (error) {
      console.error('❌ Error in fetchUserProfile:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      setProfile(null)
    }
    
    console.log('🏁 fetchUserProfile completed')
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('🚀 Starting session initialization...')
      
      try {
        const { data: { session }, error } = await supabase().auth.getSession()
        console.log('🚀 Session result:', { hasSession: !!session, error, userId: session?.user?.id })
        
        if (!error) {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            console.log('👤 Found user, fetching profile in background...')
            // Run profile fetching in background, don't block loading state
            fetchUserProfile(session.user).catch(error => {
              console.error('Background profile fetch failed:', error)
            })
          } else {
            console.log('👤 No user in session')
          }
        } else {
          console.error('❌ Session fetch error:', error)
        }
      } catch (error) {
        console.error('❌ Exception in getInitialSession:', error)
      } finally {
        console.log('🏁 Setting loading to false')
        setLoading(false)
      }
    }

    // Add a timeout to ensure loading state doesn't hang forever
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ Auth initialization timeout, forcing loading to false')
      setLoading(false)
    }, 10000) // 10 second timeout

    getInitialSession().finally(() => {
      clearTimeout(timeoutId)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase().auth.onAuthStateChange(
      async (event, session) => {
        try {
          setSession(session)
          setUser(session?.user ?? null)
          
          if (session?.user) {
            // Run profile fetching in background, don't block auth state changes
            fetchUserProfile(session.user).catch(error => {
              console.error('Background profile fetch failed in auth change:', error)
            })
          } else {
            setProfile(null)
          }
        } catch (error) {
          console.error('Error handling auth state change:', error)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    console.log('🚪 Starting sign out process...')
    setLoading(true)
    try {
      console.log('🚪 Clearing profile state...')
      setProfile(null) // Clear profile on sign out
      console.log('🚪 Calling supabase auth signOut...')
      await supabase().auth.signOut()
      console.log('✅ Sign out successful, state will be updated via onAuthStateChange')
      // State will be updated via onAuthStateChange
    } catch (error) {
      console.error('❌ Error signing out:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
      setLoading(false) // Make sure to stop loading on error
    }
  }

  const refreshSession = async () => {
    const { data: { session } } = await supabase().auth.refreshSession()
    setSession(session)
    setUser(session?.user ?? null)
    
    if (session?.user) {
      await fetchUserProfile(session.user)
    } else {
      setProfile(null)
    }
  }

  // Convenience properties - fallback to user metadata if profile doesn't exist
  const isJobSeeker = profile?.user_type === 'job_seeker' || 
                      (!profile && user?.user_metadata?.user_type === 'job_seeker')
  const isEmployer = profile?.user_type === 'employer' || 
                     (!profile && user?.user_metadata?.user_type === 'employer')

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signOut,
      refreshSession,
      isJobSeeker,
      isEmployer
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}