-- ============================================================
-- VIP PORTAL — COMPLETE DATABASE MIGRATION & RLS REPAIR
-- Run this entire script in the Supabase SQL Editor.
-- ============================================================

-- 0. ENSURE ALL REQUIRED COLUMNS EXIST
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_url TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS resume_name TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name TEXT DEFAULT '';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rejection_reason TEXT DEFAULT '';

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'company', 'supervisor'));

-- Create application_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.application_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1. ENABLE RLS ON ALL TABLES
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_messages ENABLE ROW LEVEL SECURITY;

-- 2. PROFILES POLICIES
-- ============================================================
DROP POLICY IF EXISTS "Allow public read of profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow supervisors to update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;

CREATE POLICY "Allow public read of profiles" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

CREATE POLICY "Allow supervisors to update profiles" ON public.profiles
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'supervisor'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'supervisor'
        )
    );

-- 3. INTERNSHIPS POLICIES
-- ============================================================
DROP POLICY IF EXISTS "Allow public read of internships" ON public.internships;
DROP POLICY IF EXISTS "Allow approved companies to insert internships" ON public.internships;
DROP POLICY IF EXISTS "Allow companies to update their own internships" ON public.internships;
DROP POLICY IF EXISTS "Allow companies to delete their own internships" ON public.internships;
DROP POLICY IF EXISTS "Anyone can view internships" ON public.internships;
DROP POLICY IF EXISTS "Supervisors can insert internships" ON public.internships;
DROP POLICY IF EXISTS "Supervisors can update own internships" ON public.internships;
DROP POLICY IF EXISTS "Supervisors can delete own internships" ON public.internships;

CREATE POLICY "Allow public read of internships" ON public.internships
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow approved companies to insert internships" ON public.internships
    FOR INSERT TO authenticated
    WITH CHECK (
        supervisor_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'company' AND is_approved = true
        )
    );

CREATE POLICY "Allow companies to update their own internships" ON public.internships
    FOR UPDATE TO authenticated
    USING (supervisor_id = auth.uid())
    WITH CHECK (supervisor_id = auth.uid());

CREATE POLICY "Allow companies to delete their own internships" ON public.internships
    FOR DELETE TO authenticated
    USING (supervisor_id = auth.uid());

-- 4. APPLICATIONS POLICIES
-- ============================================================
DROP POLICY IF EXISTS "Allow students to view their own applications" ON public.applications;
DROP POLICY IF EXISTS "Allow companies to view applications to their internships" ON public.applications;
DROP POLICY IF EXISTS "Allow supervisors to view all applications" ON public.applications;
DROP POLICY IF EXISTS "Allow students to submit applications" ON public.applications;
DROP POLICY IF EXISTS "Allow companies to update application status" ON public.applications;
DROP POLICY IF EXISTS "Students can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Supervisors can view applications" ON public.applications;
DROP POLICY IF EXISTS "Students can insert applications" ON public.applications;
DROP POLICY IF EXISTS "Supervisors can update applications" ON public.applications;

CREATE POLICY "Allow students to view their own applications" ON public.applications
    FOR SELECT TO authenticated USING (student_id = auth.uid());

CREATE POLICY "Allow companies to view applications to their internships" ON public.applications
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.internships
            WHERE internships.id = internship_id AND internships.supervisor_id = auth.uid()
        )
    );

CREATE POLICY "Allow supervisors to view all applications" ON public.applications
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'supervisor'
        )
    );

CREATE POLICY "Allow students to submit applications" ON public.applications
    FOR INSERT TO authenticated
    WITH CHECK (
        student_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'student'
        )
    );

CREATE POLICY "Allow companies to update application status" ON public.applications
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.internships
            WHERE internships.id = internship_id AND internships.supervisor_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.internships
            WHERE internships.id = internship_id AND internships.supervisor_id = auth.uid()
        )
    );

-- 5. APPLICATION MESSAGES POLICIES
-- ============================================================
DROP POLICY IF EXISTS "Allow members of the application to view messages" ON public.application_messages;
DROP POLICY IF EXISTS "Allow users to post messages" ON public.application_messages;

CREATE POLICY "Allow members of the application to view messages" ON public.application_messages
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.applications a
            JOIN public.internships i ON a.internship_id = i.id
            WHERE a.id = application_id AND (
                a.student_id = auth.uid() OR 
                i.supervisor_id = auth.uid() OR
                EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'supervisor')
            )
        )
    );

CREATE POLICY "Allow users to post messages" ON public.application_messages
    FOR INSERT TO authenticated
    WITH CHECK (
        sender_id = auth.uid() AND (
            EXISTS (
                SELECT 1 FROM public.profiles 
                WHERE id = auth.uid() AND role IN ('company', 'supervisor')
            )
            OR
            (
                EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'student'
                ) AND EXISTS (
                    SELECT 1 FROM public.applications a
                    WHERE a.id = application_id AND a.student_id = auth.uid()
                ) AND EXISTS (
                    SELECT 1 FROM public.application_messages msg
                    WHERE msg.application_id = application_messages.application_id 
                      AND msg.sender_id != auth.uid()
                )
            )
        )
    );

-- 6. STORAGE BUCKETS & POLICIES
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public read of storage objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to resumes" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update/delete their own objects" ON storage.objects;

CREATE POLICY "Allow public read of storage objects" ON storage.objects
    FOR SELECT USING (bucket_id IN ('avatars', 'resumes'));

CREATE POLICY "Allow authenticated uploads to avatars" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Allow authenticated uploads to resumes" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Allow users to update their own objects" ON storage.objects
    FOR UPDATE TO authenticated
    USING (owner = auth.uid());

CREATE POLICY "Allow users to delete their own objects" ON storage.objects
    FOR DELETE TO authenticated
    USING (owner = auth.uid());

-- 7. AUTH TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
  approved_status BOOLEAN;
BEGIN
  user_role := COALESCE(new.raw_user_meta_data->>'role', 'student');
  
  IF user_role = 'company' THEN
    approved_status := false;
  ELSE
    approved_status := true;
  END IF;

  INSERT INTO public.profiles (
    id, first_name, last_name, role, matric_number, department, 
    company_name, is_approved, avatar_url, rejection_reason
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    user_role,
    COALESCE(new.raw_user_meta_data->>'matric_number', ''),
    COALESCE(new.raw_user_meta_data->>'department', ''),
    COALESCE(new.raw_user_meta_data->>'company_name', ''),
    approved_status,
    '',
    ''
  )
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    matric_number = EXCLUDED.matric_number,
    department = EXCLUDED.department,
    company_name = EXCLUDED.company_name,
    is_approved = EXCLUDED.is_approved;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
