import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeKnowledgeBase, getDocuments, searchDocuments, generateRAGResponse } from "./rag";
import { SYSTEM_PROMPT } from "./system-prompt";

const GROQ_MODEL = "llama-3.3-70b-versatile";

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await initializeKnowledgeBase();
    initialized = true;
  }
}

function getRoute(req: VercelRequest): string {
  const url = req.url || "/api/ai";
  const pathname = url.split("?")[0];
  if (pathname.endsWith("/chat")) return "chat";
  if (pathname.endsWith("/search")) return "search";
  if (pathname.endsWith("/crawl")) return "crawl";
  if (pathname.endsWith("/health")) return "health";
  return "unknown";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const route = getRoute(req);

  try {
    if (route === "chat" && req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const query: string = body?.query || body?.messages?.at(-1)?.content || "";
      const history = body?.messages || [];

      if (!query.trim()) {
        return res.status(400).json({ error: "Missing query" });
      }

      const apiKey = process.env.GROQ_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          message: "AI service is not configured. Please set GROQ_API_KEY in Vercel environment variables.",
          sources: [],
          suggestedQuestions: [],
          actions: []
        });
      }

      await ensureInit();
      const docs = searchDocuments(query, 8);
      const result = await generateRAGResponse(query, history, docs);

      return res.status(200).json({
        message: result.message,
        sources: result.sources,
        suggestedQuestions: result.suggestedQuestions,
        actions: result.actions,
      });
    }

    if (route === "search" && req.method === "GET") {
      await ensureInit();
      const q = (req.query.q as string) || "";
      if (!q.trim()) {
        return res.status(400).json({ error: "Missing query parameter 'q'" });
      }
      const docs = searchDocuments(q, 12);
      return res.status(200).json({ query: q, count: docs.length, results: docs });
    }

    if (route === "crawl" && req.method === "POST") {
      await ensureInit();
      const docs = getDocuments();
      return res.status(200).json({
        success: true,
        message: "Knowledge base already embedded",
        stats: {
          documents: docs.length,
          indexedAt: new Date().toISOString(),
        },
      });
    }

    if (route === "health" && req.method === "GET") {
      await ensureInit();
      const docs = getDocuments();
      const groqKey = process.env.GROQ_API_KEY;
      return res.status(200).json({
        status: "ok",
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
    }

    return res.status(404).json({ error: "Not found" });
  } catch (err) {
    console.error("AI error:", err);
    return res.status(500).json({
      error: "Failed to generate response",
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
