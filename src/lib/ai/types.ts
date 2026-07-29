export interface KnowledgeDoc {
  id: string;
  type: string;
  title: string;
  path: string;
  content: string;
  tags: string[];
  metadata: Record<string, any>;
}

export interface SearchResult extends KnowledgeDoc {
  score: number;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  sources?: KnowledgeDoc[];
}

export interface ChatRequestBody {
  messages: ChatMessage[];
  sessionId?: string;
}

export interface ChatResponse {
  message: string;
  sources: KnowledgeDoc[];
  suggestedQuestions: string[];
  actions: ActionItem[];
}

export interface ActionItem {
  label: string;
  href?: string;
  action?: string;
}

export interface IntentResult {
  intent: string;
  confidence: number;
  entities: Record<string, string>;
}
