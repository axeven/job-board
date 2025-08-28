import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Successful authentication, redirect to intended page
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // Authentication failed, redirect to login with error
  const redirectUrl = new URL('/auth/login', request.url)
  redirectUrl.searchParams.set('error', 'Authentication failed')
  return NextResponse.redirect(redirectUrl)
}