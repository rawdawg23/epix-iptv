import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../_lib/firebase';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const slug = req.query.slug as string;
  if (!slug) return res.status(400).json({ error: 'Missing slug' });
  try {
    const snap = await getDb().collection('products').where('slug', '==', slug).where('is_active', '==', true).limit(1).get();
    if (snap.empty) return res.status(404).json({ error: 'Product not found' });
    const d = snap.docs[0];
    const data = d.data();
    return res.status(200).json({
      id: d.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      short_description: data.short_description,
      price_cents: data.price_cents,
      compare_at_cents: data.compare_at_cents,
      image_url: data.image_url,
      stock_quantity: data.stock_quantity ?? 0,
      sku: data.sku,
      is_active: data.is_active,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      created_at: data.created_at?.toMillis?.() ? new Date(data.created_at.toMillis()).toISOString() : data.created_at,
    });
  } catch (e) {
    console.error('store/products/[slug]', e);
    return res.status(500).json({ error: 'Failed to load product' });
  }
}
