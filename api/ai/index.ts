import type { VercelRequest, VercelResponse } from "@vercel/node";
import { initializeKnowledgeBase, getDocuments, searchDocuments, generateRAGResponse } from "./rag";
import { SYSTEM_PROMPT } from "./system-prompt";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ status: "ok", message: "imports work" });
}
