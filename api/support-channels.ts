import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from './_lib/firebase';

export const config = { runtime: 'nodejs' };

/**
 * Public API: returns Telegram/WhatsApp support channel config for contact page and footer.
 * No auth required.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const snap = await getDb().collection('editor_config').doc('main').get();
    const data = snap.exists ? snap.data() ?? {} : {};
    const support = data.supportChannels ?? {};
    const telegram = support.telegram ?? {};
    const whatsapp = support.whatsapp ?? {};
    return res.status(200).json({
      telegram: {
        enabled: Boolean(telegram.enabled),
        username: telegram.username ?? '',
      },
      whatsapp: {
        enabled: Boolean(whatsapp.enabled),
        number: whatsapp.number ?? '',
        message: whatsapp.message ?? '',
      },
    });
  } catch (e) {
    console.error('support-channels', e);
    return res.status(500).json({ error: 'Failed to load support channels' });
  }
}
