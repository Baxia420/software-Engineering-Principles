-- ============================================================
-- VIP PORTAL — INITIAL SCHEMA DEFINITIONS
-- Run this ONLY if you are setting up a brand new, empty Supabase project.
-- (Skip this if you are using the existing project database).
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (hooks into Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT DEFAULT '',
    last_name TEXT DEFAULT '',
    role TEXT CHECK (role IN ('student', 'company', 'supervisor')),
    matric_number TEXT DEFAULT '',
    department TEXT DEFAULT '',
    company_name TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    skills TEXT DEFAULT '',
    resume_url TEXT DEFAULT '',
    resume_name TEXT DEFAULT '',
    avatar_url TEXT DEFAULT '',
    is_approved BOOLEAN DEFAULT TRUE,
    rejection_reason TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Internships Table
CREATE TABLE IF NOT EXISTS public.internships (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supervisor_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    duration TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    stipend TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    internship_id UUID REFERENCES public.internships(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL,
    cover_letter TEXT NOT NULL,
    resume_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);
