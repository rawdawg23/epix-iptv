import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../_lib/firebase';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const db = getDb();
    const category = req.query.category as string;
    let q = db.collection('products').where('is_active', '==', true).orderBy('order_num', 'asc');
    if (category) {
      q = db.collection('products').where('is_active', '==', true).where('category_id', '==', category).orderBy('order_num', 'asc') as typeof q;
    }
    const snap = await q.limit(200).get();
    const products = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name,
        slug: data.slug,
        short_description: data.short_description,
        description: data.description,
        price_cents: data.price_cents,
        compare_at_cents: data.compare_at_cents,
        image_url: data.image_url,
        stock_quantity: data.stock_quantity ?? 0,
        is_active: data.is_active,
        order_num: data.order_num ?? 0,
        created_at: data.created_at?.toMillis?.() ? new Date(data.created_at.toMillis()).toISOString() : data.created_at,
      };
    });
    return res.status(200).json({ products });
  } catch (e) {
    console.error('store/products', e);
    return res.status(500).json({ error: 'Failed to load products' });
  }
}
