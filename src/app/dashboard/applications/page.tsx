import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { applicationsServer } from '@/lib/database/applications'
import { ApplicationsList } from '@/components/applications/applications-list'
import { LoadingSkeleton } from '@/components/loading/applications-skeleton'

export const metadata = {
  title: 'My Applications - Job Board',
  description: 'Track your job applications'
}

export default async function MyApplicationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: applications, error } = await applicationsServer.getByUser(user.id)

  if (error) {
    throw new Error('Failed to load applications')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your job applications
        </p>
      </div>

      <Suspense fallback={<LoadingSkeleton />}>
        <ApplicationsList applications={applications || []} />
      </Suspense>
    </div>
  )
}