#!/bin/bash

# Unified Database Backup Script
# Usage:
#   ./scripts/db-backup.sh [backup_name]           # Local (default)
#   ./scripts/db-backup.sh [backup_name] --prod    # Production

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
echo -e "${ENV_COLOR}   ${ENV_NAME} Database Backup Tool${NC}"
echo -e "${ENV_COLOR}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Generate backup filename
if [ -z "$BACKUP_NAME" ]; then
    # No argument - use timestamp
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_NAME="backup_${TIMESTAMP}"
else
    # Use provided name
    BACKUP_NAME="${BACKUP_NAME}"
fi

# Remove .sql extension if provided (we'll add it)
BACKUP_NAME="${BACKUP_NAME%.sql}"

BACKUP_FILE="$BACKUP_DIR/${BACKUP_NAME}.sql"
INFO_FILE="$BACKUP_DIR/${BACKUP_NAME}_INFO.txt"

echo -e "${YELLOW}Environment: ${ENV_COLOR}${ENV_NAME}${NC}"
echo -e "${YELLOW}Creating backup: ${BLUE}${BACKUP_NAME}.sql${NC}"
echo ""

if [ "$IS_PROD" = true ]; then
    # PRODUCTION BACKUP

    # Check if PostgreSQL client tools are installed
    if ! command -v pg_dump &> /dev/null; then
        echo -e "${RED}Error: PostgreSQL client tools (pg_dump) are not installed${NC}"
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

    # Extract project info from URL
    PROJECT_REF=$(echo "$PROD_DB_URL" | grep -oP 'postgres\.giepserxlrweienyqgwu' | cut -d'.' -f2 || echo "unknown")

    echo -e "${GREEN}✓ Production credentials found${NC}"
    echo ""

    # SAFETY WARNING
    echo -e "${RED}⚠️  WARNING: PRODUCTION DATABASE BACKUP${NC}"
    echo -e "${YELLOW}This will create a backup of your PRODUCTION database.${NC}"
    echo -e "${YELLOW}Make sure you're connected to the correct project!${NC}"
    echo ""
    read -p "Continue with production backup? (yes/no): " -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        echo -e "${YELLOW}Backup cancelled.${NC}"
        exit 0
    fi

    # Create backup using pg_dump directly
    echo -e "${YELLOW}Creating production backup...${NC}"

    # Extract connection details from URL
    pg_dump "$PROD_DB_URL" --no-owner --no-acl > "$BACKUP_FILE" 2>&1

    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "${GREEN}✓ Backup created: $BACKUP_SIZE${NC}"
    echo ""

    # Get database stats
    USER_COUNT=$(psql "$PROD_DB_URL" -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null | xargs || echo "N/A")
    WORKER_COUNT=$(psql "$PROD_DB_URL" -t -c "SELECT COUNT(*) FROM workers;" 2>/dev/null | xargs || echo "N/A")

    # Create info file
    cat > "$INFO_FILE" << EOF
Production Database Backup Information
Generated: $(date)
Environment: PRODUCTION
File: ${BACKUP_NAME}.sql
Size: $BACKUP_SIZE

Database Statistics:
- Total Users: $USER_COUNT
- Total Workers: $WORKER_COUNT

⚠️  IMPORTANT SECURITY NOTES:
- This is a PRODUCTION database backup
- Contains real user data and PII
- Should be stored securely and encrypted
- DO NOT commit to git
- DO NOT share publicly
- Follow data retention policies

To import this backup to LOCAL:
  ./scripts/db-import.sh ${BACKUP_NAME}

To import to PRODUCTION (DANGEROUS):
  ./scripts/db-import.sh ${BACKUP_NAME} --prod
EOF

else
    # LOCAL BACKUP

    # Check if Docker container is running
    if ! docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
        echo -e "${RED}Error: Supabase database container is not running${NC}"
        echo -e "${YELLOW}Please start Supabase first with: bunx supabase start${NC}"
        exit 1
    fi

    echo -e "${GREEN}✓ Docker container is running${NC}"
    echo ""

    # Create backup
    echo -e "${YELLOW}Creating local database backup...${NC}"
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
Local Database Backup Information
Generated: $(date)
Database: postgres
Container: $CONTAINER_NAME
Environment: LOCAL
File: ${BACKUP_NAME}.sql
Size: $BACKUP_SIZE

Database Statistics:
- Total Users: $USER_COUNT
- Total Workers: $WORKER_COUNT

To import this backup:
  ./scripts/db-import.sh ${BACKUP_NAME}
EOF

fi

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
echo -e "${GREEN}✓ ${ENV_NAME} backup completed successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Files created:"
echo -e "  - ${BLUE}${BACKUP_NAME}.sql${NC} ($BACKUP_SIZE)"
echo -e "  - ${BLUE}${BACKUP_NAME}.sql.gz${NC} ($COMPRESSED_SIZE)"
echo -e "  - ${BLUE}${BACKUP_NAME}_INFO.txt${NC}"
echo ""
echo -e "Location: ${BLUE}$BACKUP_DIR${NC}"
echo ""

if [ "$IS_PROD" = true ]; then
    echo -e "${YELLOW}⚠️  SECURITY REMINDER:${NC}"
    echo -e "  - This backup contains production data"
    echo -e "  - Store it securely and encrypt it"
    echo -e "  - Do NOT commit to git"
    echo -e "  - Follow your data retention policies"
    echo ""
fi

echo -e "To import this backup:"
if [ "$IS_PROD" = true ]; then
    echo -e "  ${YELLOW}To local:  ${NC}./scripts/db-import.sh ${BACKUP_NAME}"
    echo -e "  ${RED}To prod:   ${NC}./scripts/db-import.sh ${BACKUP_NAME} --prod ${RED}(DANGEROUS!)${NC}"
else
    echo -e "  ${YELLOW}To local:  ${NC}./scripts/db-import.sh ${BACKUP_NAME}"
    echo -e "  ${RED}To prod:   ${NC}./scripts/db-import.sh ${BACKUP_NAME} --prod ${RED}(DANGEROUS!)${NC}"
fi
echo ""
