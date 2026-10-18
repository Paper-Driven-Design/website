import type { VercelRequest, VercelResponse } from '@vercel/node';

const BREVO_API_URL = 'https://api.brevo.com/v3/contacts';
const BREVO_API_KEY = process.env.BREVO_KEY;
const BREVO_LIST_ID = Number(process.env.BREVO_LIST_ID);
const ALLOWED_ORIGINS = ['https://paperdriven.design', 'https://www.paperdriven.design'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body ?? {};

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!BREVO_API_KEY || !BREVO_LIST_ID) {
    console.error('BREVO_KEY or BREVO_LIST_ID environment variable is not set');
    return res.status(500).json({ error: 'Newsletter service is not configured' });
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        emailBlacklisted: false,
        updateEnabled: true, // Update if contact already exists
        listIds: [BREVO_LIST_ID],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Already subscribed
      if (response.status === 400 && errorData.code === 'duplicate_parameter') {
        return res.status(200).json({ success: true, message: 'Successfully subscribed!' });
      }

      console.error('Brevo API error:', response.status, errorData);
      return res.status(502).json({ error: 'Failed to subscribe' });
    }

    return res.status(200).json({ success: true, message: 'Successfully subscribed!' });
  } catch (error) {
    console.error('Error subscribing:', error);
    return res.status(500).json({ error: 'Failed to subscribe' });
  }
}
