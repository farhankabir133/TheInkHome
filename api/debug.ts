import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  try {
    const fs = await import("fs");
    const path = await import("path");
    const cwd = process.cwd();
    const exists = fs.existsSync(path.join(cwd, "api", "ai", "knowledge-data.ts"));

    return res.status(200).json({
      status: "ok",
      cwd,
      fileExists: exists,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Debug error:", err);
    return res.status(500).json({
      status: "error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
