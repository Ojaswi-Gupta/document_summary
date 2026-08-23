'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import SummaryOptions from '@/components/SummaryOptions';
import SummaryDisplay from '@/components/SummaryDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Sparkles, Clock, ArrowRight, FileText, X, Zap, Brain, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history on mount
  useEffect(() => {
    try {
      const savedHistory = JSON.parse(localStorage.getItem('docSummaryHistory') || '[]');
      setHistory(savedHistory.slice(0, 5)); // Keep only last 5
    } catch (e) {
      console.error('Failed to load history');
    }
  }, []);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setStatus('idle');
    setResult(null);
    setError('');
  };

  const handleFileClear = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
    setError('');
  };

  const handleSampleDocument = () => {
    const sampleText = "The impact of Artificial Intelligence on modern software development is profound. Generative AI models are now capable of understanding vast amounts of unstructured data, including raw text and images, and converting them into actionable insights. Historically, developers had to rely on separate optical character recognition (OCR) engines like Tesseract to extract text from scanned documents, followed by specialized NLP models to summarize that text. Today, multimodal Large Language Models (LLMs) can perform both text extraction and summarization in a single pass. This not only reduces the complexity of software architecture but also minimizes points of failure and dramatically speeds up processing times. However, this shift requires developers to become proficient in prompt engineering and API integration, ensuring that AI responses are strictly formatted—such as in JSON—for seamless frontend integration. As we look to the future, AI will continue to abstract away boilerplate coding tasks, allowing engineers to focus on architecture, user experience, and solving complex business problems.";
    
    // Create a mock file object for the frontend to handle
    const mockFile = new File([sampleText], "AI_in_Software_Development.txt", { type: "text/plain" });
    handleFileSelect(mockFile);
  };

  const loadFromHistory = (historicItem) => {
    setResult(historicItem);
    setStatus('success');
    setFile(null);
    setShowHistory(false);
  };

  const handleSubmit = async () => {
    if (!file) return;

    // Check rate limit first
    try {
      const usage = JSON.parse(localStorage.getItem('docSummaryUsage') || '{"count": 0, "date": ""}');
      const today = new Date().toDateString();
      if (usage.date === today && usage.count >= 10) {
        setError("You've reached the free limit of 10 requests for today. Please try again tomorrow.");
        setStatus('error');
        return;
      }
    } catch (e) { /* ignore */ }

    setStatus('loading');
    setResult(null);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('summaryLength', summaryLength);

      const response = await fetch('/api/summarize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary.');
      }

      setResult(data);
      setStatus('success');

      // Update Rate Limit
      try {
        const usage = JSON.parse(localStorage.getItem('docSummaryUsage') || '{"count": 0, "date": ""}');
        const today = new Date().toDateString();
        const newCount = usage.date === today ? usage.count + 1 : 1;
        localStorage.setItem('docSummaryUsage', JSON.stringify({ count: newCount, date: today }));
        window.dispatchEvent(new CustomEvent('rateLimitUpdate', { detail: 10 - newCount }));
      } catch (e) { /* ignore */ }

      // Save to History
      try {
        const newHistory = [data, ...history].slice(0, 5);
        setHistory(newHistory);
        localStorage.setItem('docSummaryHistory', JSON.stringify(newHistory));
      } catch (e) { /* ignore */ }

    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setStatus('error');
    }
  };

  const isLoading = status === 'loading';

  const features = [
    { icon: Zap, title: "Lightning Fast", desc: "Extracts text and summarizes in seconds.", iconBg: "bg-amber-50", iconColor: "text-amber-500" },
    { icon: Brain, title: "Multimodal AI", desc: "Natively understands both PDFs and images.", iconBg: "bg-purple-50", iconColor: "text-purple-500" },
    { icon: ShieldCheck, title: "Privacy First", desc: "Summaries are generated securely.", iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <Header onOpenHistory={() => setShowHistory(true)} historyCount={history.length} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        
        <div className="space-y-8">
          {/* Hero Section */}
          {status === 'idle' && !result && (
            <div className="text-center sm:text-left mb-6 animate-fade-in-up">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Summarize Any Document
              </h2>
              <p className="text-slate-600 mt-3 text-base sm:text-lg max-w-xl">
                Upload a PDF or image. Our AI extracts the text, generates a smart summary, highlights key points, and suggests improvements.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <button 
                  onClick={handleSampleDocument}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg border border-blue-200 transition-colors text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Try with a Sample Document
                </button>
              </div>
            </div>
          )}

          {/* Upload + Options Section */}
          {status !== 'success' && (
            <div className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200 animate-fade-in-up animation-delay-200">
              <FileUpload
                file={file}
                onFileSelect={handleFileSelect}
                onFileClear={handleFileClear}
                disabled={isLoading}
              />

              <SummaryOptions
                selected={summaryLength}
                onSelect={setSummaryLength}
                disabled={isLoading}
              />

              {/* Generate Button */}
              {file && !isLoading && (
                <button
                  onClick={handleSubmit}
                  className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 text-lg"
                >
                  <Sparkles className="h-5 w-5" />
                  Generate Summary
                </button>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <LoadingSpinner />
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <ErrorMessage message={error} onRetry={handleSubmit} />
          )}

          {/* Success State */}
          {status === 'success' && result && (
            <div className="space-y-6">
              <SummaryDisplay data={result} />

              <button
                onClick={() => {
                  setFile(null);
                  setStatus('idle');
                  setResult(null);
                  setError('');
                }}
                className="w-full py-4 px-6 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl border-2 border-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <ArrowRight className="h-5 w-5" />
                Summarize Another Document
              </button>
            </div>
          )}
        </div>

        {/* Features Carousel (Marquee) */}
        {status === 'idle' && !result && (
          <div className="mt-20 w-full max-w-full overflow-hidden relative pb-4 animate-fade-in-up animation-delay-400">
            {/* Fading Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>
            
            <div className="animate-marquee-infinite">
              {[...features, ...features, ...features].map((feat, i) => (
                <div key={i} className="inline-flex items-center gap-4 bg-white border border-slate-200 px-5 py-4 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.02)] mx-3 w-[280px] sm:w-[320px] flex-shrink-0 hover:border-blue-200 hover:shadow-md transition-all group cursor-default">
                  <div className={`p-3 rounded-xl ${feat.iconBg} ${feat.iconColor} shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <feat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm tracking-tight">{feat.title}</h4>
                    <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-500" />
                <h3 className="font-semibold text-slate-800">Recent Summaries</h3>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto bg-slate-50/50">
              {history.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                    <Clock className="h-5 w-5 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">No history yet</p>
                  <p className="text-xs text-slate-400 mt-1">Your recent summaries will appear here.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {history.map((item, index) => (
                    <li key={item.id || index}>
                      <button
                        onClick={() => loadFromHistory(item)}
                        className="w-full text-left p-4 bg-white rounded-xl transition-all border border-slate-200 hover:border-blue-300 group flex flex-col gap-2 shadow-sm hover:shadow"
                      >
                        <span className="text-sm font-semibold text-slate-700 truncate block w-full group-hover:text-blue-600 transition-colors">
                          {item.fileName}
                        </span>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-medium text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs font-medium bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md capitalize">
                            {item.summaryLength}
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full bg-slate-950 mt-auto relative overflow-hidden">
        {/* Subtle glowing top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            
            <div className="flex flex-col items-center sm:items-start gap-1.5">
              <span className="text-slate-400 text-sm font-semibold tracking-wide">
                DocSummary AI © {new Date().getFullYear()}
              </span>
              <span className="text-slate-500 text-xs sm:text-sm">
                Designed & Built by <strong className="text-slate-200 font-semibold tracking-wide">Ojaswi Gupta</strong>
              </span>
            </div>

            <a
              href="https://github.com/Ojaswi-Gupta/document_summary"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full transition-all duration-300 text-sm font-medium border border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-md"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-5 w-5 group-hover:scale-110 transition-transform duration-300">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              View Source Code
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
