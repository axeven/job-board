import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  // Extended user properties if needed in the future
  displayName?: string
}

export interface AuthError {
  message: string
  status?: number
}

export interface AuthState {
  user: AuthUser | null
  loading: boolean
  error: AuthError | null
}

export type AuthAction = 
  | 'SIGN_IN'
  | 'SIGN_UP' 
  | 'SIGN_OUT'
  | 'PASSWORD_RESET'
  | 'EMAIL_VERIFICATION'