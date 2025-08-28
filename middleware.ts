/**
 * Next.js Middleware for Authentication and Session Management
 * 
 * This middleware runs on every request and handles:
 * 1. Supabase session refresh and cookie management
 * 2. Protected route access control
 * 3. Automatic redirects for unauthenticated users
 * 
 * IMPORTANT: This file MUST be at the project root (not in src/) to work with Next.js
 * 
 * Protected Routes:
 * - /dashboard - User's job management interface
 * - /post-job - Job posting creation form
 * 
 * Authentication Flow:
 * 1. User tries to access protected route
 * 2. Middleware checks for valid session
 * 3. If no session, redirects to /auth/login with return URL
 * 4. If session exists, allows access to continue
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@/types/supabase'

/**
 * Middleware function that intercepts all requests
 * @param req - The incoming request object
 * @returns Response with potential redirects or modifications
 */
export async function middleware(req: NextRequest) {
  // Initialize the response that will be modified with auth cookies
  let supabaseResponse = NextResponse.next()

  // Create Supabase client for server-side auth operations
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Read cookies from the incoming request
        getAll() {
          return req.cookies.getAll()
        },
        // Set cookies on the outgoing response
        setAll(cookiesToSet) {
          // Set cookies on the request for immediate use
          cookiesToSet.forEach(({ name, value, options }) => req.cookies.set(name, value))
          
          // Create new response with updated cookies
          supabaseResponse = NextResponse.next({
            request: req,
          })
          
          // Set cookies on the response for client-side access
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh the session if it exists and is valid
  // This ensures the session doesn't expire during user navigation
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define which routes require authentication
  const protectedRoutes = ['/dashboard', '/post-job']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth/login'
    // Save the original URL so user can be redirected back after login
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Return the response with updated auth cookies
  return supabaseResponse
}

/**
 * Middleware configuration that determines which routes the middleware runs on
 * 
 * The matcher uses a regex pattern to include all routes EXCEPT:
 * - _next/static/* - Next.js static assets (CSS, JS, images)
 * - _next/image/* - Next.js optimized images
 * - favicon.ico - Browser favicon requests
 * - api/* - API routes (handled separately)
 * 
 * This ensures middleware only runs on actual page routes where auth matters,
 * not on static assets that would slow down the application.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}