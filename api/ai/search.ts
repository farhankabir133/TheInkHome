import Fuse from "fuse.js";
import { KnowledgeDoc, SearchResult } from "./types";

let fuse: Fuse<KnowledgeDoc> | null = null;
const docsCache: KnowledgeDoc[] = [];

export function buildSearchIndex(docs: KnowledgeDoc[]) {
  docsCache.length = 0;
  docsCache.push(...docs);
  fuse = new Fuse(docs, {
    keys: [
      { name: "title", weight: 0.4 },
      { name: "content", weight: 0.35 },
      { name: "tags", weight: 0.15 },
      { name: "type", weight: 0.05 },
      { name: "id", weight: 0.05 },
    ],
    threshold: 0.4,
    includeScore: true,
    minMatchCharLength: 2,
    ignoreLocation: true,
  });
}

export function keywordSearch(query: string, limit = 12): SearchResult[] {
  if (!fuse || docsCache.length === 0) return [];
  const results = fuse.search(query, { limit });
  return results.map((r) => ({
    ...r.item,
    score: 1 - (r.score ?? 1),
  }));
}

export function fullTextSearch(query: string, limit = 12): SearchResult[] {
  if (!fuse || docsCache.length === 0) return [];
  const lowerQuery = query.toLowerCase();
  const keywords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);

  if (keywords.length === 0) {
    return keywordSearch(query, limit);
  }

  const scored = docsCache.map((doc) => {
    const text = `${doc.title} ${doc.content} ${doc.tags.join(" ")}`.toLowerCase();
    let score = 0;
    for (const keyword of keywords) {
      let count = 0;
      let idx = text.indexOf(keyword);
      while (idx !== -1) {
        count++;
        idx = text.indexOf(keyword, idx + 1);
      }
      score += count;
    }
    return { doc, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const top = scored.filter((s) => s.score > 0).slice(0, limit);
  const maxScore = top[0]?.score || 1;
  return top.map((s) => ({
    ...s.doc,
    score: s.score / maxScore,
  }));
}

export function getDocumentById(id: string): KnowledgeDoc | undefined {
  return docsCache.find((d) => d.id === id);
}

export function getAllDocuments(): KnowledgeDoc[] {
  return docsCache;
}
