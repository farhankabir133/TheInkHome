import { KnowledgeDoc, SearchResult, ChatMessage, ChatResponse, ActionItem, IntentResult } from "./types";
import { keywordSearch, fullTextSearch, buildSearchIndex } from "./search";
import { buildEmbeddingCache, loadEmbeddingCache, semanticSearch as vecSearch } from "./embeddings";
import { loadAllDocuments, getDocUrl, getDocTypeLabel } from "./knowledge";
import { SYSTEM_PROMPT } from "./system-prompt";
import Groq from "groq-sdk";

let documents: KnowledgeDoc[] = [];
let embeddings: Record<string, number[]> = {};

export async function initializeKnowledgeBase() {
  documents = await loadAllDocuments();
  buildSearchIndex(documents);
  try {
    embeddings = await loadEmbeddingCache();
  } catch {
    embeddings = {};
  }
  if (Object.keys(embeddings).length === 0) {
    try {
      embeddings = await buildEmbeddingCache(documents);
    } catch {
      embeddings = {};
    }
  }
}

export function getDocuments(): KnowledgeDoc[] {
  return documents;
}

export async function refreshEmbeddings() {
  embeddings = await buildEmbeddingCache(documents);
}

export function detectIntent(query: string): IntentResult {
  const q = query.toLowerCase();
  if (/\b(who|founder|started|created|farhan)\b/.test(q)) {
    return { intent: "founder_query", confidence: 0.9, entities: {} };
  }
  if (/\b(editor|editors|editorial team)\b/.test(q)) {
    return { intent: "editor_query", confidence: 0.9, entities: {} };
  }
  if (/\b(writer|author|writers|authors)\b/.test(q)) {
    return { intent: "writer_query", confidence: 0.9, entities: {} };
  }
  if (/\b(submit|submission|guideline|guidelines|write for|become a writer|pitch)\b/.test(q)) {
    return { intent: "submission_query", confidence: 0.9, entities: {} };
  }
  if (/\b(contact|email|reach|phone|address)\b/.test(q)) {
    return { intent: "contact_query", confidence: 0.9, entities: {} };
  }
  if (/\b(privacy|terms|policy|gdpr|cookie)\b/.test(q)) {
    return { intent: "policy_query", confidence: 0.9, entities: {} };
  }
  if (/\b(recommend|suggest|similar|related|next|read|articles|stories)\b/.test(q)) {
    return { intent: "recommendation_query", confidence: 0.9, entities: {} };
  }
  if (/\b(summarize|summary|about this article|what is|what's)\b/.test(q)) {
    return { intent: "summarize_query", confidence: 0.8, entities: {} };
  }
  if (/\b(trending|popular|newest|latest|recent)\b/.test(q)) {
    return { intent: "trending_query", confidence: 0.9, entities: {} };
  }
  return { intent: "general_query", confidence: 0.5, entities: {} };
}

export function searchDocuments(query: string, limit = 8): SearchResult[] {
  const keywordResults = keywordSearch(query, limit);
  const fulltextResults = fullTextSearch(query, limit);
  const semanticResults = vecSearch(query, documents, embeddings, limit);

  const scored = new Map<string, { doc: SearchResult; scores: number[] }>();

  const add = (doc: SearchResult) => {
    const existing = scored.get(doc.id);
    if (existing) {
      existing.scores.push(doc.score);
    } else {
      scored.set(doc.id, { doc, scores: [doc.score] });
    }
  };

  for (const r of keywordResults) add(r);
  for (const r of fulltextResults) add(r);
  for (const r of semanticResults) add(r);

  const ranked = Array.from(scored.values())
    .map(({ doc, scores }) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const max = Math.max(...scores);
      return { ...doc, score: avg * 0.6 + max * 0.4 };
    })
    .filter((r) => r.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return ranked;
}

export function smartActionsFor(intent: string, doc: KnowledgeDoc | undefined): ActionItem[] {
  if (intent === "submission_query") {
    return [
      { label: "Read Submission Guidelines", href: "https://theinkhome.live/about", action: "navigate" },
      { label: "Become a Writer", href: "https://theinkhome.live/about", action: "navigate" },
    ];
  }
  if (intent === "contact_query") {
    return [
      { label: "Contact Editors", href: "https://theinkhome.live/about", action: "navigate" },
      { label: "Visit Publication", href: "https://theinkhome.live/", action: "navigate" },
    ];
  }
  if (intent === "recommendation_query" || intent === "trending_query") {
    return [
      { label: "Explore All Articles", href: "https://theinkhome.live/3d", action: "navigate" },
      { label: "Bento Archive", href: "https://theinkhome.live/grid", action: "navigate" },
    ];
  }
  if (doc) {
    const url = getDocUrl(doc.path);
    return [
      { label: `Read ${getDocTypeLabel(doc)}`, href: url, action: "navigate" },
      { label: "Share", href: url, action: "copy" },
    ];
  }
  return [
    { label: "Explore Articles", href: "https://theinkhome.live/3d", action: "navigate" },
    { label: "About The Ink Home", href: "https://theinkhome.live/about", action: "navigate" },
  ];
}

function buildContextDocs(docs: SearchResult[]): string {
  return docs
    .map(
      (doc, idx) =>
        `[${idx + 1}] ${getDocTypeLabel(doc)}: ${doc.title}\nType: ${doc.type}\nTags: ${doc.tags.join(", ")}\nURL: ${getDocUrl(doc.path)}\nContent: ${doc.content.slice(0, 2500)}`
    )
    .join("\n\n---\n\n");
}

function suggestRelatedQuestions(query: string, docs: SearchResult[]): string[] {
  const suggestions: string[] = [];
  const q = query.toLowerCase();

  if (docs.some((d) => d.path.startsWith("articles/"))) {
    suggestions.push("Show similar articles");
  }
  if (docs.some((d) => d.path.startsWith("editors/") || d.path.startsWith("writers/"))) {
    suggestions.push("Who are the editors?");
    suggestions.push("How do I become a writer?");
  }
  if (/\b(topic|category|about|theme)\b/.test(q)) {
    suggestions.push("What topics do you accept?");
  }
  if (/\b(ai|artificial intelligence|machine learning)\b/.test(q)) {
    suggestions.push("Recommend stories about AI");
  }
  if (/\b(relationship|love|mental health|happiness)\b/.test(q)) {
    suggestions.push("Recommend stories about relationships");
  }
  if (suggestions.length < 3) {
    suggestions.push("Tell me about The Ink Home");
    suggestions.push("What should I read next?");
    suggestions.push("Show me trending stories");
  }
  return suggestions.slice(0, 4);
}

export async function generateRAGResponse(
  query: string,
  history: ChatMessage[],
  docs: SearchResult[]
): Promise<ChatResponse> {
  const contextDocs = buildContextDocs(docs);
  const intent = detectIntent(query);
  const suggestions = suggestRelatedQuestions(query, docs);
  const actions = smartActionsFor(intent.intent, docs[0] || undefined);

  const historyBlock = history
    .slice(-6)
    .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
    .join("\n");

  const prompt = `${SYSTEM_PROMPT}

## CONTEXT DOCUMENTS

${contextDocs || "No relevant documents found in the knowledge base."}

## CONVERSATION HISTORY

${historyBlock || "No previous conversation."}

## CURRENT USER QUERY

${query}

---

Reminder: Answer ONLY using the context documents. Be concise. Structure your answer as:

### [Title]

[Direct answer in 1-3 sentences]

**Key points**
- ...

**Related Articles**
→ [Title](url)

**Next Steps**
→ Action`;

  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return {
        message: "I couldn't find that information in The Ink Home's knowledge base.",
        sources: docs.slice(0, 3),
        suggestedQuestions: suggestions,
        actions,
      };
    }
    const groq = new Groq({ apiKey });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1024,
    });
    const message = completion.choices?.[0]?.message?.content?.trim() || "I couldn't find that information in The Ink Home's knowledge base.";
    return {
      message,
      sources: docs.slice(0, 3),
      suggestedQuestions: suggestions,
      actions,
    };
  } catch (err) {
    console.error("RAG generation failed:", err);
    return {
      message: "I couldn't find that information in The Ink Home's knowledge base.",
      sources: docs.slice(0, 3),
      suggestedQuestions: suggestions,
      actions,
    };
  }
}
