import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, generateId, generateOrderNumber } from '../../_lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const body = req.body as {
      email?: string;
      items?: { productId: string; quantity: number }[];
      shippingAddress?: Record<string, string>;
      billingAddress?: Record<string, string>;
      coupon?: string;
      notes?: string;
    };
    const email = body.email?.trim();
    const items = Array.isArray(body.items) ? body.items : [];
    if (!email) return res.status(400).json({ error: 'Email required' });
    if (!items.length) return res.status(400).json({ error: 'At least one item required' });

    const db = getDb();
    const productIds = items.map((i) => i.productId);
    const productsSnap = await db.collection('products').get();
    const productMap = new Map(productsSnap.docs.filter((d) => productIds.includes(d.id)).map((d) => [d.id, { id: d.id, ...d.data() }]));
    let subtotalCents = 0;
    const lineItems: { productId: string; productName: string; sku: string | null; priceCents: number; quantity: number; totalCents: number }[] = [];
    for (const item of items) {
      const p = productMap.get(item.productId) as { id: string; name: string; sku?: string; price_cents: number; stock_quantity: number; track_inventory: boolean } | undefined;
      if (!p || item.quantity < 1) continue;
      if (p.track_inventory !== false && (p.stock_quantity ?? 0) < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${p.name}` });
      }
      const totalCents = p.price_cents * item.quantity;
      subtotalCents += totalCents;
      lineItems.push({
        productId: p.id,
        productName: p.name,
        sku: p.sku ?? null,
        priceCents: p.price_cents,
        quantity: item.quantity,
        totalCents,
      });
    }
    if (lineItems.length === 0) return res.status(400).json({ error: 'No valid items' });

    let discountCents = 0;
    if (body.coupon?.trim()) {
      const code = body.coupon.trim().toUpperCase();
      const couponSnap = await db.collection('coupons').doc(code).get();
      const coupon = couponSnap.data();
      if (coupon?.is_active && (!coupon.expires_at || (coupon.expires_at as { toMillis: () => number }).toMillis() > Date.now()) && subtotalCents >= (coupon.min_order_cents ?? 0)) {
        discountCents = Math.min(coupon.discount_value_cents ?? 0, subtotalCents);
      }
    }

    const orderId = generateId();
    const orderNum = generateOrderNumber();
    const totalCents = Math.max(0, subtotalCents - discountCents);
    const now = FieldValue.serverTimestamp();

    await db.collection('orders').doc(orderId).set({
      order_number: orderNum,
      email,
      status: 'pending',
      total_cents: totalCents,
      subtotal_cents: subtotalCents,
      tax_cents: 0,
      shipping_cents: 0,
      discount_cents: discountCents,
      currency: 'USD',
      shipping_address_json: body.shippingAddress ?? {},
      billing_address_json: body.billingAddress ?? {},
      customer_notes: body.notes?.trim() ?? null,
      created_at: now,
      updated_at: now,
    });

    const batch = db.batch();
    const orderRef = db.collection('orders').doc(orderId);
    for (const line of lineItems) {
      const itemRef = orderRef.collection('items').doc(generateId());
      batch.set(itemRef, {
        product_id: line.productId,
        product_name: line.productName,
        product_sku: line.sku,
        price_cents: line.priceCents,
        quantity: line.quantity,
        total_cents: line.totalCents,
        created_at: now,
      });
      const p = productMap.get(line.productId) as { track_inventory?: boolean } | undefined;
      if (p?.track_inventory !== false) {
        const prodRef = db.collection('products').doc(line.productId);
        batch.update(prodRef, {
          stock_quantity: FieldValue.increment(-line.quantity),
          updated_at: now,
        });
      }
    }
    await batch.commit();

    if (discountCents > 0 && body.coupon?.trim()) {
      const code = body.coupon.trim().toUpperCase();
      await db.collection('coupons').doc(code).update({
        used_count: FieldValue.increment(1),
      });
    }

    const baseUrl = process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
    return res.status(201).json({
      orderId,
      orderNumber: orderNum,
      totalCents,
      paymentUrl: null,
      confirmationUrl: `${baseUrl}/store/order-confirmation?order=${orderId}&email=${encodeURIComponent(email)}`,
    });
  } catch (e) {
    console.error('store/checkout', e);
    return res.status(500).json({ error: 'Checkout failed' });
  }
}
