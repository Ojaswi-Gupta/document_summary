'use client';

import { useState } from 'react';
import { Copy, Check, FileText, Lightbulb, ListChecks, ChevronDown, ChevronUp, ScrollText, BarChart2 } from 'lucide-react';

export default function SummaryDisplay({ data }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'extracted'
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    keyPoints: true,
    suggestions: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCopy = async () => {
    const textToCopy = activeTab === 'summary' 
      ? `Summary:\n${data.summary}\n\nKey Points:\n${data.keyPoints?.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nImprovement Suggestions:\n${data.improvementSuggestions?.map((s, i) => `${i + 1}. ${s}`).join('\n')}`
      : data.extractedText;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = textToCopy;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wordCount = data.extractedText ? data.extractedText.trim().split(/\s+/).length : 0;
  const summaryWordCount = data.summary ? data.summary.trim().split(/\s+/).length : 0;
  const reduction = wordCount > 0 ? Math.round((1 - (summaryWordCount / wordCount)) * 100) : 0;

  return (
    <div className="w-full space-y-6">
      {/* Header and Stats */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Document Analysis</h2>
            <p className="text-sm text-gray-500 mt-1 font-medium">
              {data.fileName} • <span className="capitalize">{data.summaryLength}</span> summary
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg font-medium border border-blue-100">
              <BarChart2 className="h-4 w-4" />
              <span>{reduction}% reduction</span>
            </div>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              {copied ? <><Check className="h-4 w-4 text-green-400" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy {activeTab === 'summary' ? 'Summary' : 'Text'}</>}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b border-gray-200 pb-px">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'summary' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Smart Summary
            {activeTab === 'summary' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />}
          </button>
          <button
            onClick={() => setActiveTab('extracted')}
            className={`px-4 py-2 font-medium text-sm transition-colors relative flex items-center gap-2 ${activeTab === 'extracted' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Raw Extracted Text
            {activeTab === 'extracted' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />}
          </button>
        </div>
      </div>

      {activeTab === 'summary' ? (
        <div className="space-y-4">
          {/* Summary Section */}
          <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <button onClick={() => toggleSection('summary')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors focus:outline-none">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><FileText className="h-4 w-4" /></div>
                <span className="font-semibold text-gray-900">Summary</span>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{summaryWordCount} words</span>
              </div>
              {expandedSections.summary ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
            </button>
            {expandedSections.summary && (
              <div className="px-5 pb-5">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-[15px]">{data.summary}</p>
              </div>
            )}
          </div>

          {/* Key Points Section */}
          {data.keyPoints?.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button onClick={() => toggleSection('keyPoints')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors focus:outline-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg text-green-600"><ListChecks className="h-4 w-4" /></div>
                  <span className="font-semibold text-gray-900">Key Points</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">{data.keyPoints.length}</span>
                </div>
                {expandedSections.keyPoints ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.keyPoints && (
                <div className="px-5 pb-5">
                  <ul className="space-y-3">
                    {data.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-green-50 text-green-700 border border-green-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{index + 1}</span>
                        <span className="text-gray-700 text-[15px] leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Improvement Suggestions Section */}
          {data.improvementSuggestions?.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <button onClick={() => toggleSection('suggestions')} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors focus:outline-none">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><Lightbulb className="h-4 w-4" /></div>
                  <span className="font-semibold text-gray-900">Improvement Suggestions</span>
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{data.improvementSuggestions.length}</span>
                </div>
                {expandedSections.suggestions ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
              </button>
              {expandedSections.suggestions && (
                <div className="px-5 pb-5">
                  <ul className="space-y-3">
                    {data.improvementSuggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-50 text-amber-700 border border-amber-200 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">{index + 1}</span>
                        <span className="text-gray-700 text-[15px] leading-relaxed">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Extracted Text Tab */
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="bg-gray-50 border-b border-gray-200 p-3 px-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600 font-medium text-sm">
              <ScrollText className="h-4 w-4" />
              Raw Extracted Text
            </div>
            <span className="text-xs text-gray-500 font-medium">{wordCount} words</span>
          </div>
          <div className="p-5 max-h-[500px] overflow-y-auto">
            {data.extractedText ? (
              <pre className="text-[14px] text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                {data.extractedText}
              </pre>
            ) : (
              <p className="text-gray-500 italic text-center py-8">No text could be extracted from this document.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
