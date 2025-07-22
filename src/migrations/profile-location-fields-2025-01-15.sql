-- File: src/migrations/profile-location-fields-2025-01-15.sql
-- Add location fields to profiles table for proper location management
-- Created: January 15, 2025

-- Add state_id and district_id fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS state_id INTEGER REFERENCES public.states(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS district_id INTEGER REFERENCES public.districts(id) ON DELETE SET NULL;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_state_id ON public.profiles(state_id);
CREATE INDEX IF NOT EXISTS idx_profiles_district_id ON public.profiles(district_id);

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.state_id IS 'Foreign key reference to states table';
COMMENT ON COLUMN public.profiles.district_id IS 'Foreign key reference to districts table';

-- Optional: Update existing profiles to maintain backward compatibility
-- Keep existing city/state text fields for now during transition period
-- They can be removed in a future migration once data is migrated 