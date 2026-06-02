import { Redis } from '@upstash/redis';

let client;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  client = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

export async function get(key) {
  if (!client) return null;
  try {
    return await client.get(key);
  } catch (e) {
    console.error('redis get error', e);
    return null;
  }
}

export async function set(key, value, ttlSeconds) {
  if (!client) return null;
  try {
    if (typeof ttlSeconds === 'number') {
      return await client.setex(key, ttlSeconds, typeof value === 'string' ? value : JSON.stringify(value));
    }
    return await client.set(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (e) {
    console.error('redis set error', e);
    return null;
  }
}

export async function incr(key) {
  if (!client) return null;
  try {
    return await client.incr(key);
  } catch (e) {
    console.error('redis incr error', e);
    return null;
  }
}

export async function ttl(key) {
  if (!client) return null;
  try {
    return await client.ttl(key);
  } catch (e) {
    console.error('redis ttl error', e);
    return null;
  }
}

export default client;
