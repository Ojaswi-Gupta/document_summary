import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

const SUMMARY_PROMPTS = {
  short: `You are a professional document analyst. Analyze the provided document and return a response in the following JSON format ONLY (no markdown code fences, just raw JSON):
{
  "summary": "A concise 2-3 sentence summary capturing the core message.",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
  "improvementSuggestions": ["Suggestion 1", "Suggestion 2"],
  "extractedText": "The exact raw text extracted from the document."
}

Rules:
- Summary must be 2-3 sentences maximum
- Include 3-5 key points
- Include 2-3 improvement suggestions for the document (e.g., clarity, structure, missing information)
- 'extractedText' should contain the full text you read from the document.
- Respond ONLY with valid JSON, no other text`,

  medium: `You are a professional document analyst. Analyze the provided document and return a response in the following JSON format ONLY (no markdown code fences, just raw JSON):
{
  "summary": "A detailed paragraph summary covering all major themes and conclusions.",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5"],
  "improvementSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"],
  "extractedText": "The exact raw text extracted from the document."
}

Rules:
- Summary should be a detailed paragraph (4-6 sentences)
- Include 5-7 key points
- Include 3-4 improvement suggestions for the document
- 'extractedText' should contain the full text you read from the document.
- Respond ONLY with valid JSON, no other text`,

  long: `You are a professional document analyst. Analyze the provided document and return a response in the following JSON format ONLY (no markdown code fences, just raw JSON):
{
  "summary": "A comprehensive multi-paragraph summary covering all sections, arguments, data, and conclusions in detail.",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3", "Key point 4", "Key point 5", "Key point 6", "Key point 7"],
  "improvementSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3", "Suggestion 4"],
  "extractedText": "The exact raw text extracted from the document."
}

Rules:
- Summary should be comprehensive (2-3 paragraphs)
- Include 7-10 key points
- Include 4-5 improvement suggestions for the document
- 'extractedText' should contain the full text you read from the document.
- Respond ONLY with valid JSON, no other text`
};

export async function summarizeDocument(fileBuffer, mimeType, summaryLength = 'medium', promptMode = 'standard') {
  let prompt = SUMMARY_PROMPTS[summaryLength] || SUMMARY_PROMPTS.medium;

  if (promptMode === 'eli5') {
    prompt += '\n\nCRITICAL INSTRUCTION: You must explain the summary extremely simply, as if you are talking to a 5-year-old child.';
  } else if (promptMode === 'action') {
    prompt += '\n\nCRITICAL INSTRUCTION: Strictly focus the summary and key points on extracting actionable tasks, to-dos, and next steps.';
  } else if (promptMode === 'financials') {
    prompt += '\n\nCRITICAL INSTRUCTION: Strictly focus the summary and key points on extracting numbers, metrics, and financial data.';
  }

  const base64Data = fileBuffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        prompt,
      ],
    });

    const text = response.text;
    
    // Try to parse as JSON, handle cases where model wraps in code fences
    let cleanText = text.trim();
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    }
    
    const parsed = JSON.parse(cleanText);
    
    return {
      summary: parsed.summary || 'No summary generated.',
      keyPoints: parsed.keyPoints || [],
      improvementSuggestions: parsed.improvementSuggestions || [],
      extractedText: parsed.extractedText || 'No text could be extracted.',
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse AI response. Please try again.');
    }
    
    if (error.message?.includes('API key')) {
      throw new Error('Invalid API key. Please check your configuration.');
    }
    
    throw new Error(error.message || 'Failed to generate summary. Please try again.');
  }
}
