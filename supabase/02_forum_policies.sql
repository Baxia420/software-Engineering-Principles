-- ============================================================
-- FORUM TABLE RLS POLICIES
-- Run this AFTER the main Part C script (01_schema_and_rls.sql).
-- ============================================================

-- Ensure the tables exist (skip if they already do)
CREATE TABLE IF NOT EXISTS public.forum_threads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thread_id UUID REFERENCES public.forum_threads(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FORUM THREADS POLICIES
-- ============================================================
DROP POLICY IF EXISTS "Allow all authenticated to read threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Allow authenticated to create threads" ON public.forum_threads;
DROP POLICY IF EXISTS "Allow owners and supervisors to delete threads" ON public.forum_threads;

-- All logged-in users can read all threads
CREATE POLICY "Allow all authenticated to read threads" ON public.forum_threads
    FOR SELECT TO authenticated USING (true);

-- Any logged-in user can create a thread (must be their own author_id)
CREATE POLICY "Allow authenticated to create threads" ON public.forum_threads
    FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

-- Thread author can delete their own thread, supervisors can delete any thread
CREATE POLICY "Allow owners and supervisors to delete threads" ON public.forum_threads
    FOR DELETE TO authenticated USING (
        author_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'supervisor')
    );

-- ============================================================
-- FORUM POSTS (REPLIES) POLICIES
-- ============================================================
DROP POLICY IF EXISTS "Allow all authenticated to read posts" ON public.forum_posts;
DROP POLICY IF EXISTS "Allow authenticated to create posts" ON public.forum_posts;

-- All logged-in users can read all replies
CREATE POLICY "Allow all authenticated to read posts" ON public.forum_posts
    FOR SELECT TO authenticated USING (true);

-- Any logged-in user can post a reply (must be their own author_id)
CREATE POLICY "Allow authenticated to create posts" ON public.forum_posts
    FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
