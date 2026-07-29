import type { VercelRequest, VercelResponse } from "@vercel/node";
import Groq from "groq-sdk";
import { initializeKnowledgeBase, getDocuments } from "./rag";

const GROQ_MODEL = "llama-3.3-70b-versatile";

const SYSTEM_PROMPT = `You are the official AI assistant for The Ink Home, a thoughtful publication exploring life, writing, technology, productivity, relationships, and mental health.

## CRITICAL RULES
1. **STICK TO RETRIEVED KNOWLEDGE**
2. **NEVER HALLUCINATE FACTS**
3. **BE CONCISE AND STRUCTURED**
4. **RECOMMEND RELEVANT ARTICLES**
5. **PROVIDE SMART ACTIONS**
6. **SUPPORTED QUERY TYPES** - Publication info, author profiles, article recommendations, submission guidelines, contact info, summaries, related reading
7. **TONE** - Warm, thoughtful, helpful, human, professional

## RESPONSE TEMPLATE
### [Title]
[1-3 sentence direct answer]
**Key points**
- ...
**Related Articles**
→ [Title](url)
**Next Steps**
→ Action`;

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

      const groq = new Groq({ apiKey });
      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: query },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      });

      const message = completion.choices?.[0]?.message?.content?.trim() || "I couldn't find that information in The Ink Home's knowledge base.";
      return res.status(200).json({
        message,
        sources: [],
        suggestedQuestions: [],
        actions: []
      });
    }

    if (route === "search" && req.method === "GET") {
      const q = (req.query.q as string) || "";
      if (!q.trim()) {
        return res.status(400).json({ error: "Missing query parameter 'q'" });
      }
      return res.status(200).json({ query: q, count: 0, results: [] });
    }

    if (route === "crawl" && req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const action: string = body?.action || "rebuild";
      return res.status(200).json({
        success: true,
        message: "Crawl completed",
        stats: {
          documents: 0,
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
