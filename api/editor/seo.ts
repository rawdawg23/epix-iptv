import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/firebase';
import { requireAdmin } from '../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const db = getDb();
      const snap = await db.collection('editor_seo').doc('global').get();
      const r = snap.exists ? snap.data() ?? {} : {};
      return res.status(200).json({
        default_meta_title: r.default_meta_title ?? '',
        default_meta_description: r.default_meta_description ?? '',
        default_focus_keyword: r.default_focus_keyword ?? '',
        og_image_url: r.og_image_url ?? '',
        twitter_handle: r.twitter_handle ?? '',
      });
    } catch (e) {
      console.error('editor/seo GET', e);
      return res.status(500).json({ error: 'Failed to load SEO settings' });
    }
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
    try {
      const b = (req.body || {}) as Record<string, string>;
      const db = getDb();
      await db.collection('editor_seo').doc('global').set(
        {
          default_meta_title: b.default_meta_title ?? '',
          default_meta_description: b.default_meta_description ?? '',
          default_focus_keyword: b.default_focus_keyword ?? '',
          og_image_url: b.og_image_url ?? '',
          twitter_handle: b.twitter_handle ?? '',
          updated_at: FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('editor/seo PUT', e);
      return res.status(500).json({ error: 'Failed to save SEO settings' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
}
