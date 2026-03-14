import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, generateId } from '../_lib/firebase';
import {
  sendReplyToCustomer,
  sendReplyToAdmin,
} from '../_lib/email';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = req.query.id as string;
  if (!id) return res.status(400).json({ error: 'Missing ticket id' });

  const { message, token } = (req.body || {}) as { message?: string; token?: string };
  const adminSecret = req.headers['x-admin-secret'];
  const isAdmin =
    process.env.ADMIN_SECRET && adminSecret === process.env.ADMIN_SECRET;

  if (!message?.trim()) {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    const db = getDb();
    const ticketRef = db.collection('tickets').doc(id);
    const ticketSnap = await ticketRef.get();
    if (!ticketSnap.exists) return res.status(404).json({ error: 'Ticket not found' });
    const ticket = ticketSnap.data()!;

    let fromRole: 'customer' | 'admin' = 'customer';
    let fromEmail: string | null = ticket.email;

    if (isAdmin) {
      fromRole = 'admin';
      fromEmail = null;
    } else {
      const correctToken = ticket.customer_token;
      if (!correctToken || token !== correctToken) {
        return res.status(403).json({ error: 'Invalid or missing token' });
      }
      if (ticket.status === 'closed') {
        return res.status(403).json({
          error: 'This ticket is closed. Open a new ticket if you need further help.',
        });
      }
    }

    const now = FieldValue.serverTimestamp();
    await ticketRef.collection('replies').add({
      from_role: fromRole,
      from_email: fromEmail,
      body: message.trim(),
      created_at: now,
    });
    const updateData: Record<string, unknown> = { updated_at: now };
    if (!isAdmin && ticket.status === 'resolved') {
      updateData.status = 'open';
    }
    await ticketRef.update(updateData);

    const baseUrl =
      process.env.SITE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
    const customerViewUrl = `${baseUrl}/support/ticket?id=${id}&token=${ticket.customer_token}`;
    const adminViewUrl = `${baseUrl}/admin/tickets?ticket=${id}`;

    if (fromRole === 'admin') {
      await sendReplyToCustomer({
        ticketId: id,
        subject: ticket.subject,
        customerEmail: ticket.email,
        replyBody: message.trim(),
        viewTicketUrl: customerViewUrl,
        brandName: process.env.BRAND_NAME,
      });
    } else {
      await sendReplyToAdmin({
        ticketId: id,
        subject: ticket.subject,
        customerEmail: ticket.email,
        replyBody: message.trim(),
        viewUrl: adminViewUrl,
      });
    }
  } catch (e) {
    console.error('tickets/[id]/reply', e);
    const msg = e instanceof Error ? e.message : 'Server error';
    return res.status(500).json({ error: msg });
  }

  return res.status(201).json({ success: true, message: 'Reply added' });
}
