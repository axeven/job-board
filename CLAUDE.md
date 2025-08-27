# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack (opens at http://localhost:3000)
- `npm run build` - Build production version with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Architecture Overview

This is a Mini Job Board application built with Next.js 15 using the App Router architecture. The app allows companies to post jobs and users to browse them with full authentication.

### Core Features to Implement
- **Authentication**: Supabase Auth for user sign up/login
- **Job Posting**: Authenticated users can create jobs with title, company, description, location, job type
- **Job Browsing**: Public job listing page with filtering by location/job type
- **Job Details**: Individual job detail pages
- **User Dashboard**: Users can view/edit/delete their posted jobs

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode enabled
- **Styling**: Tailwind CSS v4 via PostCSS
- **Database & Auth**: Supabase
- **Deployment**: Vercel
- **Fonts**: Geist Sans and Geist Mono from Google Fonts
- **Build Tool**: Turbopack for faster builds and development

### Project Structure
- `src/app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Home page component
  - `globals.css` - Global styles including Tailwind directives
- `public/` - Static assets (SVG icons)
- Path alias `@/*` maps to `src/*`

### Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

### Configuration
- ESLint extends Next.js core web vitals and TypeScript rules
- TypeScript configured with strict mode and Next.js plugin
- PostCSS configured for Tailwind CSS v4
- Uses ES modules throughout (`.mjs` config files)