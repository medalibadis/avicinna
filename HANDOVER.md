# AVICINNA — Technical Handover, Deployment & Operations Guide

## 1. Source Code & GitHub Ownership Transfer
- **Current Git Remote (`origin`):** `https://github.com/medalibadis/avicinna` (`main` branch, plus `backup/user-side-v1-stable`).
- **Transfer to Avicinna Account (preserving full history):**
  - **Option A (GitHub Ownership Transfer):** Current owner (`medalibadis`) -> Repository *Settings* -> *Danger Zone* -> *Transfer ownership* -> target Avicinna GitHub organization/account.
  - **Option B (Mirror Push):**
    ```bash
    git clone --mirror https://github.com/medalibadis/avicinna.git
    cd avicinna.git
    git remote set-url origin https://github.com/<AVICINNA_ORG>/avicinna.git
    git push --mirror origin
    ```

---

## 2. How Publishing Works (Manual Hostinger Standalone Build + PM2)
There is **no** GitHub Actions auto-deploy configured (`.github/` is absent). Production runs via **Next.js `output: 'standalone'` + PM2 (`ecosystem.config.cjs`)** on Node.js 20 on Hostinger.

### Exact Publish Steps (Zero Data Loss)
1. **Pull latest code** into the application directory on Hostinger (e.g., `/home/<user>/avicinna_app`), **never wiping persistent folders**:
   ```bash
   cd /home/<user>/avicinna_app
   git fetch origin
   git reset --hard origin/main
   # IMPORTANT: never run bare `git clean -fd` without preserving persistent storage and env!
   ```
2. **Install dependencies & build standalone output:**
   ```bash
   npm ci
   npx next typegen && npx tsc --noEmit
   npm run build
   ```
3. **Copy static assets & public directory into `.next/standalone`:**
   ```bash
   mkdir -p .next/standalone/.next
   cp -rf .next/static .next/standalone/.next/static
   cp -rf public .next/standalone/public
   cp -f .env.production .next/standalone/.env.production 2>/dev/null || true
   ```
4. **(If offloading static assets to `public_html`):** sync `.next/static` to `$WEB_ROOT/_next/static/` and `public/*` to `$WEB_ROOT/`. Ensure reverse proxy routes `/api/*` and page routes cleanly to `127.0.0.1:3000`.
5. **Restart PM2 in single-instance `fork` mode (`ecosystem.config.cjs`):**
   ```bash
   ./node_modules/.bin/pm2 reload ecosystem.config.cjs --update-env || ./node_modules/.bin/pm2 start ecosystem.config.cjs
   ./node_modules/.bin/pm2 save
   ```
   > Why `instances: 1` (`fork`)? Local CMS writes (`store.json`), uploaded files, and rate-limit state live on disk/memory unless Supabase + Redis are enabled. Single-instance fork mode prevents concurrent-write race conditions.

---

## 3. Environment Variables Reference
See `.env.example` for the complete template:
- **Required in Production:** `NEXT_PUBLIC_SITE_URL`, `ADMIN_SECRET`, `ADMIN_USER`, `ADMIN_PASSWORD`.
- **Strongly Recommended:** `AVICINNA_DATA_DIR` (absolute path outside `/home/<user>/avicinna_app`, e.g. `/home/<user>/avicinna_persistent_data`, so redeploys never touch `store.json`, `medical-files/`, or `media-uploads/`).
- **Optional (Supabase PostgreSQL & Storage):** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Optional (AI Translation):** `OPENAI_API_KEY` (when omitted, `/api/translate` uses free Google Translate -> MyMemory -> built-in glossary fallback).
- **Optional (Alerts & Analytics — also editable in `/admin/settings`):** `RESEND_API_KEY`, `LEAD_ALERT_EMAIL`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`.
- **Legacy Optional (WordPress Bridge — Not Required):** `WORDPRESS_URL`, `NEXT_PUBLIC_WORDPRESS_URL`, `WORDPRESS_PREVIEW_SECRET`.

---

## 4. Database, Uploaded Files & Access Control
- **CMS Database:** When `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY` are configured, data dual-syncs with Supabase (`supabase/schema.sql`) and images upload to bucket `avicinna-media`. Without Supabase env vars (current local setup), all CMS content, RBAC users, redirects, and inquiries persist atomically in `$AVICINNA_DATA_DIR/store.json`.
- **Public Images (Media Library):** Uploaded via `POST /api/media` (`admin`/`editor` only) -> stored in `$AVICINNA_DATA_DIR/media-uploads/` and served publicly via `/api/media/file/<filename>` (works in both dev and Hostinger standalone builds), or uploaded to Supabase Storage `avicinna-media` when configured.
- **Patients' Medical Reports:** Uploaded via `POST /api/upload` (max 10 MB; PDF/JPG/PNG/WebP) -> stored **outside `public/`** inside `$AVICINNA_DATA_DIR/medical-files/`. Direct public URL access does not exist. Only authenticated staff with role `admin` or `coordinator` can download files via `/api/files/<id>`, and every download is logged in the Activity Log.

---

## 5. Automated Backups & Restore
Use `scripts/backup.sh` via daily cron:
```bash
chmod +x /home/<user>/avicinna_app/scripts/backup.sh
# Add to crontab (`crontab -e`):
0 3 * * * AVICINNA_DATA_DIR=/home/<user>/avicinna_persistent_data /home/<user>/avicinna_app/scripts/backup.sh >> /home/<user>/avicinna_backups/backup.log 2>&1
```
**Manual UI Backups:** `/admin/settings` -> *Database & Sync* -> **Export JSON Backup**; `/admin/inquiries` -> **Export CSV**.

**Restore from Archive:**
```bash
tar -xzf /home/<user>/avicinna_backups/avicinna-backup-YYYY-MM-DD_HH-MM-SS.tar.gz -C /tmp/avicinna_restore
cp -a /tmp/avicinna_restore/data/. /home/<user>/avicinna_persistent_data/
./node_modules/.bin/pm2 restart avicinna-production
```

---

## 6. WordPress Status
The production Next.js site does **not** depend on WordPress (`https://cms.avicinna.com` is offline/unconfigured). Articles are stored, edited via Rich-Text Editor, and served directly inside Next.js. You may safely remove any leftover WordPress installation from Hostinger once verified no custom subdomains/redirects still rely on it, and leave `WORDPRESS_URL` unset in production env.

