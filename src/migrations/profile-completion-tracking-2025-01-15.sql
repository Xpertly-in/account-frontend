-- Profile Completion Tracking Migration
-- Date: 2025-01-15
-- Purpose: Add profile completion tracking fields to existing profiles table

-- Add profile completion tracking to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN profile_completion_percentage INTEGER DEFAULT 0 CHECK (profile_completion_percentage >= 0 AND profile_completion_percentage <= 100);

-- Add completion tracking metadata
ALTER TABLE public.profiles 
ADD COLUMN last_completed_section TEXT,
ADD COLUMN completion_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for completion queries (performance optimization)
CREATE INDEX idx_profiles_completion_percentage ON public.profiles(profile_completion_percentage);

-- Create index for completion tracking queries
CREATE INDEX idx_profiles_completion_updated_at ON public.profiles(completion_updated_at);

-- Create trigger to update completion timestamp automatically
CREATE OR REPLACE FUNCTION update_completion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update timestamp if completion percentage actually changed
    IF OLD.profile_completion_percentage IS DISTINCT FROM NEW.profile_completion_percentage THEN
        NEW.completion_updated_at = now();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to profiles table
CREATE TRIGGER trigger_update_completion_timestamp
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_completion_timestamp();

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.profile_completion_percentage IS 'Profile completion percentage (0-100), calculated based on 5 sections: Basic Info (20%), Professional Details (20%), Experience (20%), Education (20%), Social/Contact (20%)';
COMMENT ON COLUMN public.profiles.last_completed_section IS 'Last profile section that was completed or updated';
COMMENT ON COLUMN public.profiles.completion_updated_at IS 'Timestamp when profile completion percentage was last updated';

-- Rollback Instructions (if needed):
-- To rollback this migration, run the following commands:
-- 
-- DROP TRIGGER IF EXISTS trigger_update_completion_timestamp ON public.profiles;
-- DROP FUNCTION IF EXISTS update_completion_timestamp();
-- DROP INDEX IF EXISTS idx_profiles_completion_updated_at;
-- DROP INDEX IF EXISTS idx_profiles_completion_percentage;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS completion_updated_at;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS last_completed_section;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS profile_completion_percentage; 