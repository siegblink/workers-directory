# Quick Guide: Apply Database Optimizations

Follow these steps to apply all the query optimizations to your database.

---

## 🚀 Quick Start (5 minutes)

### Step 1: Apply Migration Locally

```bash
cd /path/to/workers-directory

# Reset local database with optimizations
supabase db reset
```

**Expected output**:
```
Resetting local database...
Applying migration 20251022140056_optimize_queries_and_add_auth_id.sql...
✓ Finished
```

### Step 2: Verify It Worked

```bash
# Check if view exists
supabase db dump --local | grep "workers_with_details"

# Should see: CREATE VIEW workers_with_details...
```

### Step 3: Start Your App

```bash
npm run dev
```

**That's it!** Your local environment now has all optimizations.

---

## 🌐 Apply to Production

### Option 1: Using Supabase CLI (Recommended)

```bash
# Push migration to production
supabase db push
```

### Option 2: Manual Application

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/giepserxlrweienyqgwu
   - Click "SQL Editor"

2. **Run the Migration**
   - Copy contents of `supabase/migrations/20251022140056_optimize_queries_and_add_auth_id.sql`
   - Paste into SQL Editor
   - Click "Run"

3. **Verify**
   ```sql
   -- Check view exists
   SELECT COUNT(*) FROM workers_with_details;

   -- Check functions exist
   SELECT * FROM get_top_rated_workers(5, 1);
   ```

---

## 🔗 Link Existing Users to Auth

If you have existing users without `auth_id`:

```sql
-- Run this in SQL Editor (Supabase Dashboard)
UPDATE users u
SET auth_id = au.id
FROM auth.users au
WHERE u.email = au.email
AND u.auth_id IS NULL;
```

---

## ✅ Verification Tests

### Test 1: Search Workers

```typescript
import { searchWorkers } from '@/lib/database'

const result = await searchWorkers({ limit: 20 })
console.log(`Found ${result.data.length} workers`)
// Should return quickly (< 500ms)
```

### Test 2: Top Rated Workers

```typescript
import { getTopRatedWorkers } from '@/lib/database'

const result = await getTopRatedWorkers(10)
console.log(`Top 10 workers:`, result.data)
```

### Test 3: Categories with Count

```typescript
import { getCategoriesWithWorkerCount } from '@/lib/database'

const result = await getCategoriesWithWorkerCount()
console.log(`Categories:`, result.data)
```

---

## 🐛 Troubleshooting

### Error: "relation workers_with_details does not exist"

**Solution**:
```bash
supabase db reset
```

### Error: "function get_top_rated_workers does not exist"

**Solution**: Migration not applied
```bash
# Check migration status
ls supabase/migrations/

# Should see: 20251022140056_optimize_queries_and_add_auth_id.sql

# Reset database
supabase db reset
```

### Error: "column auth_id does not exist"

**Solution**:
```bash
# For local
supabase db reset

# For production - run migration manually
```

### Slow Performance Still

**Check**:
```sql
-- Make sure indexes exist
\di users_auth_id

-- Make sure view is used
EXPLAIN ANALYZE SELECT * FROM workers_with_details LIMIT 10;
```

---

## 📊 Expected Performance

| Operation | Before | After |
|-----------|--------|-------|
| Search 100 workers | 5-10s | < 500ms |
| Top 10 rated | 3-5s | < 200ms |
| 20 categories | 1-2s | < 100ms |

If your times are much higher, check:
1. Migration applied correctly
2. Indexes created
3. View exists
4. Using optimized functions (not old ones)

---

## 🔄 Rollback (if needed)

If you need to revert:

```bash
# Local: Use backup
mv lib/database/queries/workers.ts.backup lib/database/queries/workers.ts

# Database: Remove migration
# Delete file: supabase/migrations/20251022140056_optimize_queries_and_add_auth_id.sql
supabase db reset
```

---

## 📞 Need Help?

1. Check [DATABASE_OPTIMIZATION.md](docs/DATABASE_OPTIMIZATION.md) for details
2. Check [QUERY_OPTIMIZATION_SUMMARY.md](QUERY_OPTIMIZATION_SUMMARY.md) for overview
3. Review migration file for SQL details

---

**Quick Commands**:
```bash
# Apply locally
supabase db reset

# Verify
supabase status

# Test
npm run dev
```

**Done!** ✅
