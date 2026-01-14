

# Database Management Scripts

Unified scripts for managing database backups and imports across **LOCAL** and **PRODUCTION** environments.

---

## 🚀 Quick Start

### Local Database (Default)

```bash
# Create local backup
./scripts/db-backup.sh

# Import latest local backup
./scripts/db-import.sh

# Import specific local backup
./scripts/db-import.sh backup_20260113_103146
```

### Production Database

```bash
# Create production backup
./scripts/db-backup.sh --prod

# Import any backup TO LOCAL (safe!)
./scripts/db-import.sh backup_20260113_103146

# Import any backup to PRODUCTION (DANGEROUS!)
./scripts/db-import.sh backup_20260113_103146 --prod
```

---

## 📦 db-backup.sh - Create Database Backups

Creates a backup of the database with automatic compression.

### Syntax
```bash
./scripts/db-backup.sh [backup_name] [--prod]
```

### Examples

```bash
# Local backups (default)
./scripts/db-backup.sh                    # Auto-generated timestamp name
./scripts/db-backup.sh my_backup          # Custom name
./scripts/db-backup.sh before_migration   # Named backup

# Production backups
./scripts/db-backup.sh --prod                    # Prod with timestamp
./scripts/db-backup.sh pre_deploy --prod         # Named prod backup
./scripts/db-backup.sh weekly_backup --prod      # Weekly prod backup
```

### What It Does

**Local Mode:**
1. ✅ Checks Docker container is running
2. ✅ Creates PostgreSQL dump via Docker
3. ✅ Compresses backup (.gz)
4. ✅ Generates info file
5. ✅ Stores in `backups/db_dumps/`

**Production Mode (`--prod`):**
1. ✅ Validates production credentials in `.env.local`
2. ✅ Requires explicit "yes" confirmation
3. ✅ Creates full database dump
4. ✅ Compresses backup (.gz)
5. ✅ Generates info file with security warnings
6. ✅ Stores in `backups/db_dumps/production/`

### Output Files

**Local:**
```
backups/db_dumps/
  ├── backup_20260113_103146.sql        # Full backup
  ├── backup_20260113_103146.sql.gz     # Compressed
  └── backup_20260113_103146_INFO.txt   # Metadata
```

**Production:**
```
backups/db_dumps/
  ├── backup_20260113_103146.sql        # Full backup (can be from prod or local)
  ├── backup_20260113_103146.sql.gz     # Compressed
  └── backup_20260113_103146_INFO.txt   # Metadata
```

All backups (local and production) are stored in the same directory.

---

## 🔄 db-import.sh - Import Database Backups

Imports/restores a database from a backup file.

### Syntax
```bash
./scripts/db-import.sh [backup_name] [--prod]
```

### Examples

```bash
# Import to LOCAL (default - safe!)
./scripts/db-import.sh                        # Latest backup
./scripts/db-import.sh backup_20260113_103146 # Specific backup

# Import to PRODUCTION (dangerous!)
./scripts/db-import.sh backup_20260113_103146 --prod   # DANGEROUS!
```

### What It Does

**Local Mode (Default):**
1. ✅ Finds backup file (auto-detects latest if not specified)
2. ✅ Confirms with user
3. ✅ Resets database schema
4. ✅ Imports backup data
5. ✅ Verifies import

**Production Mode (`--prod`):**
1. ✅ Validates production credentials
2. ⚠️ Shows CRITICAL warning
3. ⚠️ Requires typing "IMPORT PRODUCTION"
4. ⚠️ Requires second "yes" confirmation
5. 🔴 Drops all production data
6. 🔴 Imports backup
7. ✅ Verifies import

### Safety Features

- 🛡️ Auto-finds latest backup if none specified
- 🛡️ Lists available backups if file not found
- 🛡️ Requires confirmation before proceeding
- 🛡️ Shows backup size before import
- 🛡️ Verifies database is accessible
- 🛡️ Shows import statistics
- 🔒 **PRODUCTION: Requires typing full phrase + double confirmation**

---

## 🗂️ Common Workflows

### Daily Development Workflow

```bash
# Morning: Create a checkpoint
./scripts/db-backup.sh morning_checkpoint

# Work on features...

# Something broke? Restore checkpoint
./scripts/db-import.sh morning_checkpoint

# End of day: Final backup
./scripts/db-backup.sh end_of_day_$(date +%Y%m%d)
```

### Before Deployment

```bash
# 1. Backup production BEFORE deployment
./scripts/db-backup.sh pre_deploy_v2.1 --prod

# 2. Deploy your application

# 3. If something goes wrong, you have a backup ready
```

### Testing with Production Data

```bash
# 1. Create production backup
./scripts/db-backup.sh test_data --prod

# 2. Import to LOCAL (safe!)
./scripts/db-import.sh test_data

# 3. Test locally with real data
# 4. Remember to anonymize sensitive data!
```

### Migration Safety

```bash
# Before running migrations
./scripts/db-backup.sh pre_migration

# Run migrations...
bunx supabase db push

# If migrations fail
./scripts/db-import.sh pre_migration
```

---

## 🔧 Setup for Production

### One-Time Setup

1. **Ensure Production Credentials in `.env.local`**

   Your `.env.local` should have production database URL:
   ```bash
   POSTGRES_URL_NON_POOLING="postgres://postgres.xxx:password@host:5432/postgres?sslmode=require"
   ```

2. **Test Production Connection**

   ```bash
   # Create a test backup to verify credentials
   ./scripts/db-backup.sh test --prod
   ```

3. **Add to `.gitignore` (Already Done)**

   ```bash
   # backups/ is already ignored
   /backups/
   ```

---

## 🚨 Production Safety Rules

### ✅ SAFE Operations

```bash
# Create production backup (READ-ONLY)
./scripts/db-backup.sh --prod

# Import any backup TO LOCAL (safe testing)
./scripts/db-import.sh backup_20260113 # no --prod flag
```

### ⚠️ DANGEROUS Operations

```bash
# Import to PRODUCTION (DESTRUCTIVE!)
./scripts/db-import.sh backup_20260113 --prod

# This will:
# - DELETE ALL production data
# - REPLACE with backup data
# - Cannot be undone (unless you have another backup)
```

### 🛡️ Before Production Import

**ALWAYS:**
1. ✅ Create a backup of current production state
2. ✅ Notify your team
3. ✅ Put application in maintenance mode
4. ✅ Verify the backup file is correct
5. ✅ Test restore on LOCAL first
6. ✅ Have a rollback plan

**NEVER:**
- ❌ Restore to production without a recent backup
- ❌ Restore without team awareness
- ❌ Restore during peak hours
- ❌ Restore without testing first

---

## 📋 Backup Retention Strategy

### Recommended Schedule

```bash
# Daily backups (keep last 7 days)
./scripts/db-backup.sh daily_$(date +%Y%m%d) --prod

# Weekly backups (keep last 4 weeks)
./scripts/db-backup.sh weekly_$(date +%Y_week_%W) --prod

# Before deployments (keep all)
./scripts/db-backup.sh pre_deploy_v1.2.3 --prod

# Before migrations (keep all)
./scripts/db-backup.sh pre_migration_add_users --prod
```

### Cleanup Old Backups

```bash
# Delete local backups older than 30 days
find backups/db_dumps -name "*.sql*" -mtime +30 -delete

# List production backups by size
ls -lhS backups/db_dumps/production/
```

---

## 🔍 Troubleshooting

### "Container not running" (Local)
```bash
bunx supabase start
```

### "Production database URL not found"
Make sure the production credentials are active in `.env.local`:
```bash
POSTGRES_URL_NON_POOLING="postgres://..."
```

### "Permission denied"
```bash
chmod +x scripts/db-backup.sh scripts/db-import.sh
```

### "No backup files found"
```bash
# List available backups
ls -lh backups/db_dumps/*.sql
```

### "Backup file too large"
- Production databases can be large (100MB+)
- Use compressed `.gz` files
- Consider using Supabase Dashboard for very large databases

---

## 📂 Directory Structure

```
backups/
└── db_dumps/
    ├── backup_20260113_103146.sql          # Backup file
    ├── backup_20260113_103146.sql.gz       # Compressed backup
    ├── backup_20260113_103146_INFO.txt     # Backup metadata
    ├── backup_20260114_091523.sql          # Another backup
    └── ...
```

All backups (local and production) are stored in the same `backups/db_dumps/` directory. The `--prod` flag determines which database you're backing up FROM or importing TO, not the file naming.

---

## 🔐 Security Best Practices

### DO

✅ Encrypt production backups at rest
✅ Store backups in secure locations
✅ Use different credentials for dev/prod
✅ Regularly test restore procedures
✅ Follow data retention policies
✅ Anonymize data for development

### DON'T

❌ Commit production backups to git
❌ Share production backups publicly
❌ Store unencrypted on shared drives
❌ Keep backups indefinitely
❌ Use production data without anonymizing
❌ Restore to production without testing

---

## 🆘 Emergency Recovery

If production database is corrupted:

1. **DON'T PANIC!**
2. **Check Supabase Dashboard** for Point-in-Time Recovery
3. **Create backup of current state** (if possible)
4. **Contact team before restoring**
5. **Test restore on LOCAL first**
6. **Only then restore to production** (if needed)

---

## ⚖️ Compliance & Legal

Remember:
- Production data may contain PII
- Follow GDPR, CCPA, or other regulations
- Encrypt backups containing sensitive data
- Follow your organization's data policies
- Delete old backups per retention policy

---

## 🔗 Related Commands

```bash
# Start local Supabase
bunx supabase start

# Stop local Supabase
bunx supabase stop

# Reset local database
bunx supabase db reset

# View local database
bunx supabase db push

# Supabase status
bunx supabase status
```

---

## 📚 Additional Resources

- [Supabase Backups Documentation](https://supabase.com/docs/guides/platform/backups)
- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)
- Project README: `../README.md`
