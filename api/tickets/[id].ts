import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/firebase';

export const config = { runtime: 'nodejs' };

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Missing ticket id' });

  const token = (req.query.token as string) || '';
  const adminSecret = req.headers['x-admin-secret'];
  const isAdmin =
    process.env.ADMIN_SECRET && adminSecret === process.env.ADMIN_SECRET;

  try {
    const db = getDb();
    const ticketSnap = await db.collection('tickets').doc(id).get();
    if (!ticketSnap.exists) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    const data = ticketSnap.data()!;
    const ticket = {
      id: ticketSnap.id,
      email: data.email,
      subject: data.subject,
      status: data.status,
      created_at: data.created_at?.toMillis?.() ? new Date(data.created_at.toMillis()).toISOString() : data.created_at,
      updated_at: data.updated_at?.toMillis?.() ? new Date(data.updated_at.toMillis()).toISOString() : data.updated_at,
    };

    if (!isAdmin) {
      const correctToken = data.customer_token;
      if (!correctToken || token !== correctToken) {
        return res.status(403).json({ error: 'Invalid or missing token' });
      }
    }

    const repliesSnap = await db.collection('tickets').doc(id).collection('replies').orderBy('created_at', 'asc').get();
    const replies = repliesSnap.docs.map((d) => {
      const r = d.data();
      return {
        id: d.id,
        ticket_id: id,
        from_role: r.from_role,
        from_email: r.from_email ?? null,
        body: r.body,
        created_at: r.created_at?.toMillis?.() ? new Date(r.created_at.toMillis()).toISOString() : r.created_at,
      };
    });

    return res.status(200).json({ ticket, replies });
  } catch (e) {
    console.error('tickets/[id]', e);
    const msg = e instanceof Error ? e.message : 'Server error';
    return res.status(500).json({ error: msg });
  }
}
