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

  const adminSecret = req.headers['x-admin-secret'];
  if (!process.env.ADMIN_SECRET || adminSecret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const db = getDb();
    const snap = await db.collection('tickets').orderBy('updated_at', 'desc').limit(200).get();
    const tickets = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        email: data.email,
        subject: data.subject,
        status: data.status,
        created_at: data.created_at?.toMillis?.() ? new Date(data.created_at.toMillis()).toISOString() : data.created_at,
        updated_at: data.updated_at?.toMillis?.() ? new Date(data.updated_at.toMillis()).toISOString() : data.updated_at,
      };
    });
    return res.status(200).json({ tickets });
  } catch (e) {
    console.error('admin/tickets', e);
    const msg = e instanceof Error ? e.message : 'Server error';
    return res.status(500).json({ error: msg });
  }
}
