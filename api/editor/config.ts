import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDb } from '../_lib/firebase';
import { requireAdmin } from '../_lib/adminAuth';
import { FieldValue } from 'firebase-admin/firestore';

export const config = { runtime: 'nodejs' };

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const db = getDb();
      const snap = await db.collection('editor_config').doc('main').get();
      const config = snap.exists ? snap.data() ?? {} : {};
      return res.status(200).json(config);
    } catch (e) {
      console.error('editor/config GET', e);
      return res.status(500).json({ error: 'Failed to load config' });
    }
  }

  if (req.method === 'PUT') {
    if (!requireAdmin(req, res)) return;
    try {
      const body = req.body && typeof req.body === 'object' ? req.body : {};
      const db = getDb();
      await db.collection('editor_config').doc('main').set(
        { ...body, updated_at: FieldValue.serverTimestamp() },
        { merge: true }
      );
      return res.status(200).json({ success: true });
    } catch (e) {
      console.error('editor/config PUT', e);
      return res.status(500).json({ error: 'Failed to save config' });
    }
  }

  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
}
