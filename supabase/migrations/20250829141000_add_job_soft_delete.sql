-- Add soft delete column to jobs table
ALTER TABLE jobs ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index on deleted_at for performance
CREATE INDEX idx_jobs_deleted_at ON jobs(deleted_at);

-- Create compound index for user queries excluding deleted jobs
CREATE INDEX idx_jobs_user_active ON jobs(user_id, created_at DESC) WHERE deleted_at IS NULL;

-- Update existing RLS policies to exclude soft-deleted jobs from public queries
-- Drop the existing public read policy if it exists
DROP POLICY IF EXISTS "Users can view all jobs" ON jobs;

-- Create new policy that excludes soft-deleted jobs for public viewing
CREATE POLICY "Users can view active jobs" ON jobs
  FOR SELECT 
  USING (deleted_at IS NULL);

-- Create policy for users to view their own jobs (including deleted ones)
CREATE POLICY "Users can view their own jobs including deleted" ON jobs
  FOR SELECT 
  USING (user_id = auth.uid());

-- Ensure the existing insert/update/delete policies remain unchanged
-- (Users should still be able to modify their own jobs regardless of deleted status)