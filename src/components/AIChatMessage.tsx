import React from 'react';
import { MessageSquare, BookOpen, ExternalLink, ChevronRight } from 'lucide-react';
import { KnowledgeDoc } from '../lib/ai/types';
import { getDocUrl, getDocTypeLabel } from '../lib/ai/knowledge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: KnowledgeDoc[];
  actions?: Array<{ label: string; href?: string; action?: string }>;
  suggestedQuestions?: string[];
  id: string;
}

interface Props {
  message: Message;
  onQuickPrompt: (question: string) => void;
  key?: React.Key;
}

function MarkdownLikeText({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-1 whitespace-pre-wrap">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-white mt-2 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('**') && line.endsWith('**')) return <strong key={i} className="text-white">{line.replace(/\*\*/g, '')}</strong>;
        if (line.startsWith('- ')) return <li key={i} className="ml-3 list-disc">{line.slice(2)}</li>;
        if (/^\d+\./.test(line)) return <li key={i} className="ml-3">{line}</li>;
        if (line.startsWith('→ ')) {
          const parts = line.slice(2);
          return <div key={i} className="flex items-center gap-1 text-[var(--atmo-text)]"><ChevronRight className="w-3 h-3" /> {parts}</div>;
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

export default function AIChatMessage({ message, onQuickPrompt }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[90%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <MessageSquare className="w-3 h-3 text-[var(--atmo-text)]" />
            <span className="text-[9px] font-mono uppercase tracking-widest text-slate-500">Ink AI</span>
          </div>
        )}
        <div className={`rounded-xl px-3 py-2.5 ${
          isUser
            ? 'bg-[var(--atmo-text)] text-black rounded-br-sm'
            : 'bg-white/5 border border-white/10 rounded-bl-sm'
        }`}>
          <MarkdownLikeText text={message.content} />
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.sources.map((source: KnowledgeDoc) => (
              <a
                key={source.id}
                href={getDocUrl(source.path)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-[var(--atmo-text)] transition-colors group"
              >
                <BookOpen className="w-3 h-3" />
                <span className="truncate max-w-[200px] group-hover:text-[var(--atmo-text)]">{source.title}</span>
                <span className="text-[8px] uppercase tracking-wider opacity-60">{getDocTypeLabel(source)}</span>
              </a>
            ))}
          </div>
        )}

        {message.actions && message.actions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.actions.map((action, i) => (
              <a
                key={i}
                href={action.href || '#'}
                onClick={(e) => {
                  if (action.action === 'copy' && action.href) {
                    navigator.clipboard?.writeText(action.href);
                    e.preventDefault();
                  }
                }}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-white/10 bg-white/5 text-[10px] text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                {action.label}
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            ))}
          </div>
        )}

        {message.suggestedQuestions && message.suggestedQuestions.length > 0 && !isUser && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => onQuickPrompt(q)}
                className="px-2.5 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] text-slate-400 hover:bg-[var(--atmo-surface)] hover:text-[var(--atmo-text)] transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
