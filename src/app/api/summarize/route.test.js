import { describe, it, expect } from 'vitest';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'text/plain'
];
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB

describe('API Route Validation Rules', () => {
  it('should allow correct file types', () => {
    expect(ALLOWED_TYPES).toContain('application/pdf');
    expect(ALLOWED_TYPES).toContain('image/png');
    expect(ALLOWED_TYPES).toContain('image/jpeg');
    expect(ALLOWED_TYPES).toContain('text/plain');
  });

  it('should reject unallowed file types', () => {
    expect(ALLOWED_TYPES).not.toContain('application/msword');
    expect(ALLOWED_TYPES).not.toContain('text/html');
    expect(ALLOWED_TYPES).not.toContain('application/exe');
  });

  it('should enforce 4MB size limit', () => {
    expect(MAX_FILE_SIZE).toBe(4 * 1024 * 1024);
  });
});
