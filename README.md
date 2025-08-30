# Job Board App

> **Built with AI Assistance**: This application was developed with the help of Claude (Anthropic), showcasing how AI can accelerate modern web development while maintaining code quality and best practices.

## Overview

A modern, full-featured job board application where companies can post jobs and candidates can discover opportunities. Built with Next.js 15, Supabase, and enhanced with AI-powered development workflows.

## 🚀 Key Features

### Core Functionality
- **🔐 Authentication**: Secure user registration and login with Supabase Auth
- **💼 Job Management**: Create, edit, delete, and duplicate job postings
- **🔍 Advanced Filtering**: Search jobs by location, type, and keywords with real-time filtering
- **📊 Dashboard**: Comprehensive user dashboard with job analytics and management
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS v4

### Advanced Features
- **🎨 Design System**: Comprehensive UI component library with design tokens
- **⚡ Performance Optimized**: 
  - Image optimization with Next.js Image
  - Code splitting and lazy loading
  - Web Vitals monitoring
  - Bundle optimization
- **🔍 SEO Ready**: 
  - Dynamic meta tags and Open Graph
  - Structured data for job postings
  - Auto-generated sitemaps
- **🛡️ Error Handling**: Toast notifications, error boundaries, and loading states
- **📈 Analytics Ready**: Performance monitoring and Web Vitals tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with App Router & Turbopack
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Styling**: Tailwind CSS v4 with design tokens
- **Language**: TypeScript with strict mode
- **Deployment**: Vercel
- **Performance**: Web Vitals monitoring, image optimization
- **SEO**: Structured data, dynamic sitemaps, meta tags

## 🚀 Local Setup Instruction

1. **Clone the repository**:
    ```bash
    git clone https://github.com/axeven/job-board.git
    cd job-board
    ```
2. **Dependencies**:
   Ensure you have installed `node` at least v22

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Environment Setup**:
    
    Duplicate `.env.example` file in the root directory as `.env.local`. Update the env values with yours.

4. **Database Setup**:
   - Create a new project on [Supabase](https://supabase.com)
   - Run the database migrations from `/supabase/migrations`
    ```bash
    npm run db:reset     # reset the db
    npx supabase db push # run new migrations only
    ```

5. **Start Development**:
    ```bash
    npm run dev        # Start dev server with Turbopack
    npm run build      # Build for production
    npm run lint       # Check code quality
    ```

6. **Open** http://localhost:3000 to view the application

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── ui/             # Core design system components
│   ├── auth/           # Authentication components
│   ├── jobs/           # Job-related components
│   └── dashboard/      # Dashboard components
├── lib/                # Utilities and configurations
│   ├── auth/           # Authentication logic
│   ├── database/       # Database operations
│   ├── hooks/          # Custom React hooks
│   └── utils/          # Helper functions
├── styles/             # Global styles and design tokens
└── types/              # TypeScript type definitions
```

## 🤖 What will be implemented given more time
- [x] AI assisted job description enhancements and generation. As an employer, I can generate the job description or enhance it based on the data that I have inputted on the create job form.s
- Job application management. As a job seeker, I can apply on the job that I find in the website direcly. As an employer, I can manage the applications that I have received on my job postings. 
- Semantic job search. As a job seeker, I can search for job postings that is related to my keywords, not just searching for exact word occurrence.
- AI assistent resume analytics. As an employer, I can get advice from AI whether an applicant is a good fit for the job posting applied
- Job recommendations based on resume. As a job seeker, based on my resume, I can get job recommendations from AI.

## 📝 License

MIT License - feel free to use this project as a starting point for your own job board or to learn modern web development patterns.
