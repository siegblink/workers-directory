#!/bin/bash

# Database Backup Script
# Usage: ./scripts/backup-db.sh [backup_name]
# If no backup_name is provided, generates timestamp-based name

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups/db_dumps"

# Docker container name
CONTAINER_NAME="supabase_db_workers-directory"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   Database Backup Tool${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename
if [ -z "$1" ]; then
    # No argument - use timestamp
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_NAME="backup_${TIMESTAMP}"
else
    # Use provided name
    BACKUP_NAME="$1"
fi

# Remove .sql extension if provided (we'll add it)
BACKUP_NAME="${BACKUP_NAME%.sql}"

BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.sql"
INFO_FILE="$BACKUP_DIR/${BACKUP_NAME}_INFO.txt"

echo -e "${YELLOW}Creating backup: ${BLUE}${BACKUP_NAME}.sql${NC}"
echo ""

# Check if Docker container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}Error: Supabase database container is not running${NC}"
    echo -e "${YELLOW}Please start Supabase first with: bunx supabase start${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker container is running${NC}"
echo ""

# Create backup
echo -e "${YELLOW}Creating database backup...${NC}"
docker exec "$CONTAINER_NAME" pg_dump -U postgres -d postgres --no-owner --no-acl > "$BACKUP_FILE"

# Get backup size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo -e "${GREEN}✓ Backup created: $BACKUP_SIZE${NC}"
echo ""

# Get database stats
USER_COUNT=$(docker exec "$CONTAINER_NAME" psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM users;" | xargs)
WORKER_COUNT=$(docker exec "$CONTAINER_NAME" psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM workers;" | xargs)

# Create info file
cat > "$INFO_FILE" << EOF
Database Backup Information
Generated: $(date)
Database: postgres
Container: $CONTAINER_NAME
File: ${BACKUP_NAME}.sql
Size: $BACKUP_SIZE

Database Statistics:
- Total Users: $USER_COUNT
- Total Workers: $WORKER_COUNT
EOF

echo -e "${GREEN}✓ Info file created${NC}"
echo ""

# Compress backup
echo -e "${YELLOW}Compressing backup...${NC}"
gzip -k "$BACKUP_FILE"
COMPRESSED_SIZE=$(du -h "${BACKUP_FILE}.gz" | cut -f1)
echo -e "${GREEN}✓ Compressed: $COMPRESSED_SIZE${NC}"
echo ""

# Success message
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Backup completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Files created:"
echo -e "  - ${BLUE}${BACKUP_NAME}.sql${NC} ($BACKUP_SIZE)"
echo -e "  - ${BLUE}${BACKUP_NAME}.sql.gz${NC} ($COMPRESSED_SIZE)"
echo -e "  - ${BLUE}${BACKUP_NAME}_INFO.txt${NC}"
echo ""
echo -e "Location: ${BLUE}$BACKUP_DIR${NC}"
echo ""
echo -e "To restore this backup, run:"
echo -e "  ${YELLOW}./scripts/restore-db.sh ${BACKUP_NAME}${NC}"
echo ""
