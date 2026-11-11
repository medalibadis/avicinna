import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/serverAuth';
import { appendActivityLog, getMedicalFilesDirectory } from '@/lib/cmsStore';
import { getClientIp } from '@/lib/rateLimit';

const VALID_FILE_ID = /^med-\d+-[a-f0-9]+$/;

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(req, ['admin', 'coordinator']);
  if (!auth.ok) return auth.response;

  const { id } = await context.params;
  if (!VALID_FILE_ID.test(id)) {
    return NextResponse.json({ error: 'Invalid file identifier' }, { status: 400 });
  }

  const filesDir = getMedicalFilesDirectory();
  const metaPath = path.join(filesDir, `${id}.meta.json`);
  if (!fs.existsSync(metaPath)) {
    return NextResponse.json({ error: 'Medical file not found' }, { status: 404 });
  }

  try {
    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8')) as {
      originalName: string;
      mimeType: string;
      size: number;
      ext: string;
    };
    const binPath = path.join(filesDir, `${id}${meta.ext}`);
    if (!fs.existsSync(binPath)) {
      return NextResponse.json({ error: 'Stored file missing on disk' }, { status: 404 });
    }

    const buffer = fs.readFileSync(binPath);

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'medical_file_accessed',
      targetType: 'medical_file',
      targetId: id,
      details: `Accessed patient medical attachment "${meta.originalName}"`,
      ipAddress: getClientIp(req),
    });

    const url = new URL(req.url);
    const inline = url.searchParams.get('inline') === '1';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': meta.mimeType || 'application/octet-stream',
        'Content-Length': String(buffer.length),
        'Content-Disposition': `${inline ? 'inline' : 'attachment'}; filename*=UTF-8''${encodeURIComponent(meta.originalName)}`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  } catch (err) {
    console.error('[api/files/[id] GET]:', err);
    return NextResponse.json({ error: 'Failed to read medical file' }, { status: 500 });
  }
}

