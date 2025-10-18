# Database Migration Instructions

Since you've migrated to a new Supabase project and lost access to the old one, follow these steps to restore your database functionality:

## ⚠️ Important: Your Data Was Lost

When migrating Supabase projects, data does NOT automatically transfer. Unfortunately, without access to your old project, your previous projects cannot be recovered.

## ✅ Solution: Run Migrations in Supabase Dashboard

Since `supabase db push` requires linking (which you may not have set up), run the migrations directly in your Supabase dashboard:

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**

### Step 2: Run Migrations in Order

Copy and paste each migration file content into the SQL Editor and run them **in this exact order**:

#### Migration 1: Complete Schema
**File**: `supabase/migrations/00_complete_schema.sql`
- This creates all your tables (projects, tasks, steps, etc.)
- Run this first

#### Migration 2: Create Profiles & User Roles
**File**: `supabase/migrations/20251018173300_create_profiles_and_fix_schema.sql`
- This creates the profiles table and user role system
- Sets you as admin
- Run this second

#### Migration 3: Create Sample Data
**File**: `supabase/migrations/20251018173400_create_sample_data.sql`
- This creates a sample project to test the system
- Run this third (only after you've signed up/logged in to your app)

### Step 3: Verify Everything Works

Run this verification query in SQL Editor:

```sql
-- Check if everything is set up correctly
SELECT 'Projects:' as check_type, COUNT(*) as count FROM public.projects
UNION ALL
SELECT 'Profiles:' as check_type, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Users:' as check_type, COUNT(*) as count FROM auth.users;

-- View your projects
SELECT * FROM public.projects;

-- View your profile
SELECT * FROM public.profiles;
```

## Alternative: Link Supabase CLI (Optional)

If you want to use `supabase db push` in the future:

```bash
# Link your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Then you can push migrations
npx supabase db push
```

To find your project ref:
1. Go to Supabase Dashboard
2. Project Settings → General
3. Copy the "Reference ID"

## What's Next?

After running the migrations:

1. **Sign up/Log in** to your application
2. **Create new projects** - the app is fully functional
3. All features will work:
   - Project creation and management
   - Step planning
   - Task tracking
   - AI features
   - Collaboration features

## Files Created

- ✅ `00_complete_schema.sql` - All database tables and functions
- ✅ `20251018173300_create_profiles_and_fix_schema.sql` - Profiles and user roles
- ✅ `20251018173400_create_sample_data.sql` - Sample project for testing
- ✅ `verify_and_fix.sql` - Verification queries
- ✅ `recovery_guide.sql` - Recovery options (not applicable without old project access)

## Need Help?

If you encounter any errors:
1. Copy the error message
2. Run the `verify_and_fix.sql` script to diagnose
3. Check that you're logged in to your app before running the sample data migration

---

**Summary**: Your database structure is ready. Just run the migrations in your Supabase SQL Editor, and you can start using the app with fresh data.
