-- Enable Row Level Security on jobs table
-- Implement security policies for job access control

-- Step 1: Enable RLS on jobs table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Step 2: Create public read policy
-- Allow all users (authenticated and anonymous) to read job postings
CREATE POLICY "jobs_select_policy" ON jobs
    FOR SELECT
    USING (true);

-- Step 3: Create authenticated insert policy
-- Allow only authenticated users to create new job postings
CREATE POLICY "jobs_insert_policy" ON jobs
    FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- Step 4: Create owner-only update policy
-- Allow users to update only their own job postings
CREATE POLICY "jobs_update_policy" ON jobs
    FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Step 5: Create owner-only delete policy
-- Allow users to delete only their own job postings
CREATE POLICY "jobs_delete_policy" ON jobs
    FOR DELETE
    USING (user_id = auth.uid());