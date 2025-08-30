import { NextRequest, NextResponse } from 'next/server'
import { openai, isAIEnabled, validateJobData, AIServiceError } from '@/lib/ai/openai-client'
import { createJobDescriptionPrompt } from '@/lib/ai/job-description-prompts'
import { checkRateLimit } from '@/lib/ai/rate-limit'
import { authServer } from '@/lib/auth/server'
import { z } from 'zod'

const enhanceRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().min(1, 'Location is required'),
  jobType: z.enum(['Full-Time', 'Part-Time', 'Contract'], {
    required_error: 'Job type is required'
  }),
  existingDescription: z.string().optional(),
  enhancementType: z.enum(['generate', 'enhance'], {
    required_error: 'Enhancement type is required'
  })
})

export async function POST(request: NextRequest) {
  try {
    // Check if AI features are enabled
    if (!isAIEnabled()) {
      return NextResponse.json(
        { 
          error: 'AI features are currently unavailable',
          success: false 
        },
        { status: 503 }
      )
    }

    // Authenticate user
    const user = await authServer.getUser()
    if (!user) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          success: false 
        },
        { status: 401 }
      )
    }

    // Check rate limit
    const rateLimitResult = checkRateLimit(user.id)
    if (!rateLimitResult.allowed) {
      const resetTimeStr = new Date(rateLimitResult.resetTime).toLocaleTimeString()
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Try again after ${resetTimeStr}`,
          success: false,
          rateLimitExceeded: true,
          resetTime: rateLimitResult.resetTime
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': '10',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = enhanceRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validationResult.error.flatten().fieldErrors,
          success: false
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    // Additional validation for enhancement type
    if (validatedData.enhancementType === 'enhance' && !validatedData.existingDescription) {
      return NextResponse.json(
        {
          error: 'Existing description is required for enhancement',
          success: false
        },
        { status: 400 }
      )
    }

    // Validate job data completeness
    if (!validateJobData(validatedData)) {
      return NextResponse.json(
        {
          error: 'Incomplete job information provided',
          success: false
        },
        { status: 400 }
      )
    }

    // Generate AI-enhanced description
    const enhancedDescription = await generateJobDescription(validatedData)

    return NextResponse.json({
      description: enhancedDescription,
      success: true
    }, {
      headers: {
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
      }
    })

  } catch (error) {
    console.error('AI enhancement error:', error)

    if (error instanceof AIServiceError) {
      return NextResponse.json(
        {
          error: error.message,
          success: false
        },
        { status: 500 }
      )
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request format',
          details: error.flatten().fieldErrors,
          success: false
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to enhance job description',
        success: false
      },
      { status: 500 }
    )
  }
}

async function generateJobDescription(data: z.infer<typeof enhanceRequestSchema>): Promise<string> {
  if (!openai) {
    throw new AIServiceError('OpenAI client not initialized')
  }

  try {
    const prompt = createJobDescriptionPrompt(data)

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional HR specialist and expert copywriter helping to create compelling job descriptions. Create clear, engaging, and comprehensive job descriptions that attract qualified candidates while being honest about requirements and expectations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1200,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    })

    const generatedContent = response.choices[0]?.message?.content

    if (!generatedContent) {
      throw new AIServiceError('No content generated from AI service')
    }

    return generatedContent.trim()

  } catch (error) {
    console.error('OpenAI API error:', error)
    
    if (error instanceof Error) {
      // Handle specific OpenAI errors
      if (error.message.includes('rate limit')) {
        throw new AIServiceError('AI service is temporarily busy. Please try again in a moment.')
      }
      
      if (error.message.includes('quota')) {
        throw new AIServiceError('AI service quota exceeded. Please contact support.')
      }
      
      if (error.message.includes('authentication')) {
        throw new AIServiceError('AI service configuration error.')
      }
    }
    
    throw new AIServiceError('Failed to generate job description. Please try again.')
  }
}