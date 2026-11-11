import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { getMediaUploadsDirectory } from '@/lib/cmsStore';

const SAFE_FILENAME_RE = /^[a-z0-9._-]+$/i;

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
};

export async function GET(
  _req: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  if (!filename || !SAFE_FILENAME_RE.test(filename) || filename.includes('..')) {
    return NextResponse.json({ error: 'Invalid media filename' }, { status: 400 });
  }

  const persistentPath = path.join(/*turbopackIgnore: true*/ getMediaUploadsDirectory(), filename);
  const legacyPublicPath = path.join(/*turbopackIgnore: true*/ process.cwd(), 'public', 'uploads', 'media', filename);
  const targetPath = fs.existsSync(/*turbopackIgnore: true*/ persistentPath)
    ? persistentPath
    : fs.existsSync(/*turbopackIgnore: true*/ legacyPublicPath)
    ? legacyPublicPath
    : null;

  if (!targetPath) {
    return NextResponse.json({ error: 'Media asset not found' }, { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = MIME_BY_EXT[ext] || 'application/octet-stream';
  const buffer = fs.readFileSync(/*turbopackIgnore: true*/ targetPath);

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
