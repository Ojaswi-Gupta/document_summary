'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import SummaryOptions from '@/components/SummaryOptions';
import SummaryDisplay from '@/components/SummaryDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [summaryLength, setSummaryLength] = useState('medium');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

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

  const handleSubmit = async () => {
    if (!file) return;

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
    } catch (err) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setStatus('error');
    }
  };

  const handleRetry = () => {
    handleSubmit();
  };

  const handleNewDocument = () => {
    setFile(null);
    setStatus('idle');
    setResult(null);
    setError('');
    setSummaryLength('medium');
  };

  const isLoading = status === 'loading';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Hero Section - only show when idle */}
        {status === 'idle' && !result && (
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Summarize Any Document
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base max-w-lg mx-auto">
              Upload a PDF or image of a document. Our AI will extract text, generate a
              smart summary, highlight key points, and suggest improvements.
            </p>
          </div>
        )}

        {/* Upload + Options Section */}
        {status !== 'success' && (
          <div className="space-y-6">
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
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300"
              >
                <Sparkles className="h-5 w-5" />
                Generate Summary
              </button>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && <LoadingSpinner />}

        {/* Error State */}
        {status === 'error' && (
          <div className="mt-6">
            <ErrorMessage message={error} onRetry={handleRetry} />
          </div>
        )}

        {/* Success State */}
        {status === 'success' && result && (
          <div className="space-y-6">
            <SummaryDisplay data={result} />

            <button
              onClick={handleNewDocument}
              className="w-full py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Summarize Another Document
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-gray-400 pb-8">
          <p>
            Powered by Google Gemini AI \u2022 Built with Next.js & Tailwind CSS
          </p>
        </footer>
      </main>
    </div>
  );
}
