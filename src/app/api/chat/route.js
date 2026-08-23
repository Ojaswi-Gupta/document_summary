import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GEMINI_API_KEY });

export async function POST(request) {
  try {
    const { message, documentText, history } = await request.json();

    if (!message || !documentText) {
      return NextResponse.json({ error: 'Message and document text are required' }, { status: 400 });
    }

    let prompt = `You are a helpful AI assistant answering questions about a provided document. Answer concisely and accurately based ONLY on the provided document text. If the answer is not in the text, say "I cannot find the answer to that in the document."\n\nDOCUMENT TEXT:\n${documentText}\n\n`;
    
    if (history && history.length > 0) {
      prompt += `PREVIOUS CONVERSATION:\n`;
      history.forEach(msg => {
        prompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      prompt += `\n`;
    }
    
    prompt += `USER QUESTION: ${message}\n\nASSISTANT ANSWER:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate chat response. Please try again.' },
      { status: 500 }
    );
  }
}
