'use client';

import { useState, useEffect } from 'react';
import { FileText, Zap, Clock } from 'lucide-react';

import Link from 'next/link';

export default function Header({ onOpenHistory, historyCount = 0, onHomeClick }) {
  const [requestsLeft, setRequestsLeft] = useState(50);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateRateLimit = () => {
      try {
        const usage = JSON.parse(localStorage.getItem('docSummaryUsage') || '{"count": 0, "date": ""}');
        const today = new Date().toDateString();
        
        if (usage.date !== today) {
          localStorage.setItem('docSummaryUsage', JSON.stringify({ count: 0, date: today }));
          setRequestsLeft(50);
        } else {
          setRequestsLeft(Math.max(0, 50 - usage.count));
        }
      } catch (e) {
        setRequestsLeft(50);
      }
    };

    updateRateLimit();
    window.addEventListener('rateLimitUpdate', updateRateLimit);
    return () => window.removeEventListener('rateLimitUpdate', updateRateLimit);
  }, []);

  return (
    <header className="w-full border-b border-white/50 bg-white/60 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.02)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        
        <Link 
          href="/" 
          onClick={(e) => {
            if (onHomeClick) {
              e.preventDefault();
              onHomeClick();
            }
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm group-hover:bg-blue-700 transition-colors">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight group-hover:text-blue-700 transition-colors">DocSummary AI</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Intelligent document extraction & summarization</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-2 sm:gap-3">
          {isClient && onOpenHistory && (
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
              {historyCount > 0 && (
                <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">{historyCount}</span>
              )}
            </button>
          )}

          {isClient && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
              <Zap className={`h-4 w-4 ${requestsLeft > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
              <span className="text-xs font-medium text-slate-700">
                {requestsLeft} <span className="hidden sm:inline">requests left</span>
                <span className="sm:hidden">left</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
