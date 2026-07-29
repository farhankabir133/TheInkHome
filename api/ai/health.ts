import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeKnowledgeBase, getDocuments, searchDocuments } from "../../src/lib/ai/rag";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await initializeKnowledgeBase();
    const docs = getDocuments();
    const q = (req.query.q as string) || "";
    const results = q.trim() ? searchDocuments(q, 5) : [];
    const groqKey = process.env.GROQ_API_KEY;

    return res.status(200).json({
      status: "ok",
      knowledgeBase: {
        loaded: docs.length > 0,
        documentCount: docs.length,
      },
      search: {
        query: q || null,
        resultCount: results.length,
        sample: results.slice(0, 3).map(r => ({ id: r.id, title: r.title, score: r.score })),
      },
      groq: {
        configured: !!groqKey,
        keyPrefix: groqKey ? `${groqKey.slice(0, 6)}...` : null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("AI health error:", err);
    return res.status(500).json({
      status: "error",
      error: err instanceof Error ? err.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
}
