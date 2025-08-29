-- Create status enum for jobs
CREATE TYPE job_status_enum AS ENUM ('active', 'draft', 'closed');

-- Add status column to jobs table
ALTER TABLE jobs ADD COLUMN status job_status_enum NOT NULL DEFAULT 'active';

-- Create index on status for performance
CREATE INDEX idx_jobs_status ON jobs(status);

-- Create compound index for user_id and status queries
CREATE INDEX idx_jobs_user_status ON jobs(user_id, status);

-- Update the updated_at trigger to handle status changes
-- (The trigger already exists, no need to recreate it)