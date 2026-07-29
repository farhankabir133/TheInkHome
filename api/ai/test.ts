import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  try {
    const fs = await import("fs");
    const path = await import("path");
    const cwd = process.cwd();

    const candidates = [
      path.join(cwd, "knowledge"),
      path.join(cwd, "dist", "knowledge"),
      path.join(cwd, "src", "knowledge"),
    ];

    const results = candidates.map(p => ({
      path: p,
      exists: fs.existsSync(p),
    }));

    const groqKey = process.env.GROQ_API_KEY;

    return res.status(200).json({
      status: "ok",
      cwd,
      candidates: results,
      groqConfigured: !!groqKey,
      groqPrefix: groqKey ? `${groqKey.slice(0, 6)}...` : null,
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
