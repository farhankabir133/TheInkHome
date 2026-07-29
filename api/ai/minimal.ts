import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  try {
    return res.status(200).json({
      status: "ok",
      message: "Minimal endpoint works",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Test error:", err);
    return res.status(500).json({
      status: "error",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
