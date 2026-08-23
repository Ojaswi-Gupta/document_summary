'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X, FileImage } from 'lucide-react';

const MAX_SIZE = 4 * 1024 * 1024; // 4MB

export default function FileUpload({ file, onFileSelect, onFileClear, disabled }) {
  const onDrop = useCallback(
    (acceptedFiles, rejections) => {
      if (rejections.length > 0) {
        const err = rejections[0].errors[0];
        if (err.code === 'file-too-large') {
          alert('File is too large. Maximum size is 4MB.');
        } else if (err.code === 'file-invalid-type') {
          alert('Invalid file type. Please upload a PDF, PNG, JPG, or WEBP file.');
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
    return <FileImage className="h-8 w-8 text-blue-500" />;
  };

  if (file) {
    return (
      <div className="w-full rounded-xl border-2 border-green-200 bg-green-50 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {getFileIcon(file.type)}
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{file.name}</p>
              <p className="text-sm text-gray-500">
                {formatSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
              </p>
            </div>
          </div>
          {!disabled && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFileClear();
              }}
              className="p-1.5 rounded-lg hover:bg-green-100 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
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
      className={`w-full rounded-xl border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? 'border-blue-500 bg-blue-50 scale-[1.02]'
          : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      <UploadCloud
        className={`mx-auto h-12 w-12 mb-4 transition-colors ${
          isDragActive ? 'text-blue-500' : 'text-gray-400'
        }`}
      />
      {isDragActive ? (
        <p className="text-blue-600 font-semibold text-lg">Drop your file here...</p>
      ) : (
        <>
          <p className="text-gray-700 font-semibold text-base sm:text-lg">
            Drag & drop your document here
          </p>
          <p className="text-gray-500 mt-1 text-sm">or click to browse files</p>
          <p className="text-gray-400 mt-3 text-xs">
            Supports PDF, PNG, JPG, WEBP • Max 4MB
          </p>
        </>
      )}
    </div>
  );
}
