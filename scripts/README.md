# Database Management Scripts

Collection of bash scripts for managing database backups and restores.

## 📦 Available Scripts

### `backup-db.sh` - Create Database Backup

Creates a backup of the current database.

**Usage:**
```bash
# Create backup with auto-generated timestamp name
./scripts/backup-db.sh

# Create backup with custom name
./scripts/backup-db.sh my_backup_name
```

**What it does:**
- Dumps the entire database to a `.sql` file
- Creates a compressed `.sql.gz` version
- Generates an info file with backup details
- Shows database statistics (users, workers count)

**Output files:**
- `backup_YYYYMMDD_HHMMSS.sql` - SQL dump
- `backup_YYYYMMDD_HHMMSS.sql.gz` - Compressed backup
- `backup_YYYYMMDD_HHMMSS_INFO.txt` - Backup information

---

### `restore-db.sh` - Restore Database Backup

Restores a database from a backup file.

**Usage:**
```bash
# Restore latest backup automatically
./scripts/restore-db.sh

# Restore specific backup by name
./scripts/restore-db.sh backup_20260113_103146

# Works with or without .sql extension
./scripts/restore-db.sh backup_20260113_103146.sql
```

**What it does:**
1. Lists available backups if name not found
2. Confirms before proceeding (prevents accidents)
3. Resets the database schema
4. Imports the backup data
5. Verifies the restore was successful

**Safety features:**
- Requires confirmation before proceeding
- Shows backup size before restore
- Verifies database is running
- Shows restore statistics

---

## 📝 Examples

### Daily Workflow

```bash
# Morning: Create a backup before making changes
./scripts/backup-db.sh before_changes

# Make your changes...

# If something goes wrong, restore the backup
./scripts/restore-db.sh before_changes

# End of day: Create final backup
./scripts/backup-db.sh end_of_day_$(date +%Y%m%d)
```

### Quick Recovery

```bash
# Oh no! Something broke. Quick restore!
./scripts/restore-db.sh

# This will automatically use the latest backup
```

### List Available Backups

```bash
ls -lh backups/db_dumps/*.sql | grep -v ".gz"
```

---

## ⚙️ Requirements

- Docker running
- Supabase local instance running (`bunx supabase start`)
- Bash shell

---

## 📁 Backup Location

All backups are stored in:
```
backups/db_dumps/
```

---

## 🔒 Important Notes

1. **Backups are local only** - They are NOT automatically pushed to git
2. **Always test restores** - Verify critical data after restore
3. **Keep multiple backups** - Don't rely on just one
4. **Regular cleanup** - Delete old backups to save space

---

## 🚨 Troubleshooting

### "Container not running"
```bash
bunx supabase start
```

### "No backup files found"
Check that backups exist:
```bash
ls backups/db_dumps/
```

### Permission denied
Make scripts executable:
```bash
chmod +x scripts/*.sh
```
