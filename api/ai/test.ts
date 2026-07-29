import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  try {
    const fs = await import("fs");
    const path = await import("path");
    const cwd = process.cwd();
    const kbPath = path.join(cwd, "knowledge");
    const kbExists = fs.existsSync(kbPath);

    return res.status(200).json({
      status: "ok",
      cwd,
      knowledgePath: kbPath,
      knowledgeExists: kbExists,
      envKeys: Object.keys(process.env).filter(k => k.includes("GROQ") || k.includes("GEMINI") || k.includes("GOOGLE")),
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
