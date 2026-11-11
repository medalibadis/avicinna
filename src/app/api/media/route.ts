import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/serverAuth';
import { appendActivityLog, getMediaUploadsDirectory, readCmsStore, updateCmsStore } from '@/lib/cmsStore';
import { getClientIp } from '@/lib/rateLimit';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { LocalizedString, MediaItem } from '@/types/cms';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_MIME = new Map<string, string>([
  ['image/jpeg', '.jpg'],
  ['image/jpg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
  ['image/avif', '.avif'],
  ['image/svg+xml', '.svg'],
]);

function getPublicUploadDir(): string {
  const dir = path.join(process.cwd(), 'public', 'uploads', 'media');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

export async function GET(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'editor']);
  if (!auth.ok) return auth.response;

  const store = readCmsStore();
  return NextResponse.json({ media: store.media });
}

export async function POST(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'editor']);
  if (!auth.ok) return auth.response;

  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');
      if (!(file instanceof File)) {
        return NextResponse.json({ error: 'Image file is required' }, { status: 400 });
      }

      if (file.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: 'Image file exceeds the 8MB limit' },
          { status: 413 }
        );
      }

      const ext = ALLOWED_IMAGE_MIME.get(file.type);
      if (!ext) {
        return NextResponse.json(
          { error: 'Unsupported image format. Allowed: JPG, PNG, WebP, GIF, AVIF, SVG' },
          { status: 400 }
        );
      }

      const safeBaseName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, '-')
        .replace(/-+/g, '-')
        .slice(0, 60) || 'media-image';
      const diskFilename = `${Date.now()}-${crypto.randomBytes(3).toString('hex')}-${safeBaseName}${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());

      let publicUrl = `/api/media/file/${diskFilename}`;

      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.storage
          .from('avicinna-media')
          .upload(`media/${diskFilename}`, buffer, {
            contentType: file.type,
            cacheControl: '31536000',
            upsert: false,
          });
        if (!error && data) {
          const { data: urlData } = supabase.storage
            .from('avicinna-media')
            .getPublicUrl(data.path);
          if (urlData?.publicUrl) {
            publicUrl = urlData.publicUrl;
          }
        } else {
          fs.writeFileSync(path.join(getMediaUploadsDirectory(), diskFilename), buffer);
        }
      } else {
        fs.writeFileSync(path.join(getMediaUploadsDirectory(), diskFilename), buffer);
      }

      const alt: LocalizedString = {
        ar: String(formData.get('altAr') || safeBaseName),
        en: String(formData.get('altEn') || safeBaseName),
        fr: String(formData.get('altFr') || safeBaseName),
      };

      const caption: LocalizedString = {
        ar: String(formData.get('captionAr') || ''),
        en: String(formData.get('captionEn') || ''),
        fr: String(formData.get('captionFr') || ''),
      };

      const folder = String(formData.get('folder') || 'general').replace(/[^a-z0-9-_]/gi, '-');

      const item: MediaItem = {
        id: `media-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
        url: publicUrl,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        alt,
        caption,
        folder,
        uploadedBy: auth.session.username,
        createdAt: new Date().toISOString(),
      };

      updateCmsStore((state) => ({
        ...state,
        media: [item, ...state.media],
      }));

      appendActivityLog({
        actorId: auth.session.userId,
        actorUsername: auth.session.username,
        actorRole: auth.session.role,
        action: 'media_uploaded',
        targetType: 'media',
        targetId: item.id,
        details: `Uploaded media "${item.filename}" (${Math.round(item.size / 1024)} KB) into /${item.folder}`,
        ipAddress: getClientIp(req),
      });

      return NextResponse.json({ success: true, item }, { status: 201 });
    }

    // JSON registration (e.g. external image URL with multilingual alt text)
    const body = await req.json();
    const { url, filename, alt, caption, folder } = body as Partial<MediaItem>;

    if (!url?.trim()) {
      return NextResponse.json({ error: 'Media URL is required' }, { status: 400 });
    }

    const item: MediaItem = {
      id: `media-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      url: url.trim(),
      filename: filename?.trim() || url.split('/').pop() || 'external-media',
      mimeType: 'image/external',
      size: 0,
      alt: {
        ar: alt?.ar || '',
        en: alt?.en || '',
        fr: alt?.fr || '',
      },
      caption: caption || { ar: '', en: '', fr: '' },
      folder: folder || 'general',
      uploadedBy: auth.session.username,
      createdAt: new Date().toISOString(),
    };

    updateCmsStore((state) => ({
      ...state,
      media: [item, ...state.media],
    }));

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'media_registered',
      targetType: 'media',
      targetId: item.id,
      details: `Registered media "${item.filename}"`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (err) {
    console.error('[api/media POST]:', err);
    return NextResponse.json({ error: 'Failed to process media upload' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'editor']);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { id, alt, caption, folder } = body as Partial<MediaItem>;
    if (!id) {
      return NextResponse.json({ error: 'Media item ID is required' }, { status: 400 });
    }

    const store = readCmsStore();
    const existing = store.media.find((m) => m.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    const updated: MediaItem = {
      ...existing,
      alt: alt ? { ...existing.alt, ...alt } : existing.alt,
      caption: caption ? { ...existing.caption, ...caption } : existing.caption,
      folder: folder || existing.folder,
    };

    updateCmsStore((state) => ({
      ...state,
      media: state.media.map((m) => (m.id === id ? updated : m)),
    }));

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'media_updated',
      targetType: 'media',
      targetId: id,
      details: `Updated alt text / metadata for media "${updated.filename}"`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    console.error('[api/media PATCH]:', err);
    return NextResponse.json({ error: 'Failed to update media item' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireApiAuth(req, ['admin', 'editor']);
  if (!auth.ok) return auth.response;

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Media item ID is required' }, { status: 400 });
    }

    const existing = readCmsStore().media.find((m) => m.id === id);
    if (!existing) {
      return NextResponse.json({ error: 'Media item not found' }, { status: 404 });
    }

    if (existing.url.startsWith('/uploads/media/') || existing.url.startsWith('/api/media/file/')) {
      const safeRel = path.basename(existing.url);
      const persistentPath = path.join(getMediaUploadsDirectory(), safeRel);
      const legacyPublicPath = path.join(getPublicUploadDir(), safeRel);
      if (fs.existsSync(persistentPath)) {
        fs.unlinkSync(persistentPath);
      }
      if (fs.existsSync(legacyPublicPath)) {
        fs.unlinkSync(legacyPublicPath);
      }
    }

    updateCmsStore((state) => ({
      ...state,
      media: state.media.filter((m) => m.id !== id),
    }));

    appendActivityLog({
      actorId: auth.session.userId,
      actorUsername: auth.session.username,
      actorRole: auth.session.role,
      action: 'media_deleted',
      targetType: 'media',
      targetId: id,
      details: `Deleted media item "${existing.filename}"`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[api/media DELETE]:', err);
    return NextResponse.json({ error: 'Failed to delete media item' }, { status: 500 });
  }
}

