-- Update foreign key constraint to use RESTRICT instead of CASCADE
-- This prevents user deletion if they have associated jobs
-- Jobs must be deleted first before deleting the user

-- Drop the existing foreign key constraint
ALTER TABLE jobs DROP CONSTRAINT jobs_user_id_fkey;

-- Add the new foreign key constraint with RESTRICT
ALTER TABLE jobs 
ADD CONSTRAINT jobs_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE RESTRICT;