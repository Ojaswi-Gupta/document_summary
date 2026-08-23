'use client';

import { useState, useEffect } from 'react';
import { FileText, Zap } from 'lucide-react';

export default function Header() {
  const [requestsLeft, setRequestsLeft] = useState(10);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const updateRateLimit = () => {
      try {
        const usage = JSON.parse(localStorage.getItem('docSummaryUsage') || '{"count": 0, "date": ""}');
        const today = new Date().toDateString();
        
        if (usage.date !== today) {
          localStorage.setItem('docSummaryUsage', JSON.stringify({ count: 0, date: today }));
          setRequestsLeft(10);
        } else {
          setRequestsLeft(Math.max(0, 10 - usage.count));
        }
      } catch (e) {
        setRequestsLeft(10);
      }
    };

    updateRateLimit();
    window.addEventListener('rateLimitUpdate', updateRateLimit);
    return () => window.removeEventListener('rateLimitUpdate', updateRateLimit);
  }, []);

  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">DocSummary AI</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Intelligent document extraction & summarization</p>
          </div>
        </div>
        
        {isClient && (
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full">
            <Zap className={`h-4 w-4 ${requestsLeft > 0 ? 'text-amber-500' : 'text-gray-400'}`} />
            <span className="text-xs font-medium text-slate-700">
              {requestsLeft} <span className="hidden sm:inline">free requests left today</span>
              <span className="sm:hidden">left</span>
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
