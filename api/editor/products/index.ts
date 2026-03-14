import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, generateId } from '../../_lib/firebase';
import { requireAdmin } from '../../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const snap = await getDb().collection('products').orderBy('order_num', 'asc').orderBy('created_at', 'desc').get();
      const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ products });
    } catch (e) {
      console.error('editor/products GET', e);
      return res.status(500).json({ error: 'Failed to load products' });
    }
  }

  if (req.method === 'POST') {
    if (!requireAdmin(req, res)) return;
    try {
      const b = req.body as Record<string, unknown>;
      const id = generateId();
      const now = FieldValue.serverTimestamp();
      await getDb().collection('products').doc(id).set({
        name: (b.name as string)?.trim() || 'Product',
        slug: (b.slug as string)?.trim() || slugify((b.name as string) || 'product'),
        description: (b.description as string)?.trim() || '',
        short_description: (b.short_description as string)?.trim() || '',
        price_cents: Math.round(Number(b.price_cents) || 0),
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
        created_at: now,
        updated_at: now,
      });
      return res.status(201).json({ success: true, id });
    } catch (e) {
      console.error('editor/products POST', e);
      return res.status(500).json({ error: 'Failed to create product' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
