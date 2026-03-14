import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, generateId } from '../../_lib/firebase';
import { requireAdmin } from '../../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const snap = await getDb().collection('editor_faq').orderBy('order_num', 'asc').get();
      const faq = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ faq });
    } catch (e) {
      console.error('editor/faq GET', e);
      return res.status(500).json({ error: 'Failed to load FAQ' });
    }
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    try {
      const b = req.body as Record<string, unknown>;
      const id = generateId();
      const now = FieldValue.serverTimestamp();
      await getDb().collection('editor_faq').doc(id).set({
        question: (b.question as string)?.trim() || '',
        answer: (b.answer as string)?.trim() || '',
        category: (b.category as string)?.trim() || null,
        order_num: Number(b.order_num) || 0,
        meta_title: (b.meta_title as string)?.trim() || null,
        meta_description: (b.meta_description as string)?.trim() || null,
        created_at: now,
        updated_at: now,
      });
      return res.status(201).json({ success: true, id });
    } catch (e) {
      console.error('editor/faq POST', e);
      return res.status(500).json({ error: 'Failed to create FAQ' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
