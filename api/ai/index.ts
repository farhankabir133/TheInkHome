import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeKnowledgeBase, getDocuments, searchDocuments, generateRAGResponse } from "./rag";
import { SYSTEM_PROMPT } from "./system-prompt";

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
    const docs = getDocuments();
    return res.status(200).json({ status: "ok", docs: docs.length });
  } catch (err) {
    console.error("Init error:", err);
    return res.status(500).json({ error: "init failed", details: err instanceof Error ? err.message : "unknown" });
  }
}
