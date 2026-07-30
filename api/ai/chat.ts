import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeKnowledgeBase, searchDocuments, generateRAGResponse } from "./rag";

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
  try {
    await ensureInit();

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const query: string = req.body?.query || req.body?.messages?.at(-1)?.content || "";
    const history: any[] = req.body?.messages || [];
    if (!query.trim()) {
      return res.status(400).json({ error: "Missing query" });
    }
    const docs = searchDocuments(query, 8);
    const result = await generateRAGResponse(query, history, docs);
    return res.status(200).json(result);
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ error: "Chat failed", details: err instanceof Error ? err.message : "unknown" });
  }
}