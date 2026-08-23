'use client';

import { useState } from 'react';
import { Copy, Check, FileText, Lightbulb, ListChecks, ChevronDown, ChevronUp } from 'lucide-react';

export default function SummaryDisplay({ data }) {
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    keyPoints: true,
    suggestions: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCopy = async () => {
    const text = `Summary:\n${data.summary}\n\nKey Points:\n${data.keyPoints
      .map((p, i) => `${i + 1}. ${p}`)
      .join('\n')}\n\nImprovement Suggestions:\n${data.improvementSuggestions
      .map((s, i) => `${i + 1}. ${s}`)
      .join('\n')}`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header with file info and copy button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Document Summary</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {data.fileName} • {data.summaryLength} summary
          </p>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm text-gray-600 transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Summary Section */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <button
          onClick={() => toggleSection('summary')}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Summary</span>
          </div>
          {expandedSections.summary ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </button>
        {expandedSections.summary && (
          <div className="px-4 pb-4">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.summary}</p>
          </div>
        )}
      </div>

      {/* Key Points Section */}
      {data.keyPoints?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <button
            onClick={() => toggleSection('keyPoints')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ListChecks className="h-4 w-4 text-green-600" />
              </div>
              <span className="font-semibold text-gray-900">Key Points</span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {data.keyPoints.length}
              </span>
            </div>
            {expandedSections.keyPoints ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
          {expandedSections.keyPoints && (
            <div className="px-4 pb-4">
              <ul className="space-y-2">
                {data.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Improvement Suggestions Section */}
      {data.improvementSuggestions?.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <button
            onClick={() => toggleSection('suggestions')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Lightbulb className="h-4 w-4 text-amber-600" />
              </div>
              <span className="font-semibold text-gray-900">Improvement Suggestions</span>
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                {data.improvementSuggestions.length}
              </span>
            </div>
            {expandedSections.suggestions ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>
          {expandedSections.suggestions && (
            <div className="px-4 pb-4">
              <ul className="space-y-2">
                {data.improvementSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
