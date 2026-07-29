import type { VercelRequest, VercelResponse } from "@vercel/node";
import { resolveKnowledgeRoot } from "../../src/lib/ai/knowledge";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  try {
    const fs = await import("fs");
    const path = await import("path");
    const cwd = process.cwd();
    const kbRoot = resolveKnowledgeRoot();
    const kbExists = fs.existsSync(kbRoot);
    const groqKey = process.env.GROQ_API_KEY;

    return res.status(200).json({
      status: "ok",
      cwd,
      knowledgeRoot: kbRoot,
      knowledgeExists: kbExists,
      groqConfigured: !!groqKey,
      groqPrefix: groqKey ? `${groqKey.slice(0, 6)}...` : null,
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
