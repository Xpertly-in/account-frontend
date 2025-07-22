-- File: src/migrations/normalize-schema-2025-01-16.sql
-- Normalize database schema by removing redundant columns and creating languages table
-- Created: January 16, 2025

-- ===============================================
-- PART 1: Create languages table
-- ===============================================

-- Create languages table for proper normalization
CREATE TABLE IF NOT EXISTS public.languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) UNIQUE, -- ISO language codes (optional)
    native_name VARCHAR(100), -- Language name in its native script
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert common languages used in India
INSERT INTO public.languages (name, code, native_name) VALUES
    ('English', 'en', 'English'),
    ('Hindi', 'hi', 'हिन्दी'),
    ('Gujarati', 'gu', 'ગુજરાતી'),
    ('Marathi', 'mr', 'मराठी'),
    ('Tamil', 'ta', 'தமிழ்'),
    ('Telugu', 'te', 'తెలుగు'),
    ('Kannada', 'kn', 'ಕನ್ನಡ'),
    ('Malayalam', 'ml', 'മലയാളം'),
    ('Bengali', 'bn', 'বাংলা'),
    ('Punjabi', 'pa', 'ਪੰਜਾਬੀ'),
    ('Urdu', 'ur', 'اردو'),
    ('Odia', 'or', 'ଓଡ଼ିଆ'),
    ('Assamese', 'as', 'অসমীয়া')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for languages table
CREATE INDEX IF NOT EXISTS idx_languages_name ON public.languages(name);
CREATE INDEX IF NOT EXISTS idx_languages_code ON public.languages(code);
CREATE INDEX IF NOT EXISTS idx_languages_is_active ON public.languages(is_active);

-- Enable RLS for languages table
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for languages table
CREATE POLICY "Public read access for languages" ON public.languages FOR SELECT USING (true);
CREATE POLICY "Service role full access for languages" ON public.languages FOR ALL USING (auth.role() = 'service_role');

-- ===============================================
-- PART 2: Add language_ids column to profiles
-- ===============================================

-- Add new column to store language IDs instead of text array
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS language_ids INTEGER[] DEFAULT '{}';

-- Create index for language_ids array
CREATE INDEX IF NOT EXISTS idx_profiles_language_ids ON public.profiles USING GIN(language_ids);

-- Add foreign key constraint comment
COMMENT ON COLUMN public.profiles.language_ids IS 'Array of language IDs referencing languages table';

-- ===============================================
-- PART 3: Data migration for languages
-- ===============================================

-- Migrate existing language data from text array to ID array
-- This will convert language names to IDs based on the languages table
DO $$
DECLARE
    profile_record RECORD;
    lang_name TEXT;
    lang_id INTEGER;
    lang_ids INTEGER[] := '{}';
BEGIN
    -- Loop through all profiles that have languages
    FOR profile_record IN 
        SELECT id, languages 
        FROM public.profiles 
        WHERE languages IS NOT NULL AND array_length(languages, 1) > 0
    LOOP
        lang_ids := '{}'; -- Reset for each profile
        
        -- Loop through each language name in the profile
        FOREACH lang_name IN ARRAY profile_record.languages
        LOOP
            -- Find the language ID for this name
            SELECT l.id INTO lang_id 
            FROM public.languages l 
            WHERE LOWER(l.name) = LOWER(trim(lang_name))
            LIMIT 1;
            
            -- If language exists, add its ID to the array
            IF lang_id IS NOT NULL THEN
                lang_ids := lang_ids || lang_id;
            ELSE
                -- Log unknown languages (optional - for debugging)
                RAISE NOTICE 'Unknown language found: % for profile %', lang_name, profile_record.id;
            END IF;
        END LOOP;
        
        -- Update the profile with the new language IDs
        UPDATE public.profiles 
        SET language_ids = lang_ids 
        WHERE id = profile_record.id;
    END LOOP;
END $$;

-- ===============================================
-- PART 4: Remove redundant location columns
-- ===============================================

-- Remove redundant city and state text columns
-- These are now replaced by state_id and district_id foreign keys
ALTER TABLE public.profiles 
DROP COLUMN IF EXISTS city,
DROP COLUMN IF EXISTS state;

-- Remove old indexes if they exist
DROP INDEX IF EXISTS idx_profiles_city;
DROP INDEX IF EXISTS idx_profiles_state;

-- ===============================================
-- PART 5: Clean up old languages column
-- ===============================================

-- Keep the old languages column temporarily for rollback safety
-- It can be removed in a future migration after confirming the migration worked
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS languages;

-- Add comment to indicate the column is deprecated
COMMENT ON COLUMN public.profiles.languages IS 'DEPRECATED: Use language_ids instead. Will be removed in future migration.';

-- ===============================================
-- PART 6: Update functions and triggers
-- ===============================================

-- Update the updated_at trigger for languages table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger for languages table
DROP TRIGGER IF EXISTS update_languages_updated_at ON public.languages;
CREATE TRIGGER update_languages_updated_at
    BEFORE UPDATE ON public.languages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ===============================================
-- PART 7: Add helpful views (optional)
-- ===============================================

-- Create a view to easily join profiles with their location and language names
CREATE OR REPLACE VIEW public.profile_details AS
SELECT 
    p.id,
    p.auth_user_id,
    p.username,
    p.first_name,
    p.middle_name,
    p.last_name,
    p.profile_picture_url,
    p.bio,
    p.gender,
    p.role,
    p.country,
    p.specialization,
    p.email,
    p.phone,
    p.whatsapp_available,
    p.is_active,
    p.created_at,
    p.updated_at,
    -- Location details
    s.name as state_name,
    d.name as district_name,
    p.state_id,
    p.district_id,
    -- Language details (aggregated)
    ARRAY(
        SELECT l.name 
        FROM public.languages l 
        WHERE l.id = ANY(p.language_ids)
        ORDER BY l.name
    ) as language_names,
    p.language_ids
FROM public.profiles p
LEFT JOIN public.states s ON p.state_id = s.id
LEFT JOIN public.districts d ON p.district_id = d.id;

-- Grant read access to the view
GRANT SELECT ON public.profile_details TO authenticated, anon; 