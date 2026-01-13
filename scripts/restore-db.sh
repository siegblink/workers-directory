#!/bin/bash

# Database Restore Script
# Usage: ./scripts/restore-db.sh [backup_name]
# If no backup_name is provided, restores the latest backup

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
echo -e "${BLUE}   Database Restore Tool${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}Error: Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# Determine which backup to restore
if [ -z "$1" ]; then
    # No argument provided - find the latest backup
    echo -e "${YELLOW}No backup name provided. Finding latest backup...${NC}"
    LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/*.sql 2>/dev/null | grep -v ".gz" | head -1)

    if [ -z "$LATEST_BACKUP" ]; then
        echo -e "${RED}Error: No backup files found in $BACKUP_DIR${NC}"
        exit 1
    fi

    BACKUP_FILE="$LATEST_BACKUP"
    BACKUP_NAME=$(basename "$BACKUP_FILE")
else
    # Argument provided - use specified backup
    BACKUP_NAME="$1"

    # Add .sql extension if not provided
    if [[ ! "$BACKUP_NAME" =~ \.sql$ ]]; then
        BACKUP_NAME="${BACKUP_NAME}.sql"
    fi

    BACKUP_FILE="$BACKUP_DIR/$BACKUP_NAME"

    # Check if backup file exists
    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
        echo -e "${YELLOW}Available backups:${NC}"
        ls -lh "$BACKUP_DIR"/*.sql 2>/dev/null | grep -v ".gz" | awk '{print "  - " $9}' | xargs -n1 basename
        exit 1
    fi
fi

# Get backup file size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo -e "${GREEN}✓ Found backup: $BACKUP_NAME ($BACKUP_SIZE)${NC}"
echo ""

# Check if Docker container is running
if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${RED}Error: Supabase database container is not running${NC}"
    echo -e "${YELLOW}Please start Supabase first with: bunx supabase start${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Docker container is running${NC}"
echo ""

# Confirm before proceeding
echo -e "${YELLOW}⚠️  WARNING: This will replace all data in the local database!${NC}"
echo -e "Backup to restore: ${BLUE}$BACKUP_NAME${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
    echo -e "${YELLOW}Restore cancelled.${NC}"
    exit 0
fi

# Start restore process
echo -e "${BLUE}Starting database restore...${NC}"
echo ""

# Reset database first
echo -e "${YELLOW}Step 1/3: Resetting database...${NC}"
cd "$PROJECT_DIR"
bunx supabase db reset --no-seed > /dev/null 2>&1
echo -e "${GREEN}✓ Database reset complete${NC}"
echo ""

# Import backup
echo -e "${YELLOW}Step 2/3: Importing backup...${NC}"
cat "$BACKUP_FILE" | docker exec -i "$CONTAINER_NAME" psql -U postgres -d postgres 2>&1 | \
    grep -v "ERROR:" | \
    grep -v "NOTICE:" | \
    tail -5

echo -e "${GREEN}✓ Backup imported${NC}"
echo ""

# Verify restore
echo -e "${YELLOW}Step 3/3: Verifying restore...${NC}"
USER_COUNT=$(docker exec "$CONTAINER_NAME" psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM users;" | xargs)
WORKER_COUNT=$(docker exec "$CONTAINER_NAME" psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM workers;" | xargs)

echo -e "${GREEN}✓ Database verification:${NC}"
echo -e "  - Users: ${BLUE}$USER_COUNT${NC}"
echo -e "  - Workers: ${BLUE}$WORKER_COUNT${NC}"
echo ""

# Success message
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Database restore completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Restored from: ${BLUE}$BACKUP_NAME${NC}"
echo -e "Total users: ${BLUE}$USER_COUNT${NC}"
echo -e "Total workers: ${BLUE}$WORKER_COUNT${NC}"
echo ""
