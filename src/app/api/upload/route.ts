import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { getMedicalFilesDirectory } from '@/lib/cmsStore';
import { getClientIp } from '@/lib/rateLimit';

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per medical report / imaging file
const ALLOWED_TYPES = new Map<string, string>([
  ['application/pdf', '.pdf'],
  ['image/jpeg', '.jpg'],
  ['image/jpg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
]);

const uploadWindow = new Map<string, { count: number; resetAt: number }>();

function allowUpload(ip: string): boolean {
  const now = Date.now();
  const rec = uploadWindow.get(ip);
  if (!rec || now > rec.resetAt) {
    uploadWindow.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return true;
  }
  if (rec.count >= 25) return false;
  rec.count += 1;
  return true;
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req);
    if (!allowUpload(ip)) {
      return NextResponse.json(
        { error: 'Too many file uploads from this network. Please retry in a few minutes.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No medical file provided' }, { status: 400 });
    }

    if (file.size === 0 || file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: 'Medical file must be between 1 byte and 10 MB' },
        { status: 413 }
      );
    }

    const ext = ALLOWED_TYPES.get(file.type);
    if (!ext) {
      return NextResponse.json(
        { error: 'Only PDF, JPG, PNG, and WebP medical reports or scans are permitted' },
        { status: 400 }
      );
    }

    const fileId = `med-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const filesDir = getMedicalFilesDirectory();
    const safeFilename = file.name.replace(/[^\w.\-\u0600-\u06FF ]/g, '_').slice(0, 150) || `report${ext}`;

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(filesDir, `${fileId}${ext}`), buffer);
    fs.writeFileSync(
      path.join(filesDir, `${fileId}.meta.json`),
      JSON.stringify({
        id: fileId,
        originalName: safeFilename,
        mimeType: file.type,
        size: file.size,
        ext,
        uploadedAt: new Date().toISOString(),
      }),
      'utf8'
    );

    return NextResponse.json(
      {
        success: true,
        attachment: {
          id: fileId,
          name: safeFilename,
          url: `/api/files/${fileId}`,
          mimeType: file.type,
          size: file.size,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[api/upload POST]:', err);
    return NextResponse.json({ error: 'Failed to store medical file securely' }, { status: 500 });
  }
}

