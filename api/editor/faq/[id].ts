import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../_lib/firebase';
import { requireAdmin } from '../../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const ref = getDb().collection('editor_faq').doc(id);

  if (req.method === 'GET') {
    try {
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'FAQ not found' });
      return res.status(200).json({ id: snap.id, ...snap.data() });
    } catch (e) {
      console.error('editor/faq/[id] GET', e);
      return res.status(500).json({ error: 'Failed to load FAQ' });
    }
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
    try {
      const b = req.body as Record<string, unknown>;
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'FAQ not found' });
      await ref.update({
        question: (b.question as string)?.trim() ?? '',
        answer: (b.answer as string)?.trim() ?? '',
        category: (b.category as string)?.trim() || null,
        order_num: Number(b.order_num) ?? 0,
        meta_title: (b.meta_title as string)?.trim() || null,
        meta_description: (b.meta_description as string)?.trim() || null,
        updated_at: FieldValue.serverTimestamp(),
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('editor/faq/[id] PUT', e);
      return res.status(500).json({ error: 'Failed to update FAQ' });
    }
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    try {
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'FAQ not found' });
      await ref.delete();
      return res.status(200).json({ success: true, deleted: true });
    } catch (e) {
      console.error('editor/faq/[id] DELETE', e);
      return res.status(500).json({ error: 'Failed to delete FAQ' });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
