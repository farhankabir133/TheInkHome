import { KnowledgeDoc, SearchResult, ChatResponse, ActionItem } from "./types";

export function buildSearchIndex(docs: KnowledgeDoc[]) {
  // Simplified for bundled data - Fuse.js would require additional setup
}

export function keywordSearch(query: string, limit = 12): SearchResult[] {
  return [];
}

export function fullTextSearch(query: string, limit = 12): SearchResult[] {
  return [];
}

export function getDocumentById(id: string): KnowledgeDoc | undefined {
  return undefined;
}

export function getAllDocuments(): KnowledgeDoc[] {
  return [];
}
