# Supabase Connection Guide

Complete guide for connecting your WorkerDir app to Supabase (both local and production environments).

---

## ⚠️ SECURITY WARNING

**This document contains EXAMPLE values only!**

- All URLs, passwords, and keys shown are **placeholders**
- **NEVER commit real credentials** to git or documentation
- Real credentials should **ONLY** exist in `.env.local` (gitignored)
- Replace `[username]`, `[password]`, etc. with your actual values
- The local development keys shown are standard Supabase CLI defaults (safe to share)

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Production Setup](#production-setup)
5. [Local Development Setup](#local-development-setup)
6. [Switching Environments](#switching-environments)
7. [Database Sync](#database-sync)
8. [Troubleshooting](#troubleshooting)
9. [Best Practices](#best-practices)

---

## Overview

This project supports two Supabase environments:

| Environment | Purpose | URL | Data |
|------------|---------|-----|------|
| **Production** | Live app, real data | `https://project-ref.supabase.co` | Real user data |
| **Local** | Development, testing | `http://127.0.0.1:54321` | Test data only |

**Current Default**: Production

---

## Prerequisites

### Required

- [Bun](https://bun.com/) v1.3
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Supabase CLI](https://supabase.com/docs/guides/cli) installed
  ```bash
  bun add -g supabase
  ```
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local Supabase)

### Optional

- [PostgreSQL client](https://www.postgresql.org/download/) (for direct database access)

---

## Quick Start

### Using Production (Default)

Your app is already configured for production! Just run:

```bash
bun dev
```

Visit: http://localhost:3000

### Using Local Development

```bash
# Start local Supabase
supabase start

# Switch environment (see Switching Environments section)
# Edit .env.local to use local URLs

# Start app
bun dev
```

---

## Production Setup

### Step 1: Verify Environment Variables

Check `.env.local` file:

```bash
# ⚠️ EXAMPLE ONLY - Replace with your actual values from .env.local
# DO NOT commit real credentials to git!
NEXT_PUBLIC_SUPABASE_URL="https://project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="some-anon-key"
SUPABASE_SERVICE_ROLE_KEY="some-service-role-key"
POSTGRES_URL="postgres://postgres.[username]:[password]@[host]:6543/postgres"
```

### Step 2: Test Connection

```bash
# Install dependencies (if not done)
bun install

# Start dev server
bun dev
```

**Verify Connection** by visiting http://localhost:3000 and checking the console for errors.

### Step 3: Test Database Connection

Create a test API endpoint to verify you can fetch data from Supabase:

**Option 1: Create Test API Route**

Create `app/api/test-supabase/route.ts`:

```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()

    // Test: Fetch categories from database
    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .limit(5)

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection successful!',
      categories,
      count: categories?.length || 0
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to connect to Supabase' },
      { status: 500 }
    )
  }
}
```

**Option 2: Add to Existing Page**

Or add this to any page component (e.g., `app/page.tsx`):

```typescript
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()

  // Fetch categories to test connection
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .limit(5)

  return (
    <div>
      <h1>Supabase Connection Test</h1>
      {error ? (
        <p style={{ color: 'red' }}>Error: {error.message}</p>
      ) : (
        <div>
          <p style={{ color: 'green' }}>✓ Connected to Supabase!</p>
          <p>Found {categories?.length || 0} categories</p>
          <pre>{JSON.stringify(categories, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

**Test the Connection:**

1. If using API route, visit: http://localhost:3000/api/test-supabase
2. If using page component, visit: http://localhost:3000

**Expected Response:**
```json
{
  "success": true,
  "message": "Supabase connection successful!",
  "categories": [
    { "id": 1, "name": "Plumber", "description": "..." },
    { "id": 2, "name": "Electrician", "description": "..." }
  ],
  "count": 2
}
```

**Troubleshooting:**
- ❌ `relation "categories" does not exist` → Run migrations or check table name
- ❌ `Invalid API key` → Check your `.env.local` has correct keys
- ❌ `Failed to fetch` → Verify Supabase is running (local) or URL is correct (production)

### Step 4: Access Production Dashboard

- **Supabase Dashboard**: https://supabase.com/dashboard/project/your-project-ref
- **Database**: https://supabase.com/dashboard/project/your-project-ref/database/tables
- **Authentication**: https://supabase.com/dashboard/project/your-project-ref/auth/users

### Production Environment Details

```bash
# ⚠️ EXAMPLE - Replace with your actual project details
# Supabase URLs
URL: https://project-ref.supabase.co
API: https://project-ref.supabase.co/rest/v1
Auth: https://project-ref.supabase.co/auth/v1

# Database Connection
Host: your-region.pooler.supabase.com
Port: 5432 (direct) / 6543 (pooler)
Database: postgres
User: postgres.your-project-ref
```

---

## Local Development Setup

### Step 1: Install Supabase CLI

```bash
# Install globally
bun add -g supabase

# Verify installation
supabase --version
```

### Step 2: Initialize Supabase (Already Done)

```bash
# Already initialized in this project
# Config at: supabase/config.toml
```

### Step 3: Start Local Supabase

```bash
# Start all Supabase services
supabase start

# This will start:
# - PostgreSQL database
# - Supabase Studio
# - Auth server
# - Storage server
# - Realtime server
```

**Output:**
```
Started supabase local development setup.

API URL: http://127.0.0.1:54321
GraphQL URL: http://127.0.0.1:54321/graphql/v1
S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
anon key: some-anon-key
service_role key: some-service-role-key
```

### Step 4: Configure Environment

Edit `.env.local` - comment out production, uncomment local:

```bash
# Production (COMMENT OUT when using local)
# NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
# NEXT_PUBLIC_SUPABASE_ANON_KEY="your-production-anon-key"

# Local (UNCOMMENT when using local - these are standard local dev keys)
NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
NEXT_PUBLIC_SUPABASE_ANON_KEY="some-anon-key"
SUPABASE_SERVICE_ROLE_KEY="some-service-role-key"
SUPABASE_JWT_SECRET="jwt-token-with-at-least-32-characters-long"
POSTGRES_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
```

### Step 5: Start Your App

```bash
# Restart dev server to pick up new env vars
npm run dev
```

### Step 6: Test Local Connection

**Test with Supabase Studio:**
1. Visit http://localhost:54323
2. Navigate to "Table Editor"
3. Check if `categories` table exists
4. If not, you may need to run migrations or create test data

**Test with API Route:**

Use the same test endpoint from the Production setup (see Step 3 in Production Setup), or visit:
- http://localhost:3000/api/test-supabase

**Quick CLI Test:**
```bash
# Connect to local database
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Inside psql, run:
SELECT * FROM categories LIMIT 5;

# Exit
\q
```

**Add Sample Categories (if table is empty):**
```bash
# Create seed file
cat > supabase/seed.sql << 'EOF'
INSERT INTO categories (name, description, icon) VALUES
  ('Plumber', 'Professional plumbing services', 'wrench'),
  ('Electrician', 'Electrical installation and repair', 'zap'),
  ('Cleaner', 'Home and office cleaning services', 'sparkles'),
  ('Carpenter', 'Woodworking and furniture services', 'hammer'),
  ('Painter', 'Interior and exterior painting', 'palette')
ON CONFLICT DO NOTHING;
EOF

# Apply seeds
supabase db reset
```

### Step 7: Access Local Services

- **App**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323
- **Database**: postgresql://postgres:postgres@127.0.0.1:54322/postgres
- **Email Testing (Inbucket)**: http://localhost:54324

### Local Environment Details

```bash
# Supabase URLs
API URL: http://127.0.0.1:54321
Studio: http://localhost:54323

# Database Connection
Host: 127.0.0.1
Port: 54322
Database: postgres
User: postgres
Password: postgres

# Auth Keys
Anon Key: some-anon-key
Service Role: some-service-role-key
JWT Secret: jwt-token-with-at-least-32-characters-long
```

---

## Switching Environments

### Method 1: Manual Switch (Recommended)

**Switch to Local:**

1. Open `.env.local`
2. **Comment out** production lines (add `#`):
   ```bash
   # NEXT_PUBLIC_SUPABASE_URL="https://project-ref.supabase.co"
   # NEXT_PUBLIC_SUPABASE_ANON_KEY="production-anon-key"
   ```
3. **Uncomment** local lines (remove `#`):
   ```bash
   NEXT_PUBLIC_SUPABASE_URL="http://127.0.0.1:54321"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="local-anon-key"
   ```
4. **Restart** dev server:
   ```bash
   npm run dev
   ```

**Switch to Production:**

Reverse the process - uncomment production, comment out local.

### Method 2: Environment Files (Alternative)

Create separate environment files:

```bash
# Create production env
cp .env.local .env.production

# Create local env
cp .env.local .env.local.backup

# Edit .env.local for local development
# Use .env.production for production
```

### Verify Current Environment

Add this to any page to check which environment is active:

```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
```

Or create a status endpoint:

```typescript
// app/api/supabase-status/route.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    environment: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('localhost')
      ? 'local'
      : 'production',
    url: process.env.NEXT_PUBLIC_SUPABASE_URL
  })
}
```

Visit: http://localhost:3000/api/supabase-status

---

## Database Sync

### Pull Production Schema to Local

```bash
# Pull latest schema from production
# ⚠️ Replace with your actual database URL from .env.local
supabase db pull --db-url "postgres://postgres.[username]:[password]@[host]:5432/postgres"

# Apply to local database
supabase db reset
```

This creates a migration file in `supabase/migrations/` with your production schema.

### Push Local Changes to Production

⚠️ **DANGER**: Only do this if you know what you're doing!

```bash
# Create a migration
supabase migration new your_migration_name

# Edit the migration file
# Add your SQL changes

# Test locally first
supabase db reset

# When ready, push to production
supabase db push
```

### Seed Local Database with Test Data

Create `supabase/seed.sql`:

```sql
-- Example seed data
INSERT INTO categories (name, description) VALUES
  ('Plumber', 'Plumbing services'),
  ('Electrician', 'Electrical services'),
  ('Cleaner', 'Cleaning services');

INSERT INTO users (firstname, lastname, email) VALUES
  ('John', 'Doe', 'john@example.com'),
  ('Jane', 'Smith', 'jane@example.com');
```

Apply seeds:

```bash
supabase db reset
```

---

## Troubleshooting

### Issue: Connection Refused

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:54321
```

**Solution:**
```bash
# Check if Supabase is running
supabase status

# If not running, start it
supabase start

# If still issues, restart
supabase stop
supabase start
```

### Issue: Wrong Database Being Used

**Symptoms:**
- Tables not found
- Different data than expected

**Solution:**
```bash
# Check environment variables
cat .env.local | grep NEXT_PUBLIC_SUPABASE_URL

# Verify in your app
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)

# Clear Next.js cache
rm -rf .next

# Restart dev server
npm run dev
```

### Issue: Environment Variables Not Updating

**Solution:**
```bash
# 1. Restart dev server (Ctrl+C, then npm run dev)
# 2. Clear cache
rm -rf .next

# 3. Verify file saved
cat .env.local | grep NEXT_PUBLIC

# 4. Restart again
npm run dev
```

### Issue: Supabase Won't Start

**Symptoms:**
```
Error: Docker not running
```

**Solution:**
```bash
# 1. Start Docker Desktop
# 2. Wait for Docker to be ready
# 3. Try again
supabase start

# If still failing, reset
supabase stop
docker system prune -a  # ⚠️ This removes all Docker data
supabase start
```

### Issue: Migration Conflicts

**Symptoms:**
```
Error: migration already applied
```

**Solution:**
```bash
# Reset local database
supabase db reset

# Or manually remove conflicting migration
# Then reset again
```

### Issue: Authentication Errors

**Symptoms:**
```
Error: Invalid JWT
```

**Solution:**
```bash
# 1. Check keys match environment
# Production uses production keys
# Local uses local keys

# 2. Verify .env.local has correct keys
cat .env.local | grep ANON_KEY

# 3. Restart dev server
npm run dev
```

---

## Best Practices

### Development Workflow

```
1. Use LOCAL for development
   ↓
2. Test features thoroughly
   ↓
3. Commit migrations to git
   ↓
4. Switch to PRODUCTION to test
   ↓
5. Deploy changes
```

### Database Changes

✅ **DO:**
- Always test migrations locally first
- Pull production schema regularly
- Keep migrations in version control
- Use seed data for local testing
- Document major schema changes

❌ **DON'T:**
- Make manual changes in production database
- Skip testing migrations locally
- Delete migration files
- Share service role keys publicly
- Use production for development

### Environment Safety

| Task | Local | Production |
|------|-------|------------|
| Developing new features | ✅ Yes | ❌ No |
| Testing migrations | ✅ Yes | ⚠️ After local |
| Adding seed data | ✅ Yes | ❌ No |
| Experimenting | ✅ Yes | ❌ No |
| User testing | ❌ No | ✅ Yes |
| Real data operations | ❌ No | ✅ Yes |

### Security

🔒 **Keep These Secret:**
- `SUPABASE_SERVICE_ROLE_KEY` - Full database access
- `POSTGRES_PASSWORD` - Direct database access
- `SUPABASE_JWT_SECRET` - Token signing key

✅ **Safe to Share:**
- `NEXT_PUBLIC_SUPABASE_URL` - Public URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public anonymous key (has RLS)

### Git Best Practices

```bash
# .gitignore should include
.env.local
.env*.local
*.sql.backup

# DO commit
supabase/config.toml
supabase/migrations/*.sql
.env.local.example
```

---

## Useful Commands

### Supabase CLI

```bash
# Start/Stop
supabase start                  # Start local Supabase
supabase stop                   # Stop local Supabase
supabase status                 # Check status

# Database
supabase db reset               # Reset and apply migrations
supabase db pull                # Pull schema from remote
supabase db push                # Push migrations to remote
supabase db dump --local        # Dump local database

# Migrations
supabase migration new <name>   # Create new migration
supabase migration list         # List migrations
supabase migration repair       # Fix migration history

# Auth
supabase functions deploy       # Deploy edge functions
supabase gen types typescript   # Generate TypeScript types

# Logs
supabase logs                   # View logs
```

### PostgreSQL Direct Access

```bash
# Connect to local database
psql postgresql://postgres:postgres@127.0.0.1:54322/postgres

# Connect to production
# ⚠️ Replace with your actual credentials from .env.local
psql "postgres://postgres.[user-name]:[password]@[host]:5432/postgres"

# List tables
\dt

# Describe table
\d table_name

# Run query
SELECT * FROM users LIMIT 5;

# Exit
\q
```

### NPM Scripts

```bash
npm run dev                     # Start development server
npm run build                   # Build for production
npm run start                   # Start production server
npm run lint                    # Run ESLint
```

---

## Quick Reference Card

### URLs

| Service | Local | Production |
|---------|-------|------------|
| App | http://localhost:3000 | https://your-app.vercel.app |
| Supabase Studio | http://localhost:54323 | https://supabase.com/dashboard |
| API | http://127.0.0.1:54321 | https://your-project-ref.supabase.co |
| Database | 127.0.0.1:54322 | your-region.pooler.supabase.com:5432 |

### Switch Checklist

- [ ] Edit `.env.local`
- [ ] Comment/uncomment correct URLs
- [ ] Save file
- [ ] Restart dev server (`npm run dev`)
- [ ] Verify environment in browser console
- [ ] Check database has expected data

### Emergency Commands

```bash
# App won't start
rm -rf .next && npm run dev

# Supabase issues
supabase stop && supabase start

# Reset everything
supabase db reset

# Check what's running
supabase status
```

---

## Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Local Development**: https://supabase.com/docs/guides/cli/local-development
- **Next.js + Supabase**: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
- **Database Migrations**: https://supabase.com/docs/guides/cli/local-development#database-migrations
- **TypeScript Support**: https://supabase.com/docs/reference/javascript/typescript-support

---

## Support

For issues or questions:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [Supabase Documentation](https://supabase.com/docs)
3. Check project's GitHub issues
4. Ask in project Slack/Discord

---

**Last Updated**: 2025-10-22
**Version**: 1.0.0
