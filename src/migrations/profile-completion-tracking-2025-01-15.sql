-- Migration: Profile Completion Tracking Implementation
-- Date: 2025-01-15
-- Purpose: Add profile completion percentage tracking to enhance user experience
-- Author: Development Team
-- Ticket: Profile Pages Complete Redesign Initiative

-- ================================
-- Forward Migration (Implementation)
-- ================================

-- Add profile completion tracking to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN profile_completion_percentage INTEGER DEFAULT 0 CHECK (profile_completion_percentage >= 0 AND profile_completion_percentage <= 100);

-- Add completion tracking metadata
ALTER TABLE public.profiles 
ADD COLUMN last_completed_section TEXT,
ADD COLUMN completion_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for completion queries (performance optimization)
CREATE INDEX idx_profiles_completion_percentage ON public.profiles(profile_completion_percentage);

-- Create function to update completion timestamp when percentage changes
CREATE OR REPLACE FUNCTION update_completion_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.profile_completion_percentage IS DISTINCT FROM NEW.profile_completion_percentage THEN
        NEW.completion_updated_at = now();
        -- Log the section that was completed (if provided)
        IF NEW.last_completed_section IS NOT NULL THEN
            -- Could add logging here for analytics
            NULL;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update completion timestamp
CREATE TRIGGER trigger_update_completion_timestamp
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_completion_timestamp();

-- Add helpful comments to new columns
COMMENT ON COLUMN public.profiles.profile_completion_percentage IS 'Percentage of profile completion (0-100), calculated based on required sections';
COMMENT ON COLUMN public.profiles.last_completed_section IS 'Name of the last section that was completed (for analytics and UX)';
COMMENT ON COLUMN public.profiles.completion_updated_at IS 'Timestamp when completion percentage was last updated';

-- ================================
-- Verification Queries
-- ================================

-- Verify the new columns exist
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN ('profile_completion_percentage', 'last_completed_section', 'completion_updated_at');

-- Verify the index was created
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'profiles' 
AND indexname = 'idx_profiles_completion_percentage';

-- Verify the trigger was created
SELECT trigger_name, event_manipulation, action_timing, action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_completion_timestamp';

-- ================================
-- Test Data Updates (Optional)
-- ================================

-- Update existing profiles with initial completion calculation
-- This can be run separately after the ProfileService calculation logic is implemented
-- UPDATE public.profiles SET profile_completion_percentage = 
--   CASE 
--     WHEN first_name IS NOT NULL AND email IS NOT NULL THEN 20
--     ELSE 0
--   END
-- WHERE profile_completion_percentage = 0;

-- ================================
-- Rollback Instructions (for emergency use)
-- ================================

-- WARNING: The following commands will permanently delete the completion tracking data
-- Only run these if you need to rollback this migration

-- DROP TRIGGER IF EXISTS trigger_update_completion_timestamp ON public.profiles;
-- DROP FUNCTION IF EXISTS update_completion_timestamp();
-- DROP INDEX IF EXISTS idx_profiles_completion_percentage;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS completion_updated_at;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS last_completed_section;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS profile_completion_percentage;

-- ================================
-- Performance Impact Assessment
-- ================================

-- Storage Impact: ~12 bytes per profile (INTEGER + TEXT + TIMESTAMP)
-- Performance Impact: Minimal - indexed completion percentage for fast queries
-- Breaking Changes: None - all additions with safe defaults
-- Application Impact: Requires ProfileService updates for calculation logic 