import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeKnowledgeBase, generateRAGResponse, searchDocuments } from "./rag";

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await initializeKnowledgeBase();
    initialized = true;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await ensureInit();

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const query: string = body?.query || body?.messages?.at(-1)?.content || "";
    const history = body?.messages || [];

    if (!query.trim()) {
      return res.status(400).json({ error: "Missing query" });
    }

    const docs = searchDocuments(query, 8);
    const result = await generateRAGResponse(query, history, docs);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Chat API error:", err);
    return res.status(500).json({ error: "Failed to generate response" });
  }
}
