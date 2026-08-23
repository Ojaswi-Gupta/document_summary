'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="w-full rounded-xl border-2 border-red-200 bg-red-50 p-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="h-6 w-6 text-red-500 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-red-800">Something went wrong</h3>
          <p className="text-red-600 text-sm mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
