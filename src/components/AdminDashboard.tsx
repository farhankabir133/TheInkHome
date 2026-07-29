import React, { useState, useEffect } from 'react';
import { RefreshCw, Trash2, FileJson, Activity, Database, HardDrive } from 'lucide-react';

interface Stats {
  documents: number;
  embeddings: number;
  lastCrawled: string | null;
}

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [actionLog, setActionLog] = useState<string[]>([]);
  const [stats, setStats] = useState<Stats>({ documents: 0, embeddings: 0, lastCrawled: null });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const apiBase = (import.meta as any).env?.VITE_API_BASE?.replace(/\/+$/g, '') || '';
      const res = await fetch(`${apiBase}/api/ai/search?q=the&limit=1`);
      const data = await res.json();
      setStats(prev => ({ ...prev, documents: data.count || 0 }));
    } catch {
      // offline
    }
  }

  async function handleAction(action: string) {
    setLoading(true);
    setActionLog(prev => [`${new Date().toLocaleTimeString()} - Starting ${action}...`, ...prev]);
    try {
      const apiBase = (import.meta as any).env?.VITE_API_BASE?.replace(/\/+$/g, '') || '';
      const res = await fetch(`${apiBase}/api/ai/crawl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      setActionLog(prev => [`${new Date().toLocaleTimeString()} - ${action}: ${data.message || data.error}`, ...prev]);
      if (data.stats) {
        setStats(data.stats);
      }
    } catch {
      setActionLog(prev => [`${new Date().toLocaleTimeString()} - ${action} failed`, ...prev]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--atmo-text)]" />
            <h2 className="font-mono text-sm uppercase tracking-widest font-bold text-white">AI Knowledge Admin</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
            <span className="text-slate-400 text-xs">Close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-white/10 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Database className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Documents</span>
              </div>
              <p className="text-xl font-bold text-white font-mono">{stats.documents}</p>
            </div>
            <div className="p-4 border border-white/10 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <HardDrive className="w-3.5 h-3.5" />
                <span className="text-[10px] font-mono uppercase tracking-widest">Embeddings</span>
              </div>
              <p className="text-xl font-bold text-white font-mono">{stats.embeddings}</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Actions</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => handleAction('crawl')} disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-slate-300 transition-colors disabled:opacity-50 cursor-pointer">
                <RefreshCw className="w-4 h-4" /> Re-crawl Website
              </button>
              <button onClick={() => handleAction('embeddings')} disabled={loading}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-white/10 bg-white/5 hover:bg-white/10 rounded-xl text-xs text-slate-300 transition-colors disabled:opacity-50 cursor-pointer">
                <FileJson className="w-4 h-4" /> Rebuild Embeddings
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Activity Log</p>
            <div className="h-40 overflow-y-auto custom-scrollbar border border-white/5 bg-black/40 rounded-xl p-3">
              {actionLog.length === 0 ? (
                <p className="text-[10px] text-slate-600 font-mono">No activity yet.</p>
              ) : (
                actionLog.map((log, i) => (
                  <p key={i} className="text-[10px] font-mono text-slate-400 py-0.5 border-b border-white/5 last:border-0">{log}</p>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
