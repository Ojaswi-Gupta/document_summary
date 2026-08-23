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
  const [promptMode, setPromptMode] = useState('standard');
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
      formData.append('promptMode', promptMode);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col relative overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[10%] right-[10%] w-[500px] h-[500px] bg-purple-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <Header onOpenHistory={() => setShowHistory(true)} historyCount={history.length} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        
        <div className="space-y-8">
          {/* Hero Section */}
          {status === 'idle' && !result && (
            <div className="text-center sm:text-left mb-6 animate-fade-in-up">
              <span className="inline-block py-1 px-3 rounded-full bg-slate-800 text-white text-xs font-semibold tracking-wide mb-4 shadow-md border border-slate-700">
                ✨ Advanced AI Summarizer
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 tracking-tight pb-1">
                Summarize Any Document
              </h2>
              <p className="text-slate-600 mt-3 text-base sm:text-lg max-w-xl">
                Upload a PDF or image. Our AI extracts the text, generates a smart summary, highlights key points, and suggests improvements.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center sm:justify-start gap-4">
                <button 
                  onClick={handleSampleDocument}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-blue-50 text-blue-700 font-medium rounded-xl border border-blue-200 transition-all text-sm shadow-sm hover:shadow"
                >
                  <FileText className="h-4 w-4" />
                  Try with a Sample Document
                </button>
              </div>
            </div>
          )}

          {/* Upload + Options Section */}
          {status !== 'success' && (
            <div className="space-y-8 bg-white/70 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white animate-fade-in-up animation-delay-200">
              <FileUpload
                file={file}
                onFileSelect={handleFileSelect}
                onFileClear={handleFileClear}
                disabled={isLoading}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SummaryOptions
                  selected={summaryLength}
                  onSelect={setSummaryLength}
                  disabled={isLoading}
                />

                {/* Quick Prompts */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick AI Action (Optional)
                  </label>
                  <div className="relative">
                    <select
                      value={promptMode}
                      onChange={(e) => setPromptMode(e.target.value)}
                      className="w-full appearance-none bg-white border border-slate-200 text-slate-700 py-3.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer text-sm font-medium shadow-sm hover:border-slate-300"
                    >
                      <option value="standard">Standard Summary</option>
                      <option value="eli5">Explain Like I'm 5 (ELI5)</option>
                      <option value="action">Action Items Only</option>
                      <option value="financials">Extract Numbers & Metrics</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              {file && !isLoading && (
                <button
                  onClick={handleSubmit}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 text-lg hover:-translate-y-0.5"
                >
                  <Sparkles className="h-5 w-5" />
                  Generate AI Summary
                </button>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-white">
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

        {/* Bento Box (How it works) */}
        {status === 'idle' && !result && (
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up animation-delay-400">
            
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl overflow-hidden relative group">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-700">
                <Brain className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                  <Zap className="text-amber-300 w-6 h-6" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">Advanced Multimodal AI</h3>
                <p className="text-slate-300 max-w-md text-sm sm:text-base leading-relaxed">
                  Our multimodal AI engine natively parses PDFs and applies OCR to images in a single, lightning-fast pass. No legacy pipelines required.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between group hover:shadow-md hover:border-emerald-200 transition-all">
              <div>
                <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="text-emerald-500 w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Privacy First</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Your documents are processed securely in real-time. History is saved locally on your device.</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm group hover:shadow-md hover:border-blue-200 transition-all">
              <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText className="text-blue-500 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Any Format</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Drag and drop PDFs, scanned PNGs, or raw text files. The AI extracts it seamlessly.</p>
            </div>

            <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm group hover:shadow-md transition-all flex items-center justify-between overflow-hidden relative">
              <div className="relative z-10 max-w-md">
                <h3 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Instant Actionable Insights</h3>
                <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                  Not just summaries. Get automatically extracted key points and improvement suggestions directly formatted in JSON for perfect frontend integration.
                </p>
              </div>
              {/* Decorative JSON block */}
              <div className="hidden sm:block absolute right-[-20px] top-[-10px] opacity-[0.03] transform rotate-12 bg-slate-900 text-white p-6 rounded-2xl font-mono text-sm pointer-events-none group-hover:rotate-6 transition-transform duration-700">
                <pre>{`{\n  "summary": "...",\n  "keyPoints": [\n    "Item 1",\n    "Item 2"\n  ]\n}`}</pre>
              </div>
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
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
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
