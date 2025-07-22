-- Migration: Profile Picture Storage Bucket and Policy
-- Created: 2025-07-13
-- Updated: 2025-07-13 - Fixed RLS policy issues

-- UP: Create bucket and policy
-- Create the 'profile-pictures' bucket (private, 5MB limit)
-- (Supabase web UI: Storage > New bucket, or via SQL if supported)
-- This is a documentation placeholder; actual bucket creation is via UI/API.

-- First, drop any existing policies to avoid conflicts
drop policy if exists "User can manage own profile pictures" on storage.objects;
drop policy if exists "Users can upload profile pictures" on storage.objects;
drop policy if exists "Users can view profile pictures" on storage.objects;
drop policy if exists "Users can delete profile pictures" on storage.objects;

-- Create comprehensive policies for profile pictures
-- Policy 1: Users can upload their own profile pictures
create policy "Users can upload profile pictures"
  on storage.objects for insert
  with check (
    bucket_id = 'profile-pictures' 
    and auth.uid()::text = split_part(name, '/', 1)
  );

-- Policy 2: Users can update their own profile pictures
create policy "Users can update profile pictures"
  on storage.objects for update
  using (
    bucket_id = 'profile-pictures' 
    and auth.uid()::text = split_part(name, '/', 1)
  )
  with check (
    bucket_id = 'profile-pictures' 
    and auth.uid()::text = split_part(name, '/', 1)
  );

-- Policy 3: Users can delete their own profile pictures
create policy "Users can delete profile pictures"
  on storage.objects for delete
  using (
    bucket_id = 'profile-pictures' 
    and auth.uid()::text = split_part(name, '/', 1)
  );

-- Policy 4: Users can view their own profile pictures
create policy "Users can view profile pictures"
  on storage.objects for select
  using (
    bucket_id = 'profile-pictures' 
    and auth.uid()::text = split_part(name, '/', 1)
  );

-- File naming convention:
--   {auth.uid()}/avatar.{ext}
-- Example: 6333ce9a-b978-48f5-8996-340cd6482240/avatar.jpg

-- DOWN: Remove policies (does not delete bucket or files)
-- drop policy if exists "Users can upload profile pictures" on storage.objects;
-- drop policy if exists "Users can update profile pictures" on storage.objects;
-- drop policy if exists "Users can delete profile pictures" on storage.objects;
-- drop policy if exists "Users can view profile pictures" on storage.objects; 