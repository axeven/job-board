# AI-Assisted Job Description Enhancement Plan

## Overview

This plan outlines the implementation of AI-powered job description enhancement functionality for the job board application. The feature will allow users to generate or improve job descriptions based on their input during job creation and editing workflows.

## Current State Analysis

### Existing Job Forms
- **Job Creation Form** (`src/components/jobs/job-creation-form.tsx`)
  - Fields: title, company, location, job_type, description (rich text editor)
  - Uses server actions for form submission
  - Supports draft saving functionality
  
- **Job Edit Form** (`src/components/jobs/job-edit-form.tsx`)  
  - Same field structure as creation form
  - Includes unsaved changes tracking
  - Pre-populated with existing job data

### Current Tech Stack Integration Points
- **Server Actions**: Form processing via `src/lib/actions/job-actions.ts`
- **Validation**: Zod schema validation (`src/lib/schemas/job-schema.ts`)
- **Rich Text Editor**: Custom component for description input
- **Database**: Supabase with TypeScript integration

## Feature Requirements

### Core Functionality
1. **AI Description Generation**: Generate complete job descriptions from minimal input
2. **AI Description Enhancement**: Improve existing partial descriptions
3. **Context-Aware Suggestions**: Use title, company, location, and job type as context
4. **Real-time Preview**: Show AI-generated content before applying
5. **User Control**: Allow users to accept, reject, or modify AI suggestions

### User Experience Goals
- Seamless integration into existing forms
- Non-disruptive workflow (optional enhancement)
- Fast response times (< 3 seconds)
- Clear indication of AI-generated content
- Easy editing and refinement

## Technical Implementation Plan

### 1. API Integration Setup

#### 1.1 Environment Configuration
```typescript
// Add to .env.local
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_AI_FEATURES_ENABLED=true
```

#### 1.2 OpenAI SDK Installation
```bash
npm install openai
npm install @types/openai --save-dev
```

#### 1.3 AI Service Layer
Create `src/lib/ai/openai-client.ts`:
```typescript
import OpenAI from 'openai'
import { env } from '@/lib/env'

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
})

export interface JobDescriptionPrompt {
  title: string
  company: string
  location: string
  jobType: string
  existingDescription?: string
  enhancementType: 'generate' | 'enhance'
}
```

### 2. API Route Implementation

#### 2.1 Job Description Enhancement Endpoint
Create `src/app/api/ai/enhance-job-description/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { openai } from '@/lib/ai/openai-client'
import { authServer } from '@/lib/auth/server'
import { z } from 'zod'

const enhanceRequestSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  location: z.string().min(1),
  jobType: z.enum(['Full-Time', 'Part-Time', 'Contract']),
  existingDescription: z.string().optional(),
  enhancementType: z.enum(['generate', 'enhance'])
})

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await authServer.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate request body
    const body = await request.json()
    const validatedData = enhanceRequestSchema.parse(body)

    // Generate AI-enhanced description
    const enhancedDescription = await generateJobDescription(validatedData)

    return NextResponse.json({ 
      description: enhancedDescription,
      success: true 
    })
  } catch (error) {
    console.error('AI enhancement error:', error)
    return NextResponse.json(
      { error: 'Failed to enhance job description' },
      { status: 500 }
    )
  }
}

async function generateJobDescription(data: z.infer<typeof enhanceRequestSchema>) {
  const prompt = createJobDescriptionPrompt(data)
  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are a professional HR specialist helping to write compelling job descriptions. Create clear, engaging, and comprehensive job descriptions that attract qualified candidates.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 1000,
    temperature: 0.7,
  })

  return response.choices[0]?.message?.content || ''
}
```

#### 2.2 Prompt Engineering
Create `src/lib/ai/job-description-prompts.ts`:
```typescript
import type { JobDescriptionPrompt } from './openai-client'

export function createJobDescriptionPrompt(data: JobDescriptionPrompt): string {
  if (data.enhancementType === 'generate') {
    return generatePrompt(data)
  } else {
    return enhancePrompt(data)
  }
}

function generatePrompt(data: JobDescriptionPrompt): string {
  return `Create a comprehensive job description for the following position:

Job Title: ${data.title}
Company: ${data.company}
Location: ${data.location}
Job Type: ${data.jobType}

Please include the following sections:
- Brief company/role overview
- Key responsibilities (5-7 bullet points)
- Required qualifications
- Preferred qualifications
- Benefits and compensation overview
- Application instructions

Make it professional, engaging, and tailored to attract qualified candidates. Use clear formatting with headers and bullet points.`
}

function enhancePrompt(data: JobDescriptionPrompt): string {
  return `Enhance and improve the following job description:

Job Title: ${data.title}
Company: ${data.company}  
Location: ${data.location}
Job Type: ${data.jobType}

Current Description:
${data.existingDescription}

Please improve this description by:
- Making it more engaging and professional
- Adding any missing key sections (responsibilities, qualifications, benefits)
- Improving clarity and readability
- Ensuring it attracts qualified candidates
- Maintaining the original intent and key information

Return the enhanced version with proper formatting.`
}
```

### 3. Frontend Components

#### 3.1 AI Enhancement Button Component
Create `src/components/jobs/ai-description-enhancer.tsx`:
```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, Check, X } from 'lucide-react'

interface AIDescriptionEnhancerProps {
  title: string
  company: string
  location: string
  jobType: string
  currentDescription?: string
  onDescriptionChange: (description: string) => void
}

export function AIDescriptionEnhancer({
  title,
  company,
  location,
  jobType,
  currentDescription,
  onDescriptionChange
}: AIDescriptionEnhancerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  const canEnhance = title && company && location && jobType

  const handleEnhance = async () => {
    if (!canEnhance) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/enhance-job-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          company,
          location,
          jobType,
          existingDescription: currentDescription,
          enhancementType: currentDescription ? 'enhance' : 'generate'
        })
      })

      const data = await response.json()
      if (data.success) {
        setAiSuggestion(data.description)
        setShowPreview(true)
      }
    } catch (error) {
      console.error('AI enhancement failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = () => {
    if (aiSuggestion) {
      onDescriptionChange(aiSuggestion)
      setShowPreview(false)
      setAiSuggestion(null)
    }
  }

  const handleReject = () => {
    setShowPreview(false)
    setAiSuggestion(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleEnhance}
          disabled={!canEnhance || isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {currentDescription ? 'Enhance with AI' : 'Generate with AI'}
        </Button>
        
        {!canEnhance && (
          <p className="text-sm text-gray-500">
            Fill in title, company, location, and job type to use AI enhancement
          </p>
        )}
      </div>

      {showPreview && aiSuggestion && (
        <div className="border rounded-lg p-4 bg-blue-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-blue-900">AI Generated Description</h4>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAccept} className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={handleReject} className="flex items-center gap-1">
                <X className="h-3 w-3" />
                Reject
              </Button>
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 bg-white p-3 rounded border">
              {aiSuggestion}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

#### 3.2 Rich Text Editor Integration
Update `src/components/ui/rich-text-editor.tsx` to include AI enhancement:
```typescript
// Add AI enhancer integration
import { AIDescriptionEnhancer } from '@/components/jobs/ai-description-enhancer'

interface RichTextEditorProps {
  // ... existing props
  enableAIEnhancement?: boolean
  jobContext?: {
    title: string
    company: string
    location: string
    jobType: string
  }
}

export function RichTextEditor({ 
  enableAIEnhancement = false,
  jobContext,
  // ... other props 
}: RichTextEditorProps) {
  // ... existing implementation

  return (
    <div className="space-y-4">
      {enableAIEnhancement && jobContext && (
        <AIDescriptionEnhancer
          {...jobContext}
          currentDescription={value}
          onDescriptionChange={onChange}
        />
      )}
      
      {/* Existing rich text editor */}
      {/* ... */}
    </div>
  )
}
```

### 4. Form Integration Updates

#### 4.1 Update Job Creation Form
Modify `src/components/jobs/job-creation-form.tsx`:
```typescript
// Add state for tracking form values for AI context
const [formValues, setFormValues] = useState({
  title: '',
  company: '',
  location: '',
  jobType: ''
})

// Add form field change handlers
const handleFieldChange = (field: string, value: string) => {
  setFormValues(prev => ({ ...prev, [field]: value }))
}

// Update RichTextEditor usage
<RichTextEditor
  name="description"
  label="Job Description"
  placeholder="Describe the role, responsibilities, requirements, qualifications, benefits, and what makes this opportunity exciting..."
  error={currentState?.errors?.description}
  required
  maxLength={5000}
  enableAIEnhancement={true}
  jobContext={formValues}
/>
```

#### 4.2 Update Job Edit Form
Similar modifications to `src/components/jobs/job-edit-form.tsx`:
```typescript
// Extract initial values from job prop
const [formValues, setFormValues] = useState({
  title: job.title,
  company: job.company,
  location: job.location,
  jobType: job.job_type
})

// Update field change tracking
// Add AI enhancement to description field
```

### 5. Error Handling and Loading States

#### 5.1 Error Boundaries
Create `src/components/jobs/ai-error-boundary.tsx`:
```typescript
'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class AIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-800 text-sm">
            AI enhancement is temporarily unavailable. You can still create your job description manually.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}
```

#### 5.2 Fallback States
```typescript
// In AI enhancer component
const [error, setError] = useState<string | null>(null)

// Handle API errors gracefully
catch (error) {
  setError('AI enhancement failed. Please try again or write manually.')
}
```

### 6. Testing Strategy

#### 6.1 Unit Tests
- Test AI prompt generation functions
- Test API route error handling
- Test component state management

#### 6.2 Integration Tests  
- Test full AI enhancement workflow
- Test form integration with AI features
- Test error boundaries and fallbacks

#### 6.3 E2E Tests
- Test complete job creation with AI enhancement
- Test job editing with AI enhancement
- Test edge cases and error scenarios

## Security Considerations

### API Key Protection
- Store OpenAI API key securely in environment variables
- Never expose API key to client-side code
- Implement rate limiting on AI endpoints

### User Authentication
- Require authentication for AI features
- Validate user permissions for job editing

### Content Filtering
- Implement content moderation for AI-generated text
- Validate output against company policies
- Add user reporting mechanism for inappropriate content

## Performance Optimizations

### Caching Strategy
- Cache common job description templates
- Implement request deduplication
- Use database caching for frequently requested enhancements

### Rate Limiting
```typescript
// Implement in API route
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each user to 10 requests per windowMs
}
```

### Progressive Loading
- Show skeleton states during AI processing
- Implement optimistic UI updates
- Graceful degradation when AI is unavailable

## Deployment Considerations

### Environment Variables
```bash
# Production environment
OPENAI_API_KEY=prod_key_here
NEXT_PUBLIC_AI_FEATURES_ENABLED=true
AI_RATE_LIMIT_ENABLED=true
```

### Feature Flags
- Implement feature toggle for AI functionality
- Allow gradual rollout to user segments
- Quick disable capability if needed

### Monitoring
- Track AI API usage and costs
- Monitor response times and error rates
- Log user interactions for improvement

## Future Enhancements

### Phase 2 Features
- Job title suggestions based on description
- Salary range recommendations
- Skills extraction and tagging
- Multi-language support

### Advanced AI Features
- Company-specific writing style learning
- Industry-specific job description templates
- Integration with job market data
- A/B testing for different description styles

## Success Metrics

### User Adoption
- Percentage of jobs created/edited using AI enhancement
- User satisfaction scores for AI-generated content
- Time saved in job posting process

### Quality Metrics
- Job view rates for AI-enhanced vs manual descriptions
- Application rates comparison
- User retention and feature usage

### Technical Metrics
- API response times
- Error rates and system reliability
- Cost per AI enhancement request

## Implementation Timeline

### Week 1-2: Foundation
- Set up OpenAI integration
- Create API endpoints
- Implement basic AI service layer

### Week 3-4: Frontend Integration
- Build AI enhancement components
- Integrate with existing forms
- Implement preview functionality

### Week 5-6: Testing & Polish
- Comprehensive testing suite
- Error handling and edge cases
- Performance optimization

### Week 7: Deployment
- Production deployment
- Monitoring setup
- Documentation completion

## Conclusion

This AI-assisted job description enhancement feature will significantly improve the user experience by helping employers create more effective job postings. The implementation leverages the existing form architecture while adding powerful AI capabilities in a non-disruptive way.

The modular design allows for incremental deployment and future enhancements while maintaining system reliability and user control over the content creation process.