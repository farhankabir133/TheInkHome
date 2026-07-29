import { GoogleGenAI } from "@google/genai";
import { KnowledgeDoc, SearchResult } from "./types";

const EMBEDDING_MODEL = "text-embedding-004";
const CACHE_PATH = `knowledge/embeddings.json`;

let cached: Record<string, number[]> | null = null;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey });
}

export async function getEmbedding(text: string): Promise<number[]> {
  if (!text || text.trim().length === 0) {
    return [];
  }
  const ai = getGeminiClient();
  const response = await ai.models.embedContent({
    model: EMBEDDING_MODEL,
    contents: text.slice(0, 8000),
    config: { taskType: "RETRIEVAL_DOCUMENT" },
  });
  const embedding = response.embeddings?.[0]?.values;
  if (!embedding || !Array.isArray(embedding)) {
    throw new Error("Failed to generate embedding");
  }
  return embedding;
}

export async function buildEmbeddingCache(docs: KnowledgeDoc[]): Promise<Record<string, number[]>> {
  const ai = getGeminiClient();
  const cache: Record<string, number[]> = {};

  const texts = docs.map((doc) => ({
    id: doc.id,
    text: `${doc.title}\n${doc.tags.join(" ")}\n${doc.content.slice(0, 4000)}`,
  }));

  const batchSize = 20;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const promises = batch.map(async (item) => {
      try {
        cache[item.id] = await getEmbedding(item.text);
      } catch {
        cache[item.id] = [];
      }
    });
    await Promise.allSettled(promises);
  }

  try {
    const fs = await import("fs");
    fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2));
  } catch {
    // ignore cache write errors in read-only environments
  }

  return cache;
}

export async function loadEmbeddingCache(): Promise<Record<string, number[]>> {
  try {
    const { existsSync, readFileSync } = await import("fs");
    if (existsSync(CACHE_PATH)) {
      return JSON.parse(readFileSync(CACHE_PATH, "utf-8"));
    }
  } catch {
    // ignore
  }
  return {};
}

function cosineSimilarity(a: number[], b: number[]): number {
  if (!a.length || !b.length || a.length !== b.length) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export function semanticSearch(
  query: string,
  docs: KnowledgeDoc[],
  embeddings: Record<string, number[]>,
  limit = 12
): SearchResult[] {
  const docMap = new Map(docs.map((d) => [d.id, d]));
  const queryVec = embeddings[`__query:${query}`];

  const scored: Array<{ doc: KnowledgeDoc; score: number }> = [];

  for (const doc of docs) {
    const vec = embeddings[doc.id];
    if (!vec || vec.length === 0) {
      const text = `${doc.title} ${doc.content}`.toLowerCase();
      const keywords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      let kwScore = 0;
      for (const k of keywords) {
        let idx = text.indexOf(k);
        while (idx !== -1) {
          kwScore += 1;
          idx = text.indexOf(k, idx + 1);
        }
      }
      if (kwScore > 0) {
        scored.push({ doc, score: Math.min(kwScore / keywords.length, 1) });
      }
      continue;
    }

    if (queryVec) {
      scored.push({ doc, score: cosineSimilarity(queryVec, vec) });
    } else {
      const text = `${doc.title} ${doc.content}`.toLowerCase();
      const keywords = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
      let kwScore = 0;
      for (const k of keywords) {
        let idx = text.indexOf(k);
        while (idx !== -1) {
          kwScore += 1;
          idx = text.indexOf(k, idx + 1);
        }
      }
      scored.push({
        doc,
        score: keywords.length > 0 ? Math.min(kwScore / keywords.length, 1) : 0,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => ({ ...s.doc, score: s.score }));
}
