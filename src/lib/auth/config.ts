export const authConfig = {
  // Redirect paths
  redirects: {
    login: '/auth/login',
    signup: '/auth/signup',
    dashboard: '/dashboard',
    afterLogin: '/dashboard',
    afterSignup: '/auth/verify-email'
  },

  // Protected route patterns
  protectedRoutes: [
    '/dashboard',
    '/post-job'
  ],

  // Public routes that don't require auth
  publicRoutes: [
    '/',
    '/jobs',
    '/auth'
  ],

  // OAuth providers (for future enhancement)
  providers: {
    google: {
      enabled: false,
      scopes: 'email profile'
    },
    github: {
      enabled: false,
      scopes: 'user:email'
    }
  }
}