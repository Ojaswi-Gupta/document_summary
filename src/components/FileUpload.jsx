'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, FileImage, File } from 'lucide-react';

const MAX_SIZE = 4 * 1024 * 1024; // 4MB

export default function FileUpload({ file, onFileSelect, onFileClear, disabled }) {
  const onDrop = useCallback(
    (acceptedFiles, rejections) => {
      if (rejections.length > 0) {
        const err = rejections[0].errors[0];
        if (err.code === 'file-too-large') {
          alert('File is too large. Maximum size is 4MB.');
        } else if (err.code === 'file-invalid-type') {
          alert('Invalid file type. Please upload a PDF, PNG, JPG, WEBP, or TXT file.');
        }
        return;
      }
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'text/plain': ['.txt']
    },
    maxSize: MAX_SIZE,
    multiple: false,
    disabled,
  });

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const getFileIcon = (type) => {
    if (type === 'application/pdf') return <FileText className="h-8 w-8 text-red-500" />;
    if (type?.startsWith('image/')) return <FileImage className="h-8 w-8 text-blue-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  if (file) {
    return (
      <div className="w-full rounded-xl border-2 border-green-200 bg-green-50 p-4 sm:p-6 shadow-sm transition-all hover:shadow-md">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              {getFileIcon(file.type)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{file.name}</p>
              <p className="text-sm text-gray-500 font-medium mt-0.5">
                {formatSize(file.size)} • {(file.type?.split('/')[1] || 'UNKNOWN').toUpperCase()}
              </p>
            </div>
          </div>
          {!disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileClear();
              }}
              className="p-2 rounded-full hover:bg-green-100 text-gray-400 hover:text-red-500 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label="Remove file"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50/80 scale-[1.02] shadow-inner'
          : 'border-slate-300 bg-slate-50/50 hover:border-blue-400 hover:bg-blue-50/50 hover:shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
        <UploadCloud
          className={`h-8 w-8 transition-colors ${
            isDragActive ? 'text-blue-500' : 'text-slate-400'
          }`}
        />
      </div>
      {isDragActive ? (
        <p className="text-blue-600 font-semibold text-lg">Drop your file here...</p>
      ) : (
        <>
          <p className="text-slate-700 font-semibold text-base sm:text-lg">
            Drag & drop your document here
          </p>
          <p className="text-slate-500 mt-1.5 text-sm font-medium">or click to browse files</p>
          <p className="text-slate-400 mt-4 text-xs font-medium uppercase tracking-wider">
            Supports PDF, PNG, JPG, WEBP, TXT • Max 4MB
          </p>
        </>
      )}
    </div>
  );
}
