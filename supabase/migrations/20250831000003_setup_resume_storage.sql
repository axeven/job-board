-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'resumes', 
  'resumes', 
  false, 
  2097152, -- 2MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- RLS policies for resume storage
CREATE POLICY "Users can upload own resumes" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view own resumes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Employers can view applicant resumes" ON storage.objects
FOR SELECT USING (
  bucket_id = 'resumes'
  AND EXISTS (
    SELECT 1 FROM job_applications ja
    JOIN jobs j ON ja.job_id = j.id
    WHERE j.user_id = auth.uid()
    AND ja.resume_file_path = name
  )
);

CREATE POLICY "Users can delete own resumes" ON storage.objects
FOR DELETE USING (
  bucket_id = 'resumes'
  AND auth.uid()::text = (storage.foldername(name))[1]
);