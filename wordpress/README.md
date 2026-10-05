# AVICINNA — Headless WordPress Backend & Bridge

This directory contains the isolated WordPress architecture for the **AVICINNA** Medical Tourism platform.

---

## 1. Local Development (Instant Zero-Dependency Mock Server)
To run the local Headless WordPress CMS with REST API, Rank Math SEO mock, and auto-ISR revalidation:

```bash
cd wordpress
node server.js
```
The server will start at:
- **WordPress REST API:** `http://localhost:8080/wp-json/wp/v2/posts`
- **Health Check:** `http://localhost:8080/health`
- **Posts Data:** `wordpress/data/posts.json`

---

## 2. Production VPS / Cloud Deployment
When deploying a real WordPress instance (e.g. Cloudways, Hetzner, DigitalOcean) at `https://cms.yourdomain.com`:

1. Copy the plugin in `plugins/avicinna-headless` into your WordPress installation:
   `wp-content/plugins/avicinna-headless/`
2. Activate the plugin in **wp-admin > Plugins**.
3. Install **Rank Math SEO** for focus keyword and SEO guidance.
4. Set permalinks to **Post name** (`/%postname%/`).
5. Configure the environment variables in Next.js (`.env.local` or Netlify):
   ```env
   NEXT_PUBLIC_WORDPRESS_URL=https://cms.yourdomain.com
   WORDPRESS_URL=https://cms.yourdomain.com
   WORDPRESS_PREVIEW_SECRET=your_strong_secret_token
   ```

---

## 3. How the Bridge Works
1. **Next.js Admin Panel (`/admin/blog`):**
   - Marketers can publish articles directly from Next.js Admin.
   - The article is pushed to the WordPress REST API (`POST /wp-json/wp/v2/posts`).
2. **Instant ISR Revalidation:**
   - When a post is published/updated in WordPress, a webhook triggers `POST /api/revalidate-blog?secret=...` on Next.js.
   - The public `/blog` and `/blog/:slug` pages update instantly.
3. **Draft Previews:**
   - Editors can preview unpublished drafts at `/api/draft?secret=...&slug=...&id=...`.
4. **Canonical SEO Integrity:**
   - Canonical tags strictly point to `https://yourdomain.com/blog/:slug` and never leak `cms.yourdomain.com`.
