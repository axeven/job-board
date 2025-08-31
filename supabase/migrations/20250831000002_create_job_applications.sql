-- Create application status enum
CREATE TYPE application_status_enum AS ENUM ('pending', 'reviewing', 'shortlisted', 'rejected', 'accepted');

-- Create job applications table
CREATE TABLE job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status application_status_enum DEFAULT 'pending',
  cover_letter TEXT,
  resume_file_path TEXT, -- Supabase storage file path
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(job_id, applicant_id) -- Prevent duplicate applications
);

-- Create indexes
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_applied_at ON job_applications(applied_at DESC);

-- Add trigger for updated_at
CREATE TRIGGER update_job_applications_updated_at 
    BEFORE UPDATE ON job_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- Job seekers can view their own applications
CREATE POLICY "Users can view own applications" ON job_applications
  FOR SELECT USING (auth.uid() = applicant_id);

-- Job seekers can create applications
CREATE POLICY "Users can create applications" ON job_applications
  FOR INSERT WITH CHECK (auth.uid() = applicant_id);

-- Employers can view applications for their jobs
CREATE POLICY "Employers can view job applications" ON job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = job_applications.job_id 
      AND jobs.user_id = auth.uid()
    )
  );

-- Employers can update application status for their jobs
CREATE POLICY "Employers can update application status" ON job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM jobs 
      WHERE jobs.id = job_applications.job_id 
      AND jobs.user_id = auth.uid()
    )
  );