'use client';

import { Loader2, Brain, FileSearch } from 'lucide-react';
import { useState, useEffect } from 'react';

const stages = [
  { icon: FileSearch, text: 'Reading your document...', color: 'text-blue-500' },
  { icon: Brain, text: 'Analyzing content with AI...', color: 'text-purple-500' },
  { icon: Loader2, text: 'Generating smart summary...', color: 'text-green-500' },
];

export default function LoadingSpinner() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const stage = stages[stageIndex];
  const Icon = stage.icon;

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 sm:py-16">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-20" />
        <div className="relative p-4 bg-white rounded-full shadow-lg">
          <Icon className={`h-8 w-8 ${stage.color} ${Icon === Loader2 ? 'animate-spin' : 'animate-pulse'}`} />
        </div>
      </div>
      <p className="mt-6 text-gray-700 font-medium text-lg animate-pulse">{stage.text}</p>
      <div className="mt-4 flex gap-1.5">
        {stages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
              i <= stageIndex ? 'bg-blue-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
