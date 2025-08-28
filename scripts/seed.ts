import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { Database } from '../types/supabase'

// Load environment variables from .env.development for local seeding
// Use .env.local for production seeding
const envFile = process.env.NODE_ENV === 'production' ? '.env.local' : '.env.development'
config({ path: envFile })
console.log(`🔧 Loading environment from ${envFile}`)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Validate environment variables
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in .env.local')
  process.exit(1)
}

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in .env.local')
  process.exit(1)
}

console.log('✅ Environment variables loaded successfully')

// Use service role key for admin operations
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const sampleUsers = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'john@techcorp.com',
    name: 'John Smith'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'sarah@creativestudio.com',
    name: 'Sarah Johnson'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'mike@startupxyz.com',
    name: 'Mike Wilson'
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'lisa@innovatetech.com',
    name: 'Lisa Chen'
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    email: 'alex@websolutions.com',
    name: 'Alex Rodriguez'
  }
]

const sampleJobs = [
  {
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    description: 'We are looking for a senior frontend developer with expertise in React, TypeScript, and modern web technologies. You will work on challenging projects and collaborate with a talented team of engineers.',
    location: 'San Francisco, CA',
    job_type: 'Full-Time' as const,
    user_id: '00000000-0000-0000-0000-000000000001'
  },
  {
    title: 'Part-time UI/UX Designer',
    company: 'Creative Studio',
    description: 'Join our team as a part-time UI/UX designer. Create beautiful and intuitive user experiences for web and mobile applications. Perfect for someone looking for flexible work arrangements.',
    location: 'New York, NY',
    job_type: 'Part-Time' as const,
    user_id: '00000000-0000-0000-0000-000000000002'
  },
  {
    title: 'React Developer (Contract)',
    company: 'StartupXYZ',
    description: 'Contract position for an experienced React developer. Help us build the next generation of our platform using React, Next.js, and GraphQL. Remote work friendly.',
    location: 'Remote',
    job_type: 'Contract' as const,
    user_id: '00000000-0000-0000-0000-000000000003'
  },
  {
    title: 'Full Stack Engineer',
    company: 'InnovateTech',
    description: 'Looking for a full stack engineer to join our growing team. Work with React, Node.js, PostgreSQL, and modern cloud technologies.',
    location: 'Austin, TX',
    job_type: 'Full-Time' as const,
    user_id: '00000000-0000-0000-0000-000000000004'
  },
  {
    title: 'Frontend Developer Intern',
    company: 'WebSolutions',
    description: 'Internship opportunity for a frontend developer. Learn modern web development practices while working on real projects. Great for recent graduates.',
    location: 'Seattle, WA',
    job_type: 'Part-Time' as const,
    user_id: '00000000-0000-0000-0000-000000000005'
  }
]

async function createSampleUsers() {
  console.log('👥 Creating sample users...')
  const createdUsers: Array<{email: string, id: string}> = []
  
  for (const user of sampleUsers) {
    try {
      // Create user using Supabase Auth Admin API
      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: 'password123', // Dummy password for development
        email_confirm: true,
        user_metadata: {
          name: user.name
        }
      })
      
      if (error) {
        if (error.message.includes('already been registered')) {
          // User already exists, find them by email
          const { data: allUsers } = await supabase.auth.admin.listUsers()
          const existingUser = allUsers.users.find(u => u.email === user.email)
          if (existingUser) {
            createdUsers.push({ email: user.email, id: existingUser.id })
            console.log(`✅ Using existing user: ${user.email} (${existingUser.id})`)
          } else {
            console.warn(`⚠️ Could not find existing user: ${user.email}`)
          }
        } else {
          console.warn(`⚠️ Warning: Could not create user ${user.email}:`, error.message)
        }
      } else if (data.user) {
        createdUsers.push({ email: user.email, id: data.user.id })
        console.log(`✅ Created user: ${user.email}`)
      }
    } catch (error) {
      console.warn(`⚠️ Warning: Could not create user ${user.email}:`, error)
    }
  }
  
  return createdUsers
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...')
  
  try {
    // Step 1: Create sample users
    const createdUsers = await createSampleUsers()
    
    if (createdUsers.length === 0) {
      console.error('❌ No users were created or found')
      process.exit(1)
    }
    
    // Step 2: Create jobs with actual user IDs
    const jobsWithRealUserIds = sampleJobs.map((job, index) => ({
      ...job,
      user_id: createdUsers[index]?.id || createdUsers[0].id
    }))
    
    // Step 3: Clear existing sample jobs (using actual user IDs)
    const userIds = createdUsers.map(user => user.id)
    const { error: deleteError } = await supabase
      .from('jobs')
      .delete()
      .in('user_id', userIds)
    
    if (deleteError) {
      console.warn('⚠️ Warning: Could not clear existing sample jobs:', deleteError)
    }

    // Step 4: Insert sample jobs
    console.log('💼 Creating sample jobs...')
    const { data, error } = await supabase
      .from('jobs')
      .insert(jobsWithRealUserIds)
      .select()
    
    if (error) {
      throw error
    }
    
    console.log(`✅ Successfully seeded ${data.length} jobs`)
    console.log('🌱 Database seeding completed!')
    
    // Display summary
    console.log('\n📋 Seeding Summary:')
    console.log(`👥 Users: ${createdUsers.length}`)
    console.log(`💼 Jobs: ${data.length}`)
    createdUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.id})`)
    })
    
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

seedDatabase()