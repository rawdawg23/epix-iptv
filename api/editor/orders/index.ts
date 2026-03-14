import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../_lib/firebase';
import { requireAdmin } from '../../_lib/adminAuth';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!requireAdmin(req, res)) return;
  try {
    const db = getDb();
    const statusFilter = (req.query.status as string) || '';
    let q = db.collection('orders').orderBy('created_at', 'desc').limit(500);
    if (statusFilter) {
      q = db.collection('orders').where('status', '==', statusFilter).orderBy('created_at', 'desc').limit(500) as typeof q;
    }
    const snap = await q.get();
    const orders = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        order_number: data.order_number,
        email: data.email,
        status: data.status,
        total_cents: data.total_cents,
        currency: data.currency ?? 'USD',
        created_at: data.created_at?.toMillis?.() ? new Date(data.created_at.toMillis()).toISOString() : data.created_at,
      };
    });
    return res.status(200).json({ orders });
  } catch (e) {
    console.error('editor/orders GET', e);
    return res.status(500).json({ error: 'Failed to load orders' });
  }
}
