import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../_lib/firebase';
import { requireAdmin } from '../../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const ref = getDb().collection('editor_pricing').doc(id);

  if (req.method === 'GET') {
    try {
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'Plan not found' });
      const r = snap.data()!;
      return res.status(200).json({ id: snap.id, ...r, features: Array.isArray(r.features) ? r.features : [] });
    } catch (e) {
      console.error('editor/pricing/[id] GET', e);
      return res.status(500).json({ error: 'Failed to load plan' });
    }
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
    try {
      const b = req.body as Record<string, unknown>;
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'Plan not found' });
      await ref.update({
        name: (b.name as string)?.trim(),
        price: Number(b.price),
        currency: (b.currency as string)?.trim() ?? 'USD',
        billing_period: (b.billing_period as string)?.trim() ?? 'monthly',
        description: (b.description as string)?.trim() ?? '',
        features: Array.isArray(b.features) ? b.features : [],
        is_featured: Boolean(b.is_featured),
        cta_text: (b.cta_text as string)?.trim() ?? 'Subscribe Now',
        order_num: Number(b.order_num) ?? 0,
        meta_title: (b.meta_title as string)?.trim() || null,
        meta_description: (b.meta_description as string)?.trim() || null,
        updated_at: FieldValue.serverTimestamp(),
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('editor/pricing/[id] PUT', e);
      return res.status(500).json({ error: 'Failed to update plan' });
    }
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    try {
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'Plan not found' });
      await ref.delete();
      return res.status(200).json({ success: true, deleted: true });
    } catch (e) {
      console.error('editor/pricing/[id] DELETE', e);
      return res.status(500).json({ error: 'Failed to delete plan' });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
