import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeKnowledgeBase, refreshEmbeddings, getDocuments } from "../../src/lib/ai/rag";
import { loadEmbeddingCache } from "../../src/lib/ai/embeddings";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await initializeKnowledgeBase();

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const action: string = body?.action || "rebuild";

    if (action === "embeddings") {
      await refreshEmbeddings();
      const docs = getDocuments();
      const embeddings = await loadEmbeddingCache();
      return res.status(200).json({
        success: true,
        message: "Embeddings rebuilt successfully",
        stats: {
          documents: docs.length,
          embeddings: Object.keys(embeddings).length,
        },
      });
    }

    if (action === "crawl") {
      await refreshEmbeddings();
      const docs = getDocuments();
      return res.status(200).json({
        success: true,
        message: "Crawl completed",
        stats: {
          documents: docs.length,
          indexedAt: new Date().toISOString(),
        },
      });
    }

    return res.status(400).json({ error: "Invalid action. Supported: crawl, embeddings" });
  } catch (err) {
    console.error("Crawl API error:", err);
    return res.status(500).json({ error: "Crawl failed" });
  }
}
