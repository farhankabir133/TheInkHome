import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let payload: any = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch (e) {
      payload = {};
    }
  }

  const event = Array.isArray(req.query.event) ? req.query.event[0] : (req.query.event as string) || "unknown";
  console.log(`[TELEMETRY] Event: ${event} | Payload:`, payload);
  return res.status(200).json({ success: true, message: "Telemetry received successfully" });
}
