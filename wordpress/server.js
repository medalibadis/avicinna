const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 8080;
const DATA_FILE = path.join(__dirname, 'data', 'posts.json');
const NEXT_APP_URL = process.env.NEXT_APP_URL || 'http://localhost:3000';
const REVALIDATE_SECRET = process.env.WORDPRESS_PREVIEW_SECRET || 'avicinna_wp_secure_token_change_me';

// Ensure data folder and file exists
if (!fs.existsSync(path.dirname(DATA_FILE))) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, '[]', 'utf8');
}

function readPosts() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading posts:', err);
    return [];
  }
}

function writePosts(posts) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving posts:', err);
    return false;
  }
}

// Trigger ISR revalidation in Next.js
function triggerNextRevalidation(slug) {
  const webhookUrl = `${NEXT_APP_URL}/api/revalidate-blog?secret=${encodeURIComponent(REVALIDATE_SECRET)}`;
  try {
    const parsed = new URL(webhookUrl);
    const postData = JSON.stringify({ slug, timestamp: Date.now() });

    const req = http.request(
      {
        hostname: parsed.hostname,
        port: parsed.port || 3000,
        path: parsed.pathname + parsed.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
        timeout: 3000,
      },
      (res) => {
        console.log(`[WP Bridge] Revalidation triggered for slug "${slug}": status ${res.statusCode}`);
      }
    );

    req.on('error', (e) => {
      // Non-blocking in case Next.js dev server is starting up
      console.log(`[WP Bridge] Revalidation ping deferred (Next.js server unreachable yet)`);
    });

    req.write(postData);
    req.end();
  } catch (err) {
    console.warn('[WP Bridge] Could not ping revalidate endpoint:', err.message);
  }
}

const server = http.createServer((req, res) => {
  // Global CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-WP-Nonce, X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'X-WP-Total, X-WP-TotalPages');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Root or Health
  if (pathname === '/' || pathname === '/health') {
    const posts = readPosts();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(
      JSON.stringify({
        service: 'AVICINNA Headless WordPress CMS (Local Bridge)',
        status: 'online',
        port: PORT,
        totalArticles: posts.length,
        version: '6.4.3-headless-bridge',
        endpoints: [
          '/wp-json/wp/v2/posts',
          '/wp-json/wp/v2/posts/:id',
          '/wp-json/wp/v2/categories',
          '/wp-json/rankmath/v1/meta'
        ]
      })
    );
  }

  // Categories Endpoint
  if (pathname === '/wp-json/wp/v2/categories') {
    const categories = [
      { id: 1, name: 'الأورام والسرطان', slug: 'oncology', count: 2 },
      { id: 2, name: 'جراحة الأعصاب والعمود الفقري', slug: 'neurosurgery', count: 1 },
      { id: 3, name: 'الأمراض القلبية', slug: 'cardiology', count: 1 },
      { id: 4, name: 'السياحة العلاجية', slug: 'medical-tourism', count: 1 },
      { id: 5, name: 'طب الأسنان', slug: 'dentistry', count: 1 },
      { id: 6, name: 'زراعة الأعضاء', slug: 'transplant', count: 1 },
      { id: 7, name: 'التشخيص الطبي', slug: 'diagnostics', count: 1 },
      { id: 8, name: 'العظام والمفاصل', slug: 'orthopedics', count: 0 },
    ];
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(categories));
  }

  // Posts Collection: GET
  if (pathname === '/wp-json/wp/v2/posts' && req.method === 'GET') {
    let posts = readPosts();

    // Filter by slug
    if (query.slug) {
      const single = posts.find((p) => p.slug === query.slug);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify(single ? [single] : []));
    }

    // Filter by search
    if (query.search) {
      const q = String(query.search).toLowerCase();
      posts = posts.filter(
        (p) =>
          (p.title?.rendered && p.title.rendered.toLowerCase().includes(q)) ||
          (p.excerpt?.rendered && p.excerpt.rendered.toLowerCase().includes(q)) ||
          (p.meta?.author_name && p.meta.author_name.toLowerCase().includes(q))
      );
    }

    // Filter by category
    if (query.category_slug && query.category_slug !== 'all') {
      posts = posts.filter((p) => p.meta?.category_slug === query.category_slug);
    }

    const total = posts.length;
    const perPage = parseInt(query.per_page, 10) || 10;
    const page = parseInt(query.page, 10) || 1;
    const totalPages = Math.ceil(total / perPage) || 1;

    const start = (page - 1) * perPage;
    const paginated = posts.slice(start, start + perPage);

    res.setHeader('X-WP-Total', total.toString());
    res.setHeader('X-WP-TotalPages', totalPages.toString());
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(paginated));
  }

  // Single Post by ID: GET /wp-json/wp/v2/posts/:id
  const postMatch = pathname.match(/^\/wp-json\/wp\/v2\/posts\/(\d+)$/);
  if (postMatch && req.method === 'GET') {
    const id = parseInt(postMatch[1], 10);
    const posts = readPosts();
    const found = posts.find((p) => p.id === id);
    if (!found) {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ code: 'rest_post_invalid_id', message: 'Post not found', data: { status: 404 } }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(found));
  }

  // Create Post: POST /wp-json/wp/v2/posts
  if (pathname === '/wp-json/wp/v2/posts' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const posts = readPosts();

        const newId = payload.id ? Number(payload.id) : Date.now();
        const rawSlug = payload.slug || payload.title?.rendered || payload.title || `article-${newId}`;
        const cleanSlug = rawSlug
          .toString()
          .toLowerCase()
          .trim()
          .replace(/[\s\W-]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const titleText = typeof payload.title === 'object' ? payload.title.rendered : payload.title;
        const contentText = typeof payload.content === 'object' ? payload.content.rendered : payload.content;
        const excerptText = typeof payload.excerpt === 'object' ? payload.excerpt.rendered : payload.excerpt;

        const newPost = {
          id: newId,
          date: payload.date || new Date().toISOString(),
          date_gmt: payload.date || new Date().toISOString(),
          modified: new Date().toISOString(),
          slug: cleanSlug,
          status: payload.status || 'publish',
          type: 'post',
          link: `${NEXT_APP_URL}/blog/${cleanSlug}`,
          title: {
            rendered: titleText || 'عنوان المقال الطبي',
          },
          content: {
            rendered: contentText || '',
          },
          excerpt: {
            rendered: excerptText || '',
          },
          featured_media_url:
            payload.featured_media_url ||
            payload.image ||
            'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1200&auto=format&fit=crop',
          categories: payload.categories || [1],
          meta: {
            reading_time: payload.meta?.reading_time || payload.readingTimeMinutes || 5,
            author_name: payload.meta?.author_name || payload.authorName || 'أ. د. سردار تورهال',
            author_role: payload.meta?.author_role || payload.authorRole || 'استشاري طب الأورام',
            hospital_name: payload.meta?.hospital_name || payload.hospitalName || 'مستشفى أجيبادم للأورام التخصصي',
            category_slug: payload.meta?.category_slug || payload.categorySlug || 'oncology',
            category_name: payload.meta?.category_name || payload.categoryName || 'الأورام والسرطان',
          },
          rank_math_seo: {
            title: payload.rank_math_seo?.title || `${titleText} - AVICINNA`,
            description: payload.rank_math_seo?.description || excerptText || '',
            focus_keyword: payload.rank_math_seo?.focus_keyword || titleText || '',
            canonical: `${NEXT_APP_URL}/blog/${cleanSlug}`,
          },
        };

        // Check if updating existing by id or slug
        const existingIdx = posts.findIndex((p) => p.id === newId || p.slug === cleanSlug);
        if (existingIdx !== -1) {
          posts[existingIdx] = { ...posts[existingIdx], ...newPost, modified: new Date().toISOString() };
        } else {
          posts.unshift(newPost);
        }

        writePosts(posts);

        // Trigger ISR revalidation
        triggerNextRevalidation(cleanSlug);

        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(newPost));
      } catch (err) {
        console.error('Error creating post in WP bridge:', err);
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Update Post: PUT /wp-json/wp/v2/posts/:id
  if (postMatch && (req.method === 'PUT' || req.method === 'POST')) {
    const id = parseInt(postMatch[1], 10);
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const posts = readPosts();
        const idx = posts.findIndex((p) => p.id === id);

        if (idx === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ code: 'rest_post_invalid_id', message: 'Post not found' }));
        }

        const existing = posts[idx];
        const updated = {
          ...existing,
          ...payload,
          id,
          modified: new Date().toISOString(),
          title: payload.title?.rendered ? payload.title : (payload.title ? { rendered: payload.title } : existing.title),
          content: payload.content?.rendered ? payload.content : (payload.content ? { rendered: payload.content } : existing.content),
          excerpt: payload.excerpt?.rendered ? payload.excerpt : (payload.excerpt ? { rendered: payload.excerpt } : existing.excerpt),
          meta: { ...existing.meta, ...(payload.meta || {}) },
          rank_math_seo: { ...existing.rank_math_seo, ...(payload.rank_math_seo || {}) },
        };

        posts[idx] = updated;
        writePosts(posts);

        triggerNextRevalidation(updated.slug);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify(updated));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Delete Post: DELETE /wp-json/wp/v2/posts/:id
  if (postMatch && req.method === 'DELETE') {
    const id = parseInt(postMatch[1], 10);
    const posts = readPosts();
    const idx = posts.findIndex((p) => p.id === id);

    if (idx === -1) {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ code: 'rest_post_invalid_id', message: 'Post not found' }));
    }

    const removed = posts.splice(idx, 1)[0];
    writePosts(posts);
    triggerNextRevalidation(removed.slug);

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ deleted: true, previous: removed }));
  }

  // Fallback 404
  res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify({ code: 'rest_no_route', message: 'No route was found matching the URL and request method.' }));
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`[AVICINNA Headless WordPress CMS Server] Running on http://localhost:${PORT}`);
  console.log(`- REST API: http://localhost:${PORT}/wp-json/wp/v2/posts`);
  console.log(`- Revalidation Target: ${NEXT_APP_URL}/api/revalidate-blog`);
  console.log(`====================================================`);
});
