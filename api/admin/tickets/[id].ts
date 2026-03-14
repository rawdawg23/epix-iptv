import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../../_lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

const VALID_STATUSES = ['open', 'resolved', 'closed'];

function isAdmin(req: VercelRequest): boolean {
  const secret = req.headers['x-admin-secret'];
  return !!(process.env.ADMIN_SECRET && secret === process.env.ADMIN_SECRET);
}

function toDate(v: unknown): string | unknown {
  if (v && typeof v === 'object' && 'toMillis' in v && typeof (v as { toMillis: () => number }).toMillis === 'function') {
    return new Date((v as { toMillis: () => number }).toMillis()).toISOString();
  }
  return v;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (!isAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Missing ticket id' });

  try {
    const db = getDb();
    const ticketRef = db.collection('tickets').doc(id);

    if (req.method === 'GET') {
      const ticketSnap = await ticketRef.get();
      if (!ticketSnap.exists) return res.status(404).json({ error: 'Ticket not found' });
      const data = ticketSnap.data()!;
      const repliesSnap = await ticketRef.collection('replies').orderBy('created_at', 'asc').get();
      const replies = repliesSnap.docs.map((d) => {
        const r = d.data();
        return {
          id: d.id,
          ticket_id: id,
          from_role: r.from_role,
          from_email: r.from_email ?? null,
          body: r.body,
          created_at: toDate(r.created_at),
        };
      });
      return res.status(200).json({
        ticket: {
          id: ticketSnap.id,
          email: data.email,
          subject: data.subject,
          status: data.status,
          created_at: toDate(data.created_at),
          updated_at: toDate(data.updated_at),
        },
        replies,
      });
    }

    if (req.method === 'PATCH') {
      const { status } = (req.body || {}) as { status?: string };
      if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: `status must be one of: ${VALID_STATUSES.join(', ')}`,
        });
      }
      const ticketSnap = await ticketRef.get();
      if (!ticketSnap.exists) return res.status(404).json({ error: 'Ticket not found' });
      await ticketRef.update({ status, updated_at: FieldValue.serverTimestamp() });
      return res.status(200).json({ success: true, status });
    }

    if (req.method === 'DELETE') {
      const ticketSnap = await ticketRef.get();
      if (!ticketSnap.exists) return res.status(404).json({ error: 'Ticket not found' });
      const repliesSnap = await ticketRef.collection('replies').get();
      const batch = db.batch();
      repliesSnap.docs.forEach((d) => batch.delete(d.ref));
      batch.delete(ticketRef);
      await batch.commit();
      return res.status(200).json({ success: true, deleted: true });
    }

    res.setHeader('Allow', 'GET, PATCH, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('admin/tickets/[id]', e);
    const msg = e instanceof Error ? e.message : 'Server error';
    return res.status(500).json({ error: msg });
  }
}
