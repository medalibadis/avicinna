#!/usr/bin/env bash
# ==============================================================================
# AVICINNA Automated Backup Script (Hostinger / Linux VPS Cron)
# Backs up CMS JSON database, patient medical reports, uploaded media, and env.
# Recommended cron (daily at 03:00 AM UTC):
#   0 3 * * * /home/<user>/avicinna_app/scripts/backup.sh >> /home/<user>/avicinna_backups/backup.log 2>&1
# ==============================================================================
set -euo pipefail

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
DATA_DIR="${AVICINNA_DATA_DIR:-$APP_DIR/.avicinna-data}"
BACKUP_ROOT="${BACKUP_ROOT:-$HOME/avicinna_backups}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
STAMP="$(date -u +%Y-%m-%d_%H-%M-%S)"
ARCHIVE="$BACKUP_ROOT/avicinna-backup-$STAMP.tar.gz"

mkdir -p "$BACKUP_ROOT"

STAGING_DIR="$(mktemp -d)"
trap 'rm -rf "$STAGING_DIR"' EXIT

if [ -d "$DATA_DIR" ]; then
  mkdir -p "$STAGING_DIR/data"
  cp -a "$DATA_DIR"/. "$STAGING_DIR/data/"
fi

if [ -d "$APP_DIR/public/uploads" ]; then
  mkdir -p "$STAGING_DIR/public_uploads"
  cp -a "$APP_DIR/public/uploads"/. "$STAGING_DIR/public_uploads/"
fi

for envfile in ".env.local" ".env.production" "ecosystem.config.cjs"; do
  if [ -f "$APP_DIR/$envfile" ]; then
    cp -a "$APP_DIR/$envfile" "$STAGING_DIR/$envfile"
  fi
done

# Optional Supabase PostgreSQL dump when SUPABASE_DB_URL is set
if [ -n "${SUPABASE_DB_URL:-}" ] && command -v pg_dump >/dev/null 2>&1; then
  pg_dump "$SUPABASE_DB_URL" --no-owner --no-acl > "$STAGING_DIR/supabase_dump.sql"
fi

tar -czf "$ARCHIVE" -C "$STAGING_DIR" .
chmod 600 "$ARCHIVE"

# Rotate archives older than RETENTION_DAYS
find "$BACKUP_ROOT" -name "avicinna-backup-*.tar.gz" -type f -mtime +"$RETENTION_DAYS" -delete

echo "[$STAMP] Backup complete: $ARCHIVE ($(du -h "$ARCHIVE" | cut -f1))"

