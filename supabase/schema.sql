-- =============================================
-- StudentLink Database Schema for Supabase
-- Run this in the Supabase SQL Editor
-- =============================================

-- Enable UUID extension (usually enabled by default)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    bio TEXT,
    links JSONB DEFAULT '{}',
    capstone_project JSONB DEFAULT '{}',
    theme_id TEXT DEFAULT 'minimal',
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on username for fast lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view profiles (public access)
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles
FOR SELECT
USING (true);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on update
DROP TRIGGER IF EXISTS set_updated_at ON public.profiles;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- OPTIONAL: Create a function to handle new user signup
-- This automatically creates a profile when a user signs up
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Don't auto-create profile, let users choose their username
    -- Uncomment below if you want auto-creation with email as username
    -- INSERT INTO public.profiles (id, username)
    -- VALUES (NEW.id, split_part(NEW.email, '@', 1));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup (optional)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
-- AFTER INSERT ON auth.users
-- FOR EACH ROW
-- EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- SAMPLE DATA (for testing)
-- =============================================

-- Insert a demo profile (requires a user with this ID to exist)
-- INSERT INTO public.profiles (id, username, full_name, bio, links, capstone_project, theme_id, is_premium)
-- VALUES (
--     'your-user-uuid-here',
--     'demo',
--     'Demo Student',
--     'CS student passionate about building cool things! 🚀',
--     '{"github": "https://github.com/demo", "linkedin": "https://linkedin.com/in/demo", "portfolio": "https://demo.dev"}',
--     '{"title": "AI Study Assistant", "description": "An ML-powered app that helps students study smarter using spaced repetition.", "url": "https://github.com/demo/ai-study"}',
--     'minimal',
--     false
-- );
