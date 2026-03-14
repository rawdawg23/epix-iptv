import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../_lib/firebase';
import { requireAdmin } from '../../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

function toDate(v: unknown): string | undefined {
  if (v && typeof v === 'object' && 'toMillis' in v && typeof (v as { toMillis: () => number }).toMillis === 'function') {
    return new Date((v as { toMillis: () => number }).toMillis()).toISOString();
  }
  return typeof v === 'string' ? v : undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  const db = getDb();
  const ref = db.collection('editor_pages').doc(id);

  if (req.method === 'GET') {
    try {
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'Page not found' });
      const data = snap.data()!;
      return res.status(200).json({
        id: snap.id,
        slug: data.slug,
        title: data.title,
        description: data.description,
        body_md: data.body_md,
        meta_title: data.meta_title ?? null,
        meta_description: data.meta_description ?? null,
        focus_keyword: data.focus_keyword ?? null,
        order_num: data.order_num ?? 0,
        created_at: toDate(data.created_at),
        updated_at: toDate(data.updated_at),
      });
    } catch (e) {
      console.error('editor/pages/[id] GET', e);
      return res.status(500).json({ error: 'Failed to load page' });
    }
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
    try {
      const b = req.body as Record<string, unknown>;
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'Page not found' });
      await ref.update({
        slug: (b.slug as string)?.trim(),
        title: (b.title as string)?.trim(),
        description: (b.description as string)?.trim() ?? '',
        body_md: (b.body_md as string)?.trim() ?? '',
        meta_title: (b.meta_title as string)?.trim() || null,
        meta_description: (b.meta_description as string)?.trim() || null,
        focus_keyword: (b.focus_keyword as string)?.trim() || null,
        order_num: Number(b.order_num) ?? 0,
        updated_at: FieldValue.serverTimestamp(),
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('editor/pages/[id] PUT', e);
      return res.status(500).json({ error: 'Failed to update page' });
    }
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    try {
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'Page not found' });
      await ref.delete();
      return res.status(200).json({ success: true, deleted: true });
    } catch (e) {
      console.error('editor/pages/[id] DELETE', e);
      return res.status(500).json({ error: 'Failed to delete page' });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
