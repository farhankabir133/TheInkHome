import { KnowledgeDoc, SearchResult } from "./types";
import { knowledgeDocs } from "./knowledge-data";

function scoreMatch(text: string, query: string): number {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  if (lowerText === lowerQuery) return 1.0;
  if (lowerText.includes(lowerQuery)) return 0.8;
  const queryWords = lowerQuery.split(/\s+/).filter((w) => w.length > 2);
  if (queryWords.length === 0) return 0.1;
  const matched = queryWords.filter((w) => lowerText.includes(w));
  return matched.length / queryWords.length;
}

export function buildSearchIndex(docs: KnowledgeDoc[]) {
  // Simple in-memory search — no index needed for bundled data
}

export function keywordSearch(query: string, limit = 12): SearchResult[] {
  const results: SearchResult[] = [];
  const q = query.trim();
  if (!q) return [];
  for (const doc of knowledgeDocs) {
    const titleScore = scoreMatch(doc.title, q);
    const contentScore = scoreMatch(doc.content, q);
    const tagScore = doc.tags.some((t) => t.toLowerCase().includes(q.toLowerCase())) ? 0.7 : 0;
    const score = Math.max(titleScore, contentScore, tagScore);
    if (score > 0.05) {
      results.push({ ...doc, score });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function fullTextSearch(query: string, limit = 12): SearchResult[] {
  const results: SearchResult[] = [];
  const q = query.trim();
  if (!q) return [];
  const words = q.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  if (words.length === 0) return [];
  for (const doc of knowledgeDocs) {
    const lowerContent = doc.content.toLowerCase();
    let matchCount = 0;
    for (const word of words) {
      if (lowerContent.includes(word)) matchCount++;
    }
    if (matchCount > 0) {
      const score = matchCount / words.length;
      results.push({ ...doc, score });
    }
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

export function getDocumentById(id: string): KnowledgeDoc | undefined {
  return knowledgeDocs.find((d) => d.id === id);
}

export function getAllDocuments(): KnowledgeDoc[] {
  return knowledgeDocs;
}
