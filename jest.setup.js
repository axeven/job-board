// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Add global test setup here
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'mock-service-role-key'