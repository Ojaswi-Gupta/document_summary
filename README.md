# DocSummary AI 📄✨

A modern, lightning-fast document and media summarization application built with **Next.js** and **Google Gemini Flash**. 

Upload a PDF, image, or audio recording, and the AI will extract the text, generate a smart summary, highlight key points, and suggest improvements. You can even translate the output instantly, listen to it via AI Voice, or chat with your document for follow-up questions!

## 🚀 Key Features

*   **Multimodal AI Engine (Text, Vision, Audio):** Natively parses PDFs, applies OCR to scanned images (PNG, JPG, WEBP), and transcibes audio files (MP3, WAV) in a single, blazing-fast pass without legacy pipelines.
*   **High-Availability Model Rotation:** Built-in API quota protection. If one Gemini model hits a daily limit, the backend automatically and seamlessly fails over to backup models (e.g., 3.6-flash -> 3.5-flash -> 2.5-flash) to guarantee 100% uptime.
*   **Intelligent Text-to-Speech (TTS):** A `Listen` button powered by the native Web Speech API. It silently cleans markdown, formats sentences for natural human pauses, and automatically searches your device for premium voices (like Google or Apple Siri) to read the summary out loud.
*   **Multi-Language Translation:** Instantly translate summaries into Spanish, French, German, Hindi, Japanese, or Chinese. The TTS engine dynamically adapts its phonetic alphabet and voice to perfectly match the selected language!
*   **Interactive Document Chatbot:** Ask questions about the document you just uploaded and get instant, context-aware answers natively typed out on your screen.
*   **Dynamic Prompt Injection (Quick Actions):** Instantly switch AI modes to extract exactly what you need:
    *   *Standard Summary*
    *   *Explain Like I'm 5 (ELI5)*
    *   *Action Items Only*
    *   *Extract Numbers & Metrics*
*   **Privacy-First History (Session Preserved):** Your recent summaries are stored strictly in your browser's local storage. You can view past histories without overriding or losing your current active document session.

## 🛠️ Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Styling:** Tailwind CSS + Lucide React Icons
*   **AI Engine:** Google Gemini SDK (`gemini-3.6-flash`, `gemini-3.5-flash`, `gemini-2.5-flash`)
*   **Deployment:** Vercel

## 💻 Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ojaswi-Gupta/document_summary.git
   cd document_summary
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file in the root of the project and add your Gemini API key:
   ```env
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   *Note: Due to a Next.js Turbopack quirk with Node 25+, local builds may crash if you attempt a production build locally. Using `npm run dev` works perfectly, and Vercel will build the production app successfully via Node 20.*

## 🔒 Privacy & Rate Limiting
To ensure a fast and privacy-focused experience, this application enforces a client-side rate limit of 50 requests per day and maintains only the 5 most recent documents in your local history to preserve quotas.

---
*Designed & Built by Ojaswi Gupta*
