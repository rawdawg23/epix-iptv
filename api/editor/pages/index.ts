import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, generateId } from '../_lib/firebase';
import { requireAdmin } from '../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

function toDate(v: unknown): string | undefined {
  if (v && typeof v === 'object' && 'toMillis' in v && typeof (v as { toMillis: () => number }).toMillis === 'function') {
    return new Date((v as { toMillis: () => number }).toMillis()).toISOString();
  }
  return typeof v === 'string' ? v : undefined;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const db = getDb();
      const snap = await db.collection('editor_pages').orderBy('order_num', 'asc').orderBy('created_at', 'asc').get();
      const pages = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
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
        };
      });
      return res.status(200).json({ pages });
    } catch (e) {
      console.error('editor/pages GET', e);
      return res.status(500).json({ error: 'Failed to load pages' });
    }
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    try {
      const b = req.body as Record<string, unknown>;
      const id = generateId();
      const now = FieldValue.serverTimestamp();
      await getDb().collection('editor_pages').doc(id).set({
        slug: (b.slug as string)?.trim() || 'page',
        title: (b.title as string)?.trim() || 'Untitled',
        description: (b.description as string)?.trim() || '',
        body_md: (b.body_md as string)?.trim() || '',
        meta_title: (b.meta_title as string)?.trim() || null,
        meta_description: (b.meta_description as string)?.trim() || null,
        focus_keyword: (b.focus_keyword as string)?.trim() || null,
        order_num: Number(b.order_num) || 0,
        created_at: now,
        updated_at: now,
      });
      return res.status(201).json({ success: true, id });
    } catch (e) {
      console.error('editor/pages POST', e);
      return res.status(500).json({ error: 'Failed to create page' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
