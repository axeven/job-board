import { supabase } from '@/lib/supabase/client'
import { createClient } from '@/lib/supabase/server'

const BUCKET_NAME = 'resumes'
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const ALLOWED_TYPES = [
  'application/pdf', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]

export interface UploadResult {
  filePath?: string
  error?: string
}

// Client-side: Get presigned upload URL
export async function getResumeUploadUrl(userId: string, fileName: string): Promise<{ uploadUrl?: string, filePath?: string, error?: string }> {
  try {
    const client = supabase()
    const fileExt = fileName.split('.').pop()
    const filePath = `${userId}/resume_${Date.now()}.${fileExt}`

    // Get presigned upload URL
    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(filePath, {
        upsert: false
      })

    if (error) throw error

    return { 
      uploadUrl: data.signedUrl,
      filePath: filePath
    }
  } catch (error) {
    console.error('Error getting upload URL:', error)
    return { error: 'Failed to prepare file upload' }
  }
}

// Client-side: Upload file using presigned URL
export async function uploadResumeFile(
  file: File, 
  uploadUrl: string
): Promise<UploadResult> {
  try {
    // Validate file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { error: 'Invalid file type. Please upload PDF, DOC, or DOCX files only.' }
    }

    if (file.size > MAX_FILE_SIZE) {
      return { error: 'File size too large. Please upload files smaller than 2MB.' }
    }

    // Upload using presigned URL
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    return {}
  } catch (error) {
    console.error('Resume upload error:', error)
    return { error: 'Failed to upload resume. Please try again.' }
  }
}

// Client-side: Get signed download URL
export async function getResumeDownloadUrlClient(filePath: string): Promise<{ url?: string, error?: string }> {
  try {
    const client = supabase()
    
    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) throw error

    return { url: data.signedUrl }
  } catch (error) {
    console.error('Error getting download URL:', error)
    return { error: 'Failed to get resume URL' }
  }
}

// Server-side: Get signed download URL
export async function getResumeDownloadUrl(filePath: string): Promise<{ url?: string, error?: string }> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 3600) // 1 hour expiry

    if (error) throw error

    return { url: data.signedUrl }
  } catch (error) {
    console.error('Error getting download URL:', error)
    return { error: 'Failed to get resume URL' }
  }
}

// Server-side: Delete resume file
export async function deleteResume(filePath: string): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])

    if (error) throw error
    return {}
  } catch (error) {
    console.error('Resume deletion error:', error)
    return { error: 'Failed to delete resume.' }
  }
}