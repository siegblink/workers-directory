# Database Migration Instructions

## Overview

This guide explains how to apply the user profile enhancement migration to your Supabase production database.

## What This Migration Does

- Updates the `handle_new_auth_user` trigger to populate `firstname` and `lastname` fields from user metadata during signup
- Migrates existing users' names from `auth.users` metadata to the `public.users` table
- Enables the navigation component to display user avatars and names from the database

## Current Status

✅ **Code Changes**: Navigation component updated with graceful fallback
✅ **Migration File**: Created at `supabase/migrations/20251025120000_update_user_trigger.sql`
⚠️ **Database**: Migration not yet applied to production

## How to Apply the Migration

### Option 1: Using Supabase Dashboard (Recommended)

1. **Navigate to SQL Editor**
   - Go to your Supabase project dashboard
   - Click on "SQL Editor" in the left sidebar

2. **Copy Migration SQL**
   - Open the file: `supabase/migrations/20251025120000_update_user_trigger.sql`
   - Copy all the SQL content

3. **Execute the Migration**
   - Paste the SQL into the SQL Editor
   - Click "Run" to execute
   - Verify there are no errors in the output

4. **Verify Success**
   - Check that existing users now have `firstname` and `lastname` populated
   - Test signup to confirm new users get their names saved

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Apply pending migrations
npx supabase db push
```

### Option 3: Manual SQL Execution

If you prefer to execute the SQL manually:

```sql
-- 1. Update the trigger function
DROP FUNCTION IF EXISTS public.handle_new_auth_user();

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, firstname, lastname, role, status)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    'customer',
    'active'
  );
  RETURN new;
END;
$$;

-- 2. Migrate existing users
UPDATE public.users u
SET
  firstname = COALESCE(NULLIF(au.raw_user_meta_data->>'first_name', ''), u.firstname, ''),
  lastname = COALESCE(NULLIF(au.raw_user_meta_data->>'last_name', ''), u.lastname, '')
FROM auth.users au
WHERE u.id = au.id
  AND (
    u.firstname IS NULL
    OR u.firstname = ''
    OR u.lastname IS NULL
    OR u.lastname = ''
  )
  AND au.raw_user_meta_data IS NOT NULL;
```

## Verification Steps

After applying the migration:

1. **Check Existing Users**

   ```sql
   SELECT id, firstname, lastname, email
   FROM public.users
   LIMIT 10;
   ```

   Verify that `firstname` and `lastname` are populated

2. **Test New Signup**
   - Create a new test account via your signup page
   - Check that the user's name appears in the navigation
   - Verify the database has the firstname/lastname saved

3. **Test Navigation**
   - Login with an existing account
   - Verify the avatar + first name appears in the navigation
   - Check both desktop and mobile views

## Important Notes

- ✅ **Safe to Run Multiple Times**: The migration is idempotent
- ✅ **No Downtime**: Can be applied while the app is running
- ✅ **Graceful Degradation**: The navigation component works with or without the migration applied
- ⚠️ **Backup Recommended**: Consider backing up your database before applying

## Troubleshooting

### Migration Fails

- Check that you have proper permissions
- Verify the `auth.users` table is accessible
- Ensure RLS policies allow the update

### Names Not Appearing

- Verify the migration ran successfully
- Check that user metadata has `first_name` and `last_name` fields
- Inspect the browser console for any errors

### Users Still See Fallback

- Clear browser cache and reload
- Check that the profile fetch is succeeding (no console errors)
- Verify database RLS policies allow reading from `users` table

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify the migration SQL executed without errors
3. Test with a fresh signup to isolate the issue
4. Review the RLS policies on the `users` table

## Next Steps

After successfully applying the migration:

1. Monitor user signups to ensure names are being saved
2. Consider adding profile picture upload functionality
3. Update other components that might benefit from database profile data
