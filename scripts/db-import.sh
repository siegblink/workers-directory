#!/bin/bash

# Unified Database Import Script
# Usage:
#   ./scripts/db-import.sh [backup_name]           # Import to local (default)
#   ./scripts/db-import.sh [backup_name] --prod    # Import to production
# If no backup_name is provided, imports the latest backup from the target environment

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Parse arguments
IS_PROD=false
BACKUP_NAME=""

for arg in "$@"; do
    case $arg in
        --prod|--production)
            IS_PROD=true
            ;;
        *)
            if [ -z "$BACKUP_NAME" ]; then
                BACKUP_NAME="$arg"
            fi
            ;;
    esac
done

# Set environment-specific variables
BACKUP_DIR="$PROJECT_DIR/backups/db_dumps"
CONTAINER_NAME="supabase_db_workers-directory"

if [ "$IS_PROD" = true ]; then
    ENV_NAME="PRODUCTION"
    ENV_COLOR="$MAGENTA"
else
    ENV_NAME="LOCAL"
    ENV_COLOR="$BLUE"
fi

echo -e "${ENV_COLOR}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${ENV_COLOR}   ${ENV_NAME} Database Import Tool${NC}"
echo -e "${ENV_COLOR}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}Error: Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# Determine which backup to import
if [ -z "$BACKUP_NAME" ]; then
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
    # Add .sql extension if not provided
    if [[ ! "$BACKUP_NAME" =~ \.sql$ ]]; then
        BACKUP_NAME="${BACKUP_NAME}.sql"
    fi

    # Look for backup in the directory
    BACKUP_FILE="$BACKUP_DIR/$BACKUP_NAME"

    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}Error: Backup file not found: $BACKUP_NAME${NC}"
        echo -e "${YELLOW}Available backups:${NC}"
        ls -lh "$BACKUP_DIR"/*.sql 2>/dev/null | grep -v ".gz" | awk '{print "  - " $9}' | xargs -n1 basename || echo "  (none)"
        exit 1
    fi
fi

# Get backup file size
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)

echo -e "${GREEN}✓ Found backup: $(basename "$BACKUP_FILE") ($BACKUP_SIZE)${NC}"
echo ""

if [ "$IS_PROD" = true ]; then
    # PRODUCTION IMPORT

    # Check if PostgreSQL client tools are installed
    if ! command -v psql &> /dev/null; then
        echo -e "${RED}Error: PostgreSQL client tools (psql) are not installed${NC}"
        echo -e "${YELLOW}Install them with:${NC}"
        echo -e "${YELLOW}  macOS:   ${NC}brew install postgresql"
        echo -e "${YELLOW}  Ubuntu:  ${NC}sudo apt-get install postgresql-client"
        echo -e "${YELLOW}  Windows: ${NC}Download from https://www.postgresql.org/download/"
        exit 1
    fi

    echo -e "${GREEN}✓ PostgreSQL client tools found${NC}"

    # Check if .env.local exists and has production credentials
    if [ ! -f "$PROJECT_DIR/.env.local" ]; then
        echo -e "${RED}Error: .env.local not found${NC}"
        exit 1
    fi

    # Get production database URL (use sed to handle = in the URL)
    PROD_DB_URL=$(grep "^POSTGRES_URL_NON_POOLING" "$PROJECT_DIR/.env.local" | sed 's/^POSTGRES_URL_NON_POOLING=//' | tr -d '"')

    if [ -z "$PROD_DB_URL" ]; then
        echo -e "${RED}Error: Production database URL not found in .env.local${NC}"
        echo -e "${YELLOW}Make sure POSTGRES_URL_NON_POOLING is set in .env.local${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Production credentials found${NC}"
    echo ""

    # EXTREME SAFETY WARNING
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}   ⚠️  CRITICAL WARNING ⚠️${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}You are about to REPLACE the PRODUCTION database!${NC}"
    echo -e "${RED}This will PERMANENTLY DELETE all current production data!${NC}"
    echo ""
    echo -e "${YELLOW}Actions you should take BEFORE proceeding:${NC}"
    echo -e "  1. Create a backup of current production state"
    echo -e "  2. Notify your team"
    echo -e "  3. Put application in maintenance mode"
    echo -e "  4. Verify this is the correct backup"
    echo ""
    echo -e "Backup to import: ${BLUE}$(basename "$BACKUP_FILE")${NC}"
    echo -e "Target: ${MAGENTA}PRODUCTION DATABASE${NC}"
    echo ""
    read -p "Type 'IMPORT PRODUCTION' to continue: " -r
    echo ""

    if [[ ! $REPLY == "IMPORT PRODUCTION" ]]; then
        echo -e "${YELLOW}Import cancelled. (You typed: '$REPLY')${NC}"
        exit 0
    fi

    echo -e "${YELLOW}Final confirmation...${NC}"
    read -p "Are you absolutely sure? (yes/no): " -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${YELLOW}Import cancelled.${NC}"
        exit 0
    fi

    # Import to production
    echo -e "${BLUE}Starting production import...${NC}"
    echo ""

    echo -e "${YELLOW}Step 1/2: Dropping existing data...${NC}"
    # This is dangerous - drops all data!
    psql "$PROD_DB_URL" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" 2>&1 | tail -5
    echo -e "${GREEN}✓ Schema reset${NC}"
    echo ""

    echo -e "${YELLOW}Step 2/2: Importing backup...${NC}"
    psql "$PROD_DB_URL" < "$BACKUP_FILE" 2>&1 | grep -v "ERROR:" | grep -v "NOTICE:" | tail -5
    echo -e "${GREEN}✓ Backup imported${NC}"
    echo ""

    # Verify import
    echo -e "${YELLOW}Verifying import...${NC}"
    USER_COUNT=$(psql "$PROD_DB_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs || echo "N/A")
    WORKER_COUNT=$(psql "$PROD_DB_URL" -t -c "SELECT COUNT(*) FROM workers;" 2>/dev/null | xargs || echo "N/A")

    echo -e "${GREEN}✓ Production database verification:${NC}"
    echo -e "  - Users: ${BLUE}$USER_COUNT${NC}"
    echo -e "  - Workers: ${BLUE}$WORKER_COUNT${NC}"
    echo ""

else
    # LOCAL IMPORT

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
    echo -e "Backup to import: ${BLUE}$(basename "$BACKUP_FILE")${NC}"
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${YELLOW}Import cancelled.${NC}"
        exit 0
    fi

    # Start import process
    echo -e "${BLUE}Starting database import...${NC}"
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

    # Verify import
    echo -e "${YELLOW}Step 3/3: Verifying import...${NC}"
    USER_COUNT=$(docker exec "$CONTAINER_NAME" psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM users;" | xargs)
    WORKER_COUNT=$(docker exec "$CONTAINER_NAME" psql -U postgres -d postgres -t -c "SELECT COUNT(*) FROM workers;" | xargs)

    echo -e "${GREEN}✓ Database verification:${NC}"
    echo -e "  - Users: ${BLUE}$USER_COUNT${NC}"
    echo -e "  - Workers: ${BLUE}$WORKER_COUNT${NC}"
    echo ""

fi

# Success message
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ ${ENV_NAME} database import completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Imported from: ${BLUE}$(basename "$BACKUP_FILE")${NC}"
echo -e "Total users: ${BLUE}$USER_COUNT${NC}"
echo -e "Total workers: ${BLUE}$WORKER_COUNT${NC}"
echo ""

if [ "$IS_PROD" = true ]; then
    echo -e "${YELLOW}⚠️  POST-IMPORT CHECKLIST:${NC}"
    echo -e "  [ ] Verify application functionality"
    echo -e "  [ ] Check critical data integrity"
    echo -e "  [ ] Monitor for errors"
    echo -e "  [ ] Remove maintenance mode"
    echo -e "  [ ] Notify team of completion"
    echo ""
fi
