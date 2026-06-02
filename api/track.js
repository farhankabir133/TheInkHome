import { incr } from './_redis.js';

// Simple tracking endpoint for lightweight analytics
// Accepts POST or GET with `event` query param (e.g. event=subscribe)
export default async function handler(req, res) {
  try {
    const method = req.method || 'GET';
    const url = new URL(req.url, `http://${req.headers.host}`);
    const event = (method === 'POST' ? (req.body && req.body.event) : url.searchParams.get('event')) || 'unknown';

    // Simple metric: incr per-day event key
    const date = new Date().toISOString().slice(0, 10);
    const key = `metrics:${date}:${event}`;
    try {
      await incr(key);
    } catch (e) {
      console.error('track incr error', String(e));
    }

    // Light response to keep things fast
    res.status(204).end();
  } catch (e) {
    console.error('track handler error', String(e));
    res.status(500).json({ error: 'track_error' });
  }
}
