import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { message, documentText, history } = await request.json();

    if (!message || !documentText) {
      return NextResponse.json({ error: 'Message and document text are required' }, { status: 400 });
    }

    let prompt = `You are a helpful AI assistant answering questions about a provided document. 
CRITICAL INSTRUCTIONS:
1. Answer concisely and accurately based ONLY on the provided document text.
2. Structure your answers using clear bullet points whenever possible to make them easy to read.
3. Do NOT format your response as JSON. Return natural, plain text.
4. If the answer is not in the text, say "I cannot find the answer to that in the document."

DOCUMENT TEXT:\n${documentText}\n\n`;
    
    if (history && history.length > 0) {
      prompt += `PREVIOUS CONVERSATION:\n`;
      history.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += `\n`;
    }
    
    prompt += `USER QUESTION: ${message}\n\nASSISTANT ANSWER:`;

    // Model Rotation Array: If one model hits a rate limit, automatically try the next!
    const fallbackModels = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-3.1-flash-lite' // This one has a massive 500 RPD limit according to your dashboard!
    ];

    let responseText = null;
    let lastError = null;

    for (const modelName of fallbackModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });
        responseText = response.text;
        break; // Success! Exit the loop.
      } catch (error) {
        console.warn(`[Chat API] Model ${modelName} failed. Falling back to next model...`, error.message);
        lastError = error;
      }
    }

    if (!responseText) {
      throw lastError; // All models failed
    }

    return NextResponse.json({ reply: responseText });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate chat response. Quota exceeded across all fallback models.' },
      { status: 500 }
    );
  }
}
