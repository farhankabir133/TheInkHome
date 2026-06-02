// Stories serverless endpoint with caching and rate-limiting
// Fetches Medium RSS and returns a JSON array of simplified story objects.
import { get, set, incr } from './_redis.js';
import { mapRssItemToStory } from '../lib/story.js';

const RSS2JSON = (rssUrl) => `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

async function fetchRss2Json(rssUrl) {
  try {
    const resp = await fetch(RSS2JSON(rssUrl));
    if (!resp.ok) return null;
    return await resp.json();
  } catch (e) {
    return null;
  }
}

async function fetchAllOrigins(rssUrl) {
  try {
    const url = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
    const r = await fetch(url);
    if (!r.ok) return null;
    const json = await r.json();
    return json?.contents || null;
  } catch (e) {
    return null;
  }
}

function mapRssItemToStory(it) {
  const title = it.title || "Untitled";
  const link = it.link || "";
  const author = it.author || it.creator || "The Ink Home";
  const pubDate = it.pubDate || new Date().toUTCString();
  const content = it.content || it.description || "";
  const coverMatch = (content || "").match(/<img[^>]+src=["']([^"']+)["']/i);
  const cover = coverMatch && coverMatch[1] ? coverMatch[1] : undefined;
  let slug = "";
  if (link) {
    const parts = link.split("/");
    const last = parts[parts.length - 1];
    slug = last ? last.split("?")[0] : "";
  }
  if (!slug) slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return {
    title,
    link,
    author,
    role: "",
    pubDate,
    categories: Array.isArray(it.categories) ? it.categories : ["Editorial"],
    description: (content || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().substring(0, 180) + "...",
    content,
    cover,
    slug,
    avatar: undefined
  };
}

export default async function handler(req, res) {
  const RSS_URL = "https://medium.com/feed/the-ink-home";
  const CACHE_KEY = 'stories:medium';
  const TTL_SECONDS = parseInt(process.env.STORIES_TTL_SECONDS || '300', 10);
  const RATE_LIMIT_PER_MIN = parseInt(process.env.RATE_LIMIT_PER_MINUTE || '60', 10);

  try {
    // Simple per-IP rate limiting using Redis counter
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const rlKey = `rl:${ip}`;
    try {
      const current = await incr(rlKey);
      if (current === 1) {
        // set expiry 60 seconds for the counter
        await set(rlKey, String(current), 60);
      }
      if (current && Number(current) > RATE_LIMIT_PER_MIN) {
        res.status(429).json({ error: 'rate_limited' });
        return;
      }
    } catch (e) {
      // Redis might be down; continue without rate limiting
      console.error(JSON.stringify({ t: 'rate_limit_error', error: String(e) }));
    }

    // Try cache first
    try {
      const cached = await get(CACHE_KEY);
      if (cached) {
        console.log(JSON.stringify({ t: 'cache_hit', key: CACHE_KEY }));
        const payload = typeof cached === 'string' ? JSON.parse(cached) : cached;
        res.status(200).json({ stories: payload });
        return;
      }
    } catch (e) {
      console.error(JSON.stringify({ t: 'cache_get_error', error: String(e) }));
    }

    // Try rss2json first
    const rss2 = await fetchRss2Json(RSS_URL);
    if (rss2 && Array.isArray(rss2.items) && rss2.items.length > 0) {
      const stories = rss2.items.map(mapRssItemToStory);
      // cache
      try { await set(CACHE_KEY, stories, TTL_SECONDS); } catch (e) { console.error(JSON.stringify({ t: 'cache_set_error', error: String(e) })); }
      return res.status(200).json({ stories });
    }

    // Fallback: AllOrigins raw RSS parse
    const xml = await fetchAllOrigins(RSS_URL);
    if (xml && typeof xml === 'string') {
      const items = [];
        const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
      let m;
      while ((m = itemRegex.exec(xml)) !== null) {
        const item = m[1];
        const titleMatch = item.match(/<title>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/title>/i);
        const linkMatch = item.match(/<link>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/link>/i);
        const contentMatch = item.match(/<content:encoded>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/content:encoded>/i) ||
          item.match(/<description>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([\s\S]*?))<\/description>/i);
        const obj = {
          title: titleMatch ? (titleMatch[1] || titleMatch[2]) : 'Untitled',
          link: linkMatch ? (linkMatch[1] || linkMatch[2]) : '',
          content: contentMatch ? (contentMatch[1] || contentMatch[2]) : ''
        };
        items.push(mapRssItemToStory(obj));
      }
      if (items.length > 0) {
        try { await set(CACHE_KEY, items, TTL_SECONDS); } catch (e) { console.error(JSON.stringify({ t: 'cache_set_error', error: String(e) })); }
        return res.status(200).json({ stories: items });
      }
    }

    // Nothing found, return empty array
    return res.status(200).json({ stories: [] });
  } catch (e) {
    console.error(JSON.stringify({ t: 'handler_error', error: String(e) }));
    return res.status(500).json({ error: 'internal_error' });
  }
}
