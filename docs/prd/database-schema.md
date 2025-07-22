# Database Schema Management

## Quick Summary

- **Change Policy**: All schema changes must use ALTER statements (no modifying CREATE statements)
- **Migration Files**: Stored in `src/migrations/` with feature-date naming
- **Documentation**: Living documentation with change logs and version tracking
- **Safety First**: Production safety through proper change management procedures

## Detailed Sections

### [Schema Change Management Policy](#schema-change-management-policy)
### [Migration File Standards](#migration-file-standards)
### [Current Schema Overview](#current-schema-overview)
### [Development Workflow](#development-workflow)

---

## Schema Change Management Policy

### Core Principle

**Once a table exists in production or shared development environments, all schema changes MUST use `ALTER` statements rather than modifying the original `CREATE` statements.**

### Rationale

- **Production Safety**: Prevents accidental data loss in production environments
- **Version Control**: Maintains clear history of schema evolution
- **Team Collaboration**: Enables safe schema changes across multiple developers
- **Migration Tracking**: Provides clear audit trail of all database modifications
- **Rollback Capability**: Allows for easier rollback strategies when needed

### Schema Change Examples

```sql
-- ✅ CORRECT: Adding new column using ALTER
ALTER TABLE public.profiles 
ADD COLUMN profile_completion_percentage INTEGER DEFAULT 0 
CHECK (profile_completion_percentage >= 0 AND profile_completion_percentage <= 100);

-- ✅ CORRECT: Adding indexes
CREATE INDEX idx_profiles_completion_percentage 
ON public.profiles(profile_completion_percentage);

-- ❌ INCORRECT: Modifying CREATE statement
-- Don't modify the original CREATE TABLE statement in supabase.sql
```

---

## Migration File Standards

### File Organization

```
src/migrations/
├── profile-completion-tracking-2025-01-15.sql
├── contact-request-priority-2025-01-20.sql
├── ca-verification-fields-2025-01-25.sql
└── location-management-simple-2025-01-15.sql
```

### File Naming Convention

**Pattern**: `<feature-description>-YYYY-MM-DD.sql`

**Examples**:
- `profile-completion-tracking-2025-01-15.sql`
- `contact-request-priority-2025-01-20.sql`
- `ca-verification-fields-2025-01-25.sql`

### Migration File Structure

```sql
-- File: src/migrations/profile-completion-tracking-2025-01-15.sql
-- Purpose: Add profile completion tracking to existing profiles table
-- Date: January 15, 2025

-- === FORWARD MIGRATION ===

-- Add profile completion tracking to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN profile_completion_percentage INTEGER DEFAULT 0 
CHECK (profile_completion_percentage >= 0 AND profile_completion_percentage <= 100);

-- Add completion tracking metadata
ALTER TABLE public.profiles 
ADD COLUMN last_completed_section TEXT,
ADD COLUMN completion_updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create index for completion queries
CREATE INDEX idx_profiles_completion_percentage 
ON public.profiles(profile_completion_percentage);

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

-- === ROLLBACK INSTRUCTIONS (if needed) ===
-- DROP TRIGGER IF EXISTS trigger_update_completion_timestamp ON public.profiles;
-- DROP FUNCTION IF EXISTS update_completion_timestamp();
-- DROP INDEX IF EXISTS idx_profiles_completion_percentage;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS completion_updated_at;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS last_completed_section;
-- ALTER TABLE public.profiles DROP COLUMN IF EXISTS profile_completion_percentage;
```

---

## Current Schema Overview

### Core Tables

### `profiles` - User Profile Data

**Purpose**: Central user profile information for both CAs and customers

**Key Fields**:
- `id` - Primary key (UUID)
- `auth_user_id` - Foreign key to Supabase auth.users
- `role` - User type (CA or Customer)
- `first_name`, `middle_name`, `last_name` - Name components
- `username` - Unique identifier within location
- `state_id`, `district_id` - Foreign keys to location tables (normalized)
- `language_ids` - Array of language IDs (normalized)
- `specialization` - Array of service specializations
- `profile_completion_percentage` - Completion tracking

**Schema Changes (January 16, 2025)**:
- ✅ **Removed**: `city` and `state` text columns (replaced by foreign keys)
- ✅ **Added**: `language_ids` INTEGER[] for normalized language references
- ✅ **Deprecated**: `languages` TEXT[] (kept temporarily for migration safety)

### `languages` - Language Reference Table ✨ **NEW**

**Purpose**: Normalized language data for multi-language support

**Key Fields**:
- `id` - Primary key (SERIAL)
- `name` - Language name in English
- `code` - ISO language code (optional)
- `native_name` - Language name in native script
- `is_active` - Enable/disable languages

**Benefits**:
- Consistent language data across the platform
- Support for native language names and ISO codes
- Easy to add new languages without schema changes
- Better data integrity and referential consistency

### `states` and `districts` - Location Reference Tables

**Purpose**: Hierarchical location data for India

**Key Features**:
- States table with standardized state names and codes
- Districts table with foreign key relationships to states
- Proper indexing for performance
- Unique constraints to prevent duplicates

**Integration**:
- Profiles reference `state_id` and `district_id` instead of text fields
- Eliminates data inconsistency and typos
- Enables proper location-based filtering and search

### Profile Completion Tracking

**Calculation Logic**:
- **Basic Info** (20%): Name, email, phone, location fields completed
- **Professional Details** (20%): Bio, specializations, languages defined
- **Experience** (20%): At least one experience entry with complete details
- **Education** (20%): At least one education entry with complete details
- **Social/Contact** (20%): At least one social link or professional website

**Implementation Status**: ⚠️ Ready to implement - migration file created but not yet applied

---

## Development Workflow

### Schema Change Process

1. **Identify Need**: Feature requires database schema changes
2. **Create Migration File**: Write ALTER statements in migration file with proper naming
3. **Include Rollback Instructions**: Add commented rollback commands
4. **Test Locally**: Verify migration works on local development database
5. **Document Changes**: Update progress tracker with schema change details
6. **Peer Review**: Have schema changes reviewed before merging
7. **Apply to Staging**: Test migration on staging environment
8. **Production Deployment**: Apply migration during deployment window

### Local Development

```bash
# Apply migration locally
psql -h localhost -p 54322 -U postgres -d postgres -f src/migrations/feature-name-2025-01-15.sql

# Or using Supabase CLI
supabase db reset --local
```

### Emergency Schema Changes

**For Critical Hotfixes**:
- Emergency changes still follow ALTER statement policy
- Document rationale for emergency change
- Create proper migration file post-deployment
- Update all environments to match production schema

### Schema Documentation Maintenance

**Requirements**:
- **Living Documentation**: Keep this file updated with current state
- **Change Log**: Maintain chronological log of all schema modifications
- **Version Tracking**: Tag schema versions with application releases
- **Impact Assessment**: Document performance and breaking change implications

### Migration Tracking

| Migration File | Date Applied | Status | Description |
|---------------|--------------|--------|-------------|
| `location-management-simple-2025-01-15.sql` | 2025-01-15 | ✅ Applied | Added states and districts tables |
| `profile-location-fields-2025-01-15.sql` | 2025-01-15 | ✅ Applied | Added state_id and district_id to profiles |
| `profile-completion-tracking-2025-01-15.sql` | Pending | ⚠️ Ready | Profile completion percentage tracking |

---

## Schema Safety Guidelines

### Best Practices

1. **Always Use Transactions**: Wrap DDL changes in transactions when possible
2. **Test Rollback**: Always test rollback procedures on non-production data
3. **Monitor Performance**: Watch for performance impacts after schema changes
4. **Incremental Changes**: Make small, incremental changes rather than large rewrites
5. **Backup First**: Always ensure recent backups before production schema changes

### Risk Assessment

**Low Risk Changes**:
- Adding nullable columns with defaults
- Creating new indexes (done during low traffic)
- Adding check constraints (validated on existing data first)

**Medium Risk Changes**:
- Adding non-nullable columns (requires data migration strategy)
- Modifying existing constraints
- Renaming columns (requires application code coordination)

**High Risk Changes**:
- Dropping columns or tables
- Changing data types
- Modifying primary keys or foreign keys

### Rollback Strategy

**Preparation**:
- Always include rollback instructions in migration files
- Test rollback procedures on staging environment
- Have monitoring in place to detect issues quickly
- Plan rollback timing and communication strategy

**Execution**:
- Monitor application logs and metrics after deployment
- Have DBA available during migration windows
- Use feature flags to disable functionality if needed
- Execute rollback immediately if critical issues detected

---

## Related Documentation

- [Overview](./overview.md) - Project description and objectives
- [Architecture Guidelines](./architecture-guidelines.md) - Service layer and state management
- [Component Standards](./component-standards.md) - Development standards and naming conventions
- [Testing Standards](./testing-standards.md) - Testing approaches and coverage requirements 