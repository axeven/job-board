# Job Board App

## Overview

This is a simple "Mini Job Board" web application where companies can post jobs and users can browse them. The app is designed to showcase full-stack functionality with a focus on clean code and usability

## Core Features
- Authentication: Users can sign up and log in using Supabase Auth.
- Post a Job: Authenticated users can create job posts with details such as title, company name, description, location, and job type (Full-Time, Part-Time, Contract).
- Browse Jobs: There is a public page that displays a list of all job postings. Users can filter jobs by location or job type.
- Job Detail Page: Users can view the full details of a specific job posting.
- User Dashboard: Users have a dashboard where they can view, edit, or delete the jobs they have posted.

## Tech Stack
- Frontend: Next.js (using the App Router)
- Backend: Supabase (for the database and authentication) 
- Deployment: Vercel 
- Styling: Tailwind CSS

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/axeven/job-board.git
cd job-board
```

2. Install dependencies:
```bash
npm install
```

3. Set up Supabase:
    - Create a new project on Supabase.
    - Go to Project Settings > API and copy your Project URL and anon public key.
    - Create a .env.local file in the root of your project and add your Supabase credentials:
```bash
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

4. Run the development server:
```bash
npm run dev
```

5. Open http://localhost:3000 in your browser to view the application.