import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../_lib/firebase';
import { requireAdmin } from '../../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const ref = getDb().collection('products').doc(id);

  if (req.method === 'GET') {
    try {
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ id: snap.id, ...snap.data() });
    } catch (e) {
      console.error('editor/products/[id] GET', e);
      return res.status(500).json({ error: 'Failed to load product' });
    }
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
    try {
      const b = req.body as Record<string, unknown>;
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'Product not found' });
      await ref.update({
        name: (b.name as string)?.trim(),
        slug: (b.slug as string)?.trim(),
        description: (b.description as string)?.trim() ?? '',
        short_description: (b.short_description as string)?.trim() ?? '',
        price_cents: Math.round(Number(b.price_cents) ?? 0),
        compare_at_cents: b.compare_at_cents != null ? Math.round(Number(b.compare_at_cents)) : null,
        cost_cents: b.cost_cents != null ? Math.round(Number(b.cost_cents)) : null,
        sku: (b.sku as string)?.trim() || null,
        image_url: (b.image_url as string)?.trim() || null,
        category_id: (b.category_id as string)?.trim() || null,
        stock_quantity: Math.max(0, Math.floor(Number(b.stock_quantity) ?? 0)),
        track_inventory: b.track_inventory !== false,
        is_active: b.is_active !== false,
        order_num: Math.floor(Number(b.order_num) ?? 0),
        meta_title: (b.meta_title as string)?.trim() || null,
        meta_description: (b.meta_description as string)?.trim() || null,
        updated_at: FieldValue.serverTimestamp(),
      });
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('editor/products/[id] PUT', e);
      return res.status(500).json({ error: 'Failed to update product' });
    }
  }

  if (req.method === 'DELETE') {
    if (!requireAdmin(req, res)) return;
    try {
      const snap = await ref.get();
      if (!snap.exists) return res.status(404).json({ error: 'Product not found' });
      await ref.delete();
      return res.status(200).json({ success: true, deleted: true });
    } catch (e) {
      console.error('editor/products/[id] DELETE', e);
      return res.status(500).json({ error: 'Failed to delete product' });
    }
  }

  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
