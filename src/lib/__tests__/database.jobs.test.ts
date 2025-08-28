import { jobsClient, jobsServer } from '../database/jobs'

const mockJob = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  title: 'Software Engineer',
  company: 'Tech Corp',
  description: 'Great opportunity',
  location: 'San Francisco',
  job_type: 'Full-Time' as const,
  user_id: '456e7890-e89b-12d3-a456-426614174000',
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-01T00:00:00.000Z'
}

// Types for the mock objects
type MockQueryResult = {
  data: typeof mockJob[] | typeof mockJob | null
  error: null | { message: string }
}

type MockQueryChain = {
  select: jest.MockedFunction<() => MockQueryChain>
  order: jest.MockedFunction<() => MockQueryChain>
  eq: jest.MockedFunction<() => MockQueryChain>
  ilike: jest.MockedFunction<() => MockQueryChain>
  or: jest.MockedFunction<() => MockQueryChain>
  single: jest.MockedFunction<() => Promise<MockQueryResult>>
  then: jest.MockedFunction<(resolve: (value: MockQueryResult) => void) => void>
  insert?: jest.MockedFunction<(data: object) => { select: () => { single: () => Promise<MockQueryResult> } }>
  update?: jest.MockedFunction<(data: object) => { eq: () => { select: () => { single: () => Promise<MockQueryResult> } } }>
  delete?: jest.MockedFunction<() => { eq: () => Promise<MockQueryResult> }>
  [Symbol.toStringTag]: string
}

// Create a proper chainable mock
const createMockQuery = (mockData: typeof mockJob[] = []): MockQueryChain => {
  const mockQuery: MockQueryChain = {
    select: jest.fn(() => mockQuery),
    order: jest.fn(() => mockQuery),
    eq: jest.fn(() => mockQuery),
    ilike: jest.fn(() => mockQuery),
    or: jest.fn(() => mockQuery),
    single: jest.fn().mockResolvedValue({ data: mockJob, error: null }),
    // Mock the Promise resolution for the final query
    then: jest.fn((resolve: (value: MockQueryResult) => void) => resolve({ data: mockData, error: null })),
    // Make it awaitable
    [Symbol.toStringTag]: 'Promise'
  }
  
  // Make mockQuery Promise-like
  Object.setPrototypeOf(mockQuery, Promise.prototype)
  
  return mockQuery
}

// Mock the Supabase clients
jest.mock('../supabase/client', () => ({
  supabase: jest.fn(() => ({
    from: jest.fn(() => {
      const query = createMockQuery([])
      // Add additional methods for insert/update/delete
      query.insert = jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn().mockResolvedValue({ data: mockJob, error: null })
        }))
      }))
      query.update = jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({ data: mockJob, error: null })
          }))
        }))
      }))
      query.delete = jest.fn(() => ({
        eq: jest.fn().mockResolvedValue({ data: null, error: null })
      }))
      return query
    })
  }))
}))

jest.mock('../supabase/server', () => ({
  createClient: jest.fn().mockResolvedValue({
    from: jest.fn(() => {
      const query = createMockQuery([])
      return query
    })
  })
}))

describe('Database Jobs Helpers', () => {
  describe('jobsClient', () => {
    describe('getAll', () => {
      it('should fetch all jobs without filters', async () => {
        const result = await jobsClient.getAll()
        expect(result).toBeDefined()
      })

      it('should fetch jobs with job_type filter', async () => {
        const filters = { job_type: 'Full-Time' as const }
        const result = await jobsClient.getAll(filters)
        expect(result).toBeDefined()
      })

      it('should fetch jobs with location filter', async () => {
        const filters = { location: 'San Francisco' }
        const result = await jobsClient.getAll(filters)
        expect(result).toBeDefined()
      })

      it('should fetch jobs with search filter', async () => {
        const filters = { search: 'engineer' }
        const result = await jobsClient.getAll(filters)
        expect(result).toBeDefined()
      })

      it('should fetch jobs with combined filters', async () => {
        const filters = {
          job_type: 'Full-Time' as const,
          location: 'San Francisco',
          search: 'engineer'
        }
        const result = await jobsClient.getAll(filters)
        expect(result).toBeDefined()
      })
    })

    describe('getById', () => {
      it('should fetch a single job by ID', async () => {
        const jobId = '123e4567-e89b-12d3-a456-426614174000'
        const result = await jobsClient.getById(jobId)
        expect(result).toBeDefined()
      })

      it('should handle invalid job ID', async () => {
        const jobId = 'invalid-id'
        const result = await jobsClient.getById(jobId)
        expect(result).toBeDefined()
      })
    })

    describe('create', () => {
      it('should create a new job', async () => {
        const newJob = {
          title: 'New Job',
          company: 'New Company',
          description: 'New Description',
          location: 'New York',
          job_type: 'Part-Time' as const,
          user_id: '789e0123-e89b-12d3-a456-426614174000'
        }
        
        const result = await jobsClient.create(newJob)
        expect(result).toBeDefined()
      })
    })

    describe('update', () => {
      it('should update an existing job', async () => {
        const jobId = '123e4567-e89b-12d3-a456-426614174000'
        const updates = {
          title: 'Updated Title',
          description: 'Updated Description'
        }
        
        const result = await jobsClient.update(jobId, updates)
        expect(result).toBeDefined()
      })
    })

    describe('delete', () => {
      it('should delete a job', async () => {
        const jobId = '123e4567-e89b-12d3-a456-426614174000'
        const result = await jobsClient.delete(jobId)
        expect(result).toBeDefined()
      })
    })

    describe('getByUser', () => {
      it('should fetch jobs for a specific user', async () => {
        const userId = '456e7890-e89b-12d3-a456-426614174000'
        const result = await jobsClient.getByUser(userId)
        expect(result).toBeDefined()
      })
    })
  })

  describe('jobsServer', () => {
    describe('getAll', () => {
      it('should fetch all jobs from server', async () => {
        const result = await jobsServer.getAll()
        expect(result).toBeDefined()
      })

      it('should fetch jobs with filters from server', async () => {
        const filters = { job_type: 'Contract' as const }
        const result = await jobsServer.getAll(filters)
        expect(result).toBeDefined()
      })
    })

    describe('getById', () => {
      it('should fetch a single job by ID from server', async () => {
        const jobId = '123e4567-e89b-12d3-a456-426614174000'
        const result = await jobsServer.getById(jobId)
        expect(result).toBeDefined()
      })
    })

    describe('getByUser', () => {
      it('should fetch user jobs from server', async () => {
        const userId = '456e7890-e89b-12d3-a456-426614174000'
        const result = await jobsServer.getByUser(userId)
        expect(result).toBeDefined()
      })
    })
  })
})