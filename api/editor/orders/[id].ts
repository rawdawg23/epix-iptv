import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../_lib/firebase';
import { requireAdmin } from '../../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

const VALID_STATUSES = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  if (!requireAdmin(req, res)) return;

  const db = getDb();
  const ref = db.collection('orders').doc(id);

  if (req.method === 'GET') {
    try {
      const orderSnap = await ref.get();
      if (!orderSnap.exists) return res.status(404).json({ error: 'Order not found' });
      const orderData = orderSnap.data()!;
      const itemsSnap = await ref.collection('items').orderBy('created_at', 'asc').get();
      const items = itemsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      const order = {
        id: orderSnap.id,
        ...orderData,
        created_at: orderData.created_at?.toMillis?.() ? new Date(orderData.created_at.toMillis()).toISOString() : orderData.created_at,
        updated_at: orderData.updated_at?.toMillis?.() ? new Date(orderData.updated_at.toMillis()).toISOString() : orderData.updated_at,
      };
      return res.status(200).json({ order, items });
    } catch (e) {
      console.error('editor/orders/[id] GET', e);
      return res.status(500).json({ error: 'Failed to load order' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const b = req.body as { status?: string };
      const status = b.status?.trim();
      if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: `status must be one of: ${VALID_STATUSES.join(', ')}` });
      }
      const orderSnap = await ref.get();
      if (!orderSnap.exists) return res.status(404).json({ error: 'Order not found' });
      const update: Record<string, unknown> = { status, updated_at: FieldValue.serverTimestamp() };
      if (status === 'shipped' || status === 'delivered') {
        update.shipped_at = orderSnap.data()?.shipped_at ?? FieldValue.serverTimestamp();
      }
      if (status === 'paid') {
        update.paid_at = orderSnap.data()?.paid_at ?? FieldValue.serverTimestamp();
      }
      await ref.update(update);
      return res.status(200).json({ success: true, status });
    } catch (e) {
      console.error('editor/orders/[id] PATCH', e);
      return res.status(500).json({ error: 'Failed to update order' });
    }
  }

  res.setHeader('Allow', 'GET, PATCH');
  return res.status(405).json({ error: 'Method not allowed' });
}
