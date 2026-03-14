/**
 * Send ticket-related emails via Resend.
 * Set RESEND_API_KEY and SUPPORT_EMAIL_FROM (e.g. support@yourdomain.com) in Vercel.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.SUPPORT_EMAIL_FROM || process.env.RESEND_FROM || 'support@example.com';
const SUPPORT_NAME = process.env.SUPPORT_EMAIL_NAME || 'Support';

export async function sendNewTicketToAdmin(params: {
  ticketId: string;
  subject: string;
  customerEmail: string;
  body: string;
  viewUrl: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY not set' };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `${SUPPORT_NAME} <${FROM_EMAIL}>`,
      to: [process.env.ADMIN_EMAIL || FROM_EMAIL],
      subject: `[Ticket #${params.ticketId.slice(0, 8)}] ${params.subject}`,
      html: `
        <p>New support ticket from <strong>${escapeHtml(params.customerEmail)}</strong>.</p>
        <p><strong>Subject:</strong> ${escapeHtml(params.subject)}</p>
        <p><strong>Message:</strong></p>
        <pre>${escapeHtml(params.body)}</pre>
        <p><a href="${params.viewUrl}">View and reply</a></p>
      `,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: err };
  }
  return { ok: true };
}

export async function sendNewTicketToCustomer(params: {
  ticketId: string;
  subject: string;
  customerEmail: string;
  viewTicketUrl: string;
  brandName?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY not set' };
  const brand = params.brandName || 'Support';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `${SUPPORT_NAME} <${FROM_EMAIL}>`,
      to: [params.customerEmail],
      subject: `Ticket received: ${params.subject}`,
      html: `
        <p>We've received your support request.</p>
        <p><strong>Subject:</strong> ${escapeHtml(params.subject)}</p>
        <p>You can view your ticket and add replies at the link below. Please save this link.</p>
        <p><a href="${params.viewTicketUrl}">View your ticket</a></p>
        <p>— ${escapeHtml(brand)}</p>
      `,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: err };
  }
  return { ok: true };
}

export async function sendReplyToCustomer(params: {
  ticketId: string;
  subject: string;
  customerEmail: string;
  replyBody: string;
  viewTicketUrl: string;
  brandName?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY not set' };
  const brand = params.brandName || 'Support';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `${SUPPORT_NAME} <${FROM_EMAIL}>`,
      to: [params.customerEmail],
      subject: `Re: ${params.subject}`,
      html: `
        <p>There is a new reply on your support ticket.</p>
        <p><strong>Subject:</strong> ${escapeHtml(params.subject)}</p>
        <p><strong>Reply:</strong></p>
        <pre>${escapeHtml(params.replyBody)}</pre>
        <p><a href="${params.viewTicketUrl}">View ticket and reply</a></p>
        <p>— ${escapeHtml(brand)}</p>
      `,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: err };
  }
  return { ok: true };
}

export async function sendReplyToAdmin(params: {
  ticketId: string;
  subject: string;
  customerEmail: string;
  replyBody: string;
  viewUrl: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY) return { ok: false, error: 'RESEND_API_KEY not set' };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: `${SUPPORT_NAME} <${FROM_EMAIL}>`,
      to: [process.env.ADMIN_EMAIL || FROM_EMAIL],
      subject: `[Ticket reply #${params.ticketId.slice(0, 8)}] ${params.subject}`,
      html: `
        <p><strong>${escapeHtml(params.customerEmail)}</strong> replied to ticket.</p>
        <p><strong>Subject:</strong> ${escapeHtml(params.subject)}</p>
        <p><strong>Reply:</strong></p>
        <pre>${escapeHtml(params.replyBody)}</pre>
        <p><a href="${params.viewUrl}">View and reply</a></p>
      `,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    return { ok: false, error: err };
  }
  return { ok: true };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
