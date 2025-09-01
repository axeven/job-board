'use server'

import { revalidatePath } from 'next/cache'
import { applicationsServer } from '@/lib/database/applications'
import { authServer } from '@/lib/auth/server'
import type { ApplicationStatus } from '@/types/database'

export async function updateApplicationStatusAction(
  applicationId: string, 
  newStatus: ApplicationStatus
) {
  try {
    const user = await authServer.getUser()
    
    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const result = await applicationsServer.updateStatus(
      applicationId, 
      newStatus, 
      user.id
    )

    if (result.error) {
      return { success: false, error: result.error.message }
    }

    // Revalidate the applications page
    revalidatePath('/dashboard/jobs/[id]/applications', 'page')
    
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Failed to update application status:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }
  }
}