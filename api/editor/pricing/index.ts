import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, generateId } from '../../_lib/firebase';
import { requireAdmin } from '../../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const snap = await getDb().collection('editor_pricing').orderBy('order_num', 'asc').get();
      const plans = snap.docs.map((d) => {
        const r = d.data();
        return { id: d.id, ...r, features: Array.isArray(r.features) ? r.features : [] };
      });
      return res.status(200).json({ plans });
    } catch (e) {
      console.error('editor/pricing GET', e);
      return res.status(500).json({ error: 'Failed to load pricing' });
    }
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    try {
      const b = req.body as Record<string, unknown>;
      const id = generateId();
      const now = FieldValue.serverTimestamp();
      await getDb().collection('editor_pricing').doc(id).set({
        name: (b.name as string)?.trim() || 'Plan',
        price: Number(b.price) || 0,
        currency: (b.currency as string)?.trim() || 'USD',
        billing_period: (b.billing_period as string)?.trim() || 'monthly',
        description: (b.description as string)?.trim() || '',
        features: Array.isArray(b.features) ? b.features : [],
        is_featured: Boolean(b.is_featured),
        cta_text: (b.cta_text as string)?.trim() || 'Subscribe Now',
        order_num: Number(b.order_num) || 0,
        meta_title: (b.meta_title as string)?.trim() || null,
        meta_description: (b.meta_description as string)?.trim() || null,
        created_at: now,
        updated_at: now,
      });
      return res.status(201).json({ success: true, id });
    } catch (e) {
      console.error('editor/pricing POST', e);
      return res.status(500).json({ error: 'Failed to create plan' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
