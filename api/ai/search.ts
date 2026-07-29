import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeKnowledgeBase, searchDocuments } from "../../src/lib/ai/rag";

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await initializeKnowledgeBase();
    initialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await ensureInit();

    const query = req.method === "GET" ? (req.query.q as string) : (req.body?.q as string);
    const limit = req.method === "GET" ? parseInt((req.query.limit as string) || "12") : parseInt((req.body?.limit as string) || "12");

    if (!query || !query.trim()) {
      return res.status(400).json({ error: "Missing query parameter 'q'" });
    }

    const results = searchDocuments(query, Math.min(limit, 20));
    return res.status(200).json({ query, count: results.length, results });
  } catch (err) {
    console.error("Search API error:", err);
    return res.status(500).json({ error: "Search failed" });
  }
}
