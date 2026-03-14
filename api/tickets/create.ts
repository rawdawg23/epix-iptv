import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb, generateId, generateToken } from '../_lib/firebase';
import {
  sendNewTicketToAdmin,
  sendNewTicketToCustomer,
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

  try {
    const { email, subject, message } = req.body as Record<string, string>;
    if (!email?.trim() || !subject?.trim() || !message?.trim()) {
      return res.status(400).json({
        error: 'Missing required fields: email, subject, message',
      });
    }

    const id = generateId();
    const customerToken = generateToken();
    const db = getDb();
    const now = FieldValue.serverTimestamp();

    await db.collection('tickets').doc(id).set({
      email: email.trim(),
      subject: subject.trim(),
      status: 'open',
      customer_token: customerToken,
      created_at: now,
      updated_at: now,
    });
    await db.collection('tickets').doc(id).collection('replies').add({
      from_role: 'customer',
      from_email: email.trim(),
      body: message.trim(),
      created_at: now,
    });

    const baseUrl =
      process.env.SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');
    const viewTicketUrl = `${baseUrl}/support/ticket?id=${id}&token=${customerToken}`;
    const adminViewUrl = `${baseUrl}/admin/tickets?ticket=${id}`;

    await sendNewTicketToAdmin({
      ticketId: id,
      subject: subject.trim(),
      customerEmail: email.trim(),
      body: message.trim(),
      viewUrl: adminViewUrl,
    });
    await sendNewTicketToCustomer({
      ticketId: id,
      subject: subject.trim(),
      customerEmail: email.trim(),
      viewTicketUrl,
      brandName: process.env.BRAND_NAME,
    });

    return res.status(201).json({
      success: true,
      ticketId: id,
      token: customerToken,
      viewUrl: viewTicketUrl,
      message:
        'Ticket created. Check your email for the link to view and reply.',
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Database or email error';
    if (msg.includes('FIREBASE')) {
      return res.status(503).json({ error: 'Service not configured' });
    }
    console.error('tickets/create', e);
    return res.status(500).json({ error: msg });
  }
}
