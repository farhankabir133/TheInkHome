import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  try {
    const { initializeKnowledgeBase, getDocuments } = await import("./rag");
    await initializeKnowledgeBase();
    const docs = getDocuments();
    const groqKey = process.env.GROQ_API_KEY;

    return res.status(200).json({
      status: "ok",
      message: "AI module loaded",
      knowledgeBase: {
        loaded: docs.length > 0,
        documentCount: docs.length,
      },
      groq: {
        configured: !!groqKey,
        keyPrefix: groqKey ? `${groqKey.slice(0, 6)}...` : null,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Test error:", err);
    return res.status(500).json({
      status: "error",
      error: err instanceof Error ? err.message : "Unknown error",
      stack: err instanceof Error ? err.stack : undefined,
    });
  }
}
