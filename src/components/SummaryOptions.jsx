'use client';

import { AlignLeft, AlignCenter, AlignJustify } from 'lucide-react';

const options = [
  {
    value: 'short',
    label: 'Short',
    description: '2-3 sentences',
    icon: AlignLeft,
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Detailed paragraph',
    icon: AlignCenter,
  },
  {
    value: 'long',
    label: 'Long',
    description: 'Comprehensive',
    icon: AlignJustify,
  },
];

export default function SummaryOptions({ selected, onSelect, disabled }) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Summary Length
      </label>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              disabled={disabled}
              className={`flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <Icon className={`h-5 w-5 ${isSelected ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-medium text-sm">{opt.label}</span>
              <span className="text-xs text-gray-400 hidden sm:block">{opt.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
