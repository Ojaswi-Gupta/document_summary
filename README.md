# DocSummary AI 📄✨

A modern, lightning-fast document summarization and analysis application built with **Next.js** and **Google Gemini 3.6 Flash**. 

Upload any PDF or image, and the AI will extract the text, generate a smart summary, highlight key points, and suggest improvements. You can even chat with your document to ask specific follow-up questions!

## 🚀 Key Features

*   **Multimodal AI Engine:** Natively parses PDFs and performs OCR on scanned images (PNG, JPG, WEBP) in a single, blazing-fast pass without needing legacy tools like Tesseract.
*   **Interactive Document Chatbot:** Ask questions about the document you just uploaded and get instant, context-aware answers.
*   **Dynamic Prompt Injection (Quick Actions):** Instantly switch AI modes to extract exactly what you need:
    *   *Standard Summary*
    *   *Explain Like I'm 5 (ELI5)*
    *   *Action Items Only*
    *   *Extract Numbers & Metrics*
*   **Typewriter Text Effect:** Smooth, organic text streaming for a premium AI chatbot feel.
*   **Privacy-First History:** Your recent summaries and document histories are stored strictly in your browser's local storage.
*   **Sleek Glassmorphic UI:** A beautifully animated Bento Box layout, translucent navbars, and interactive hover states built with Tailwind CSS.

## 🛠️ Tech Stack

*   **Framework:** Next.js 16 (App Router)
*   **Styling:** Tailwind CSS + Lucide React Icons
*   **AI Engine:** Google Gemini SDK (`gemini-3.6-flash`)
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
To ensure a fast and privacy-focused experience on the free tier, this application enforces a client-side rate limit of 10 requests per day and maintains only the 5 most recent documents in your local history.

---
*Designed & Built by Ojaswi Gupta*
