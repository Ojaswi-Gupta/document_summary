'use client';

import { FileText } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">DocSummary AI</h1>
          <p className="text-xs text-gray-500 hidden sm:block">Upload any document, get smart summaries instantly</p>
        </div>
      </div>
    </header>
  );
}
