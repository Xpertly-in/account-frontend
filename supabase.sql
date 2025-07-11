
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (core user data)
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id),
  username text UNIQUE,
  first_name text,
  middle_name text,
  last_name text,
  profile_picture_url text,
  bio text,
  gender text,
  role text,
  city text,
  state text,
  country text DEFAULT 'India',
  languages text[],
  specialization text[],
  email text UNIQUE,
  phone text UNIQUE,
  whatsapp_available boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Experiences table (CA work history)
CREATE TABLE public.experiences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id),
  title text,
  company_name text,
  location text,
  is_current boolean DEFAULT false,
  start_date date,
  end_date date,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Education table (CA education history)
CREATE TABLE public.educations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id),
  institute_name text NOT NULL,
  degree text,
  field_of_study text,
  start_date date,
  end_date date,
  grade text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);


-- Contact requests table (direct contact to specific CAs)
CREATE TABLE public.contact_requests (
  id uuid NOT NULL DEFAULT uuid_generate_v4() PRIMARY KEY,
  ca_profile_id uuid NOT NULL REFERENCES public.profiles(id),
  
  -- Customer information (can be anonymous)
  customer_profile_id uuid REFERENCES public.profiles(id), -- NULL for anonymous users
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  
  -- Request details
  subject text NOT NULL,
  message text NOT NULL,
  service_needed text,
  urgency text NOT NULL,
  
  -- Location (optional)
  location_city text,
  location_state text,
  
  -- Status tracking
  status text NOT NULL DEFAULT 'new',
  
  -- CA Notes
  ca_private_notes text[],
  replied_at timestamp with time zone,
  
  -- Timestamps
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- CA verifications table (one-to-one with CA profiles for vetting data)
CREATE TABLE public.ca_verifications (
  profile_id uuid NOT NULL PRIMARY KEY REFERENCES public.profiles(id),
  membership_number text,
  membership_certificate_url text,
  verified_at timestamp with time zone,
  verified_by uuid
);

-- Social profile table (CA social links and professional info)
CREATE TABLE public.social_profile (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id uuid NOT NULL REFERENCES public.profiles(id),
  linkedin_profile text,
  professional_website text,
  instagram_profile text,
  facebook_profile text,
  twitter_profile text,
  youtube_profile text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Performance indexes
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_username ON public.profiles(username);
CREATE INDEX idx_profiles_auth_user_id ON public.profiles(auth_user_id);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_profiles_state ON public.profiles(state);
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active);

CREATE INDEX idx_contact_requests_ca_profile_id ON public.contact_requests(ca_profile_id);
CREATE INDEX idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON public.contact_requests(created_at);

CREATE INDEX idx_ca_verifications_verified_at ON public.ca_verifications(verified_at);
CREATE INDEX idx_ca_verifications_verified_by ON public.ca_verifications(verified_by);