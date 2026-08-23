import { NextResponse } from 'next/server';
import { summarizeDocument } from '@/lib/gemini';

export const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'text/plain' // Added for sample document
];

export const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const summaryLength = formData.get('summaryLength') || 'medium';
    const promptMode = formData.get('promptMode') || 'standard';

    // Validate file exists
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided. Please upload a document.' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.type}. Please upload a PDF, PNG, JPG, WEBP, or TXT file.` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum size is 4MB.` },
        { status: 400 }
      );
    }

    // Validate summary length
    if (!['short', 'medium', 'long'].includes(summaryLength)) {
      return NextResponse.json(
        { error: 'Invalid summary length. Choose short, medium, or long.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate summary
    const result = await summarizeDocument(buffer, file.type, summaryLength, promptMode);

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      summaryLength,
      id: Date.now().toString(), // Added ID for history tracking
      createdAt: new Date().toISOString(),
      ...result,
    });
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
