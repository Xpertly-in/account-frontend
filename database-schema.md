# Xpertly Database Schema Documentation

## Overview

This document outlines the complete database schema for the Xpertly CA platform, built on Supabase (PostgreSQL). The schema supports user authentication, CA profiles, lead management, and engagement tracking.

## Core Tables

### 1. Profiles Table

**Purpose**: Stores user profile information for both CAs and customers.

```sql
CREATE TABLE public.profiles (
  user_id             uuid         PRIMARY KEY REFERENCES auth.users(id),
  name                text         NOT NULL,
  email               text         NOT NULL,
  phone               text,
  profile_picture     text,
  role                text         NOT NULL CHECK (role IN ('ca', 'customer')),
  onboarding_completed boolean     NOT NULL DEFAULT false,
  created_at          timestamptz  NOT NULL DEFAULT now(),
  updated_at          timestamptz  NOT NULL DEFAULT now(),

  -- CA-specific fields
  is_verified         boolean      DEFAULT false,
  available_for_leads boolean      DEFAULT true,
  verified_at         timestamptz,
  verified_by         uuid         REFERENCES auth.users(id),
  is_phone_visible    boolean      DEFAULT false,
  about               text,
  years_of_experience numeric,
  gender              text,
  type_of_user        text,
  type_of_communication text
);
```

**Key Features**:

- Uses `user_id` as primary key (references Supabase auth.users)
- Supports both CA and customer roles
- Includes verification system for CAs
- Tracks onboarding completion status

### 2. Leads Table

**Purpose**: Stores customer service requests that CAs can view and engage with.

```sql
CREATE TABLE public.leads (
  id                  uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id         uuid         NOT NULL REFERENCES public.profiles(user_id),
  services            text[]       NOT NULL,
  urgency             text         NOT NULL CHECK (urgency IN (
    'Immediately',
    'Within a week',
    'This month',
    'Just exploring'
  )),
  contact_preference  text         NOT NULL CHECK (contact_preference IN (
    'Phone',
    'WhatsApp',
    'Email'
  )),
  status              text         NOT NULL DEFAULT 'new' CHECK (status IN (
    'new',
    'contacted',
    'closed',
    'archived'
  )),
  location_city       text         NOT NULL,
  location_state      text         NOT NULL,
  contact_info        text         NOT NULL,
  notes               text,
  created_at          timestamptz  NOT NULL DEFAULT now(),
  updated_at          timestamptz  NOT NULL DEFAULT now()
);
```

**Key Features**:

- Array field for multiple services per lead
- Enum constraints for urgency, contact preference, and status
- Location stored as separate city/state fields
- Tracks creation and update timestamps

### 3. Lead Engagements Table

**Purpose**: Tracks CA interactions with leads, including view history and preferences.

```sql
CREATE TABLE public.lead_engagements (
  lead_id      uuid         NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  ca_id        uuid         NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  viewed_at    timestamptz  NOT NULL DEFAULT now(),
  is_hidden    boolean      NOT NULL DEFAULT false,
  hidden_at    timestamptz,
  notes        text,
  updated_at   timestamptz  NOT NULL DEFAULT now(),

  PRIMARY KEY (lead_id, ca_id)
);
```

**Key Features**:

- Composite primary key prevents duplicate engagements
- Tracks when CAs view leads
- Allows CAs to hide leads from their view
- Supports CA-specific notes on leads

### 4. Contact Requests Table

**Purpose**: Stores direct contact form submissions from users (registered or anonymous) to specific CAs.

**Key Features**:

- Supports both registered and anonymous users
- Links to specific CAs via `ca_id`
- Tracks contact preferences and actual contact details
- Includes subject, message, and optional service needed
- Status tracking for CA responses
- CA private notes for internal tracking
- Flexible urgency and contact preference fields
- Application-managed timestamps for better control
- Minimal essential indexes for optimal performance

#### Table Definition

```sql
CREATE TABLE public.contact_requests (
  id                  uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  ca_id               uuid         NOT NULL REFERENCES public.profiles(user_id),

  -- Customer information (can be anonymous)
  customer_id         uuid         REFERENCES public.profiles(user_id), -- NULL for anonymous users
  customer_name       text         NOT NULL,
  customer_email      text         NOT NULL,
  customer_phone      text,

  -- Request details
  subject             text         NOT NULL,
  message             text         NOT NULL,
  service_needed      text,
  urgency             text         NOT NULL,
  contact_preference  text         NOT NULL,
  contact_detail      text         NOT NULL,

  -- Location (optional)
  location_city       text,
  location_state      text,

  -- Status tracking
  status              text         NOT NULL DEFAULT 'new',

  -- CA Notes
  ca_private_notes    text,

  -- Timestamps
  created_at          timestamptz  NOT NULL DEFAULT now(),
  updated_at          timestamptz  NOT NULL DEFAULT now(),
  replied_at          timestamptz
);
```

#### Performance Indexes

```sql
-- Essential indexes only for optimal performance
CREATE INDEX idx_contact_requests_ca_id ON public.contact_requests(ca_id);
CREATE INDEX idx_contact_requests_status ON public.contact_requests(status);
CREATE INDEX idx_contact_requests_created_at ON public.contact_requests(created_at);
```

#### Row Level Security (RLS) Policies

```sql
-- Enable RLS
ALTER TABLE public.contact_requests ENABLE ROW LEVEL SECURITY;

-- CAs can view their own contact requests
CREATE POLICY "CAs can view contact requests" ON public.contact_requests
  FOR SELECT USING (auth.uid() = ca_id);

-- CAs can update their own contact requests (for status changes)
CREATE POLICY "CAs can update contact requests" ON public.contact_requests
  FOR UPDATE USING (auth.uid() = ca_id);

-- Allow contact request creation (handled by service layer for anonymous users)
CREATE POLICY "Allow contact request creation" ON public.contact_requests
  FOR INSERT WITH CHECK (true);
```

#### Documentation Comments

```sql
COMMENT ON TABLE public.contact_requests IS 'Stores direct contact form submissions from users (registered or anonymous) to specific CAs';
COMMENT ON COLUMN public.contact_requests.customer_id IS 'References profiles.user_id for registered users, NULL for anonymous users';
COMMENT ON COLUMN public.contact_requests.service_needed IS 'Optional field indicating what specific service the customer is inquiring about';
COMMENT ON COLUMN public.contact_requests.contact_detail IS 'Actual contact information based on contact_preference (phone number, email, or WhatsApp number)';
COMMENT ON COLUMN public.contact_requests.ca_private_notes IS 'Private notes that CAs can add for internal tracking and follow-up';
COMMENT ON COLUMN public.contact_requests.updated_at IS 'Timestamp managed by application layer, not auto-updated by database';
```

### 5. CA Services Table

**Purpose**: Stores available services that CAs can offer.

```sql
CREATE TABLE public.services (
  service_id    uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  ca_id         uuid         NOT NULL REFERENCES public.profiles(user_id),
  service_name  text         NOT NULL,
  is_active     boolean      NOT NULL DEFAULT true,
  updated_at    timestamptz  NOT NULL DEFAULT now()
);
```

### 6. CA Experiences Table

**Purpose**: Stores CA work experience and employment history.

```sql
CREATE TABLE public.experiences (
  id              uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  ca_id           uuid         NOT NULL REFERENCES public.profiles(user_id),
  title           text         NOT NULL,
  employment_type text,
  company_name    text,
  location        text,
  is_current      boolean      DEFAULT false,
  start_date      date,
  end_date        date,
  grade           text,
  description     text,
  is_active       boolean      DEFAULT true,
  created_at      timestamptz  NOT NULL DEFAULT now()
);
```

### 7. Social Profile Table

**Purpose**: Stores CA social media and professional links.

```sql
CREATE TABLE public.social_profile (
  id                    uuid         PRIMARY KEY DEFAULT uuid_generate_v4(),
  ca_id                 uuid         NOT NULL REFERENCES public.profiles(user_id),
  linkedin_profile      text,
  professional_website  text,
  ica_membership_number text,
  practice_license_number text,
  professional_email    text,
  professional_phone    text,
  areas_of_expertise    text,
  created_at           timestamptz  NOT NULL DEFAULT now()
);
```

## Indexes and Performance

### Recommended Indexes

```sql
-- Performance indexes for leads filtering
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_urgency ON public.leads(urgency);
CREATE INDEX idx_leads_location_city ON public.leads(location_city);
CREATE INDEX idx_leads_location_state ON public.leads(location_state);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_leads_services ON public.leads USING GIN(services);

-- Performance indexes for lead engagements
CREATE INDEX idx_lead_engagements_ca_id ON public.lead_engagements(ca_id);
CREATE INDEX idx_lead_engagements_viewed_at ON public.lead_engagements(viewed_at);
CREATE INDEX idx_lead_engagements_is_hidden ON public.lead_engagements(is_hidden);

-- Performance indexes for profiles
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_is_verified ON public.profiles(is_verified);
CREATE INDEX idx_profiles_available_for_leads ON public.profiles(available_for_leads);
```

## Row Level Security (RLS) Policies

### Profiles Table Policies

```sql
-- Users can view their own profile and public CA profiles
CREATE POLICY "Users can view profiles" ON public.profiles
  FOR SELECT USING (
    auth.uid() = user_id OR
    (role = 'ca' AND is_verified = true)
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

### Leads Table Policies

```sql
-- Customers can view their own leads
CREATE POLICY "Customers can view own leads" ON public.leads
  FOR SELECT USING (auth.uid() = customer_id);

-- CAs can view all active leads
CREATE POLICY "CAs can view leads" ON public.leads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND role = 'ca'
      AND is_verified = true
    )
  );

-- Customers can insert their own leads
CREATE POLICY "Customers can create leads" ON public.leads
  FOR INSERT WITH CHECK (auth.uid() = customer_id);
```

### Lead Engagements Table Policies

```sql
-- CAs can manage their own engagements
CREATE POLICY "CAs can manage engagements" ON public.lead_engagements
  FOR ALL USING (auth.uid() = ca_id);
```

## Data Types and Constraints

### Enum Values

**Lead Status Options**:

- `new` - Newly submitted lead
- `contacted` - CA has viewed contact information
- `closed` - Lead has been resolved
- `archived` - Lead has been archived

**Lead Urgency Options**:

- `Immediately` - Urgent requirement
- `Within a week` - Required within a week
- `This month` - Required within current month
- `Just exploring` - Exploratory inquiry

**Contact Preference Options**:

- `Phone` - Prefer phone contact
- `WhatsApp` - Prefer WhatsApp contact
- `Email` - Prefer email contact

**User Roles**:

- `ca` - Chartered Accountant
- `customer` - Service seeker

## Common Services List

Based on the CA onboarding system, common services include:

- GST Filing
- Income Tax Filing
- Company Registration
- Compliance Services
- Audit Services
- Financial Planning
- Bookkeeping
- Payroll Management
- Tax Planning
- Business Consulting

## Migration Scripts

### Initial Schema Setup

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables in dependency order
-- 1. Profiles (depends on auth.users)
-- 2. Leads (depends on profiles)
-- 3. Lead Engagements (depends on leads and profiles)
-- 4. Services (depends on profiles)
-- 5. Experiences (depends on profiles)
-- 6. Social Profile (depends on profiles)
```

### Schema Updates

```sql
-- Example migration for adding new fields
ALTER TABLE public.leads
ADD COLUMN archived_at timestamptz,
ADD COLUMN priority_score integer DEFAULT 0;

-- Update constraints
ALTER TABLE public.leads
ADD CONSTRAINT check_priority_score
CHECK (priority_score >= 0 AND priority_score <= 100);
```

## Backup and Maintenance

### Regular Maintenance Tasks

1. **Index Maintenance**: Monitor and rebuild indexes monthly
2. **Statistics Update**: Update table statistics weekly
3. **Cleanup Tasks**: Archive old leads and engagements quarterly
4. **Performance Monitoring**: Monitor slow queries and optimize

### Backup Strategy

1. **Daily Backups**: Automated daily backups via Supabase
2. **Point-in-Time Recovery**: 7-day point-in-time recovery window
3. **Export Scripts**: Regular data exports for compliance

## Security Considerations

1. **Data Encryption**: All data encrypted at rest and in transit
2. **Access Control**: RLS policies enforce data access rules
3. **Audit Trail**: All modifications tracked with timestamps
4. **PII Protection**: Contact information protected by engagement system
5. **Role-based Access**: Different access levels for CAs vs customers

## Performance Considerations

1. **Query Optimization**: Proper indexing for filter operations
2. **Connection Pooling**: Supabase handles connection management
3. **Caching Strategy**: Application-level caching for filter options
4. **Pagination**: Implement pagination for large result sets
5. **Monitoring**: Track query performance and optimize bottlenecks
