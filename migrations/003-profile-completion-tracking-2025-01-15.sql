-- File: src/migrations/profile-completion-tracking-2025-01-15.sql
-- Add profile completion tracking to existing profiles table
-- Created: January 15, 2025

-- Add profile completion tracking fields
ALTER TABLE public.profiles 
ADD COLUMN profile_completion_percentage INTEGER DEFAULT 0 CHECK (profile_completion_percentage >= 0 AND profile_completion_percentage <= 100);

-- Add completion tracking metadata
ALTER TABLE public.profiles 
ADD COLUMN last_completed_section TEXT,
ADD COLUMN completion_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for completion queries
CREATE INDEX idx_profiles_completion_percentage ON public.profiles(profile_completion_percentage);

-- Create trigger to update completion timestamp
CREATE OR REPLACE FUNCTION update_completion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.profile_completion_percentage IS DISTINCT FROM NEW.profile_completion_percentage THEN
        NEW.completion_updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_completion_timestamp
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_completion_timestamp();



-- Rollback Instructions (if needed):
-- DROP TRIGGER IF EXISTS trigger_update_completion_timestamp ON public.profiles;
-- DROP FUNCTION IF EXISTS update_completion_timestamp();
-- DROP INDEX IF EXISTS idx_profiles_completion_percentage;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS completion_updated_at;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS last_completed_section;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS profile_completion_percentage; 