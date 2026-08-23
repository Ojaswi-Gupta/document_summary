# DocSummary AI - Smart Document Summary Assistant

🔗 **Live Demo:** [https://document-summary-chi.vercel.app](https://document-summary-chi.vercel.app)

A professional, production-ready web application that takes any document (PDF or image) and generates AI-powered smart summaries with key points, raw text extraction, and improvement suggestions.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.6_Flash-4285F4?logo=google)
![Vitest](https://img.shields.io/badge/Tested_with-Vitest-729B1B?logo=vitest)

---

## ✨ Features

- **One-Click Sample Document** — Try the app instantly without finding a file to upload
- **Raw Text Extraction** — View the exact raw text extracted from the document alongside the AI summary
- **Local History (Privacy-First)** — Your past 5 summaries are saved securely in your browser's local storage
- **Rate Limiting UX** — Real-time indicator showing remaining daily requests
- **Smart Summaries** — Choose between short, medium, or long summaries
- **Data Reduction Stats** — See exactly how much reading time the AI saved you (e.g., 95% reduction)
- **Document Upload** — Drag-and-drop or file picker for PDFs, Images, and TXT files
- **Copy to Clipboard** — One-click copy of the entire summary or raw text
- **Responsive Design** — Works seamlessly on desktop, tablet, and mobile
- **Loading States** — Animated progress indicators for better UX

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 15 (App Router) | React framework with server-side capabilities |
| Styling | Tailwind CSS 4 | Utility-first responsive design |
| AI/ML | Google Gemini 3.6 Flash | Document understanding, OCR, and summarization |
| Upload | react-dropzone | Drag-and-drop file upload interface |
| Testing | Vitest | Unit testing for API validation logic |
| Hosting | Vercel | Serverless deployment with edge caching |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- A Google AI Studio API key ([Get one free here](https://aistudio.google.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/doc-summary-assistant.git
   cd doc-summary-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env.local file in the project root
   cp .env.example .env.local
   ```
   Then add your API key:
   ```
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

---

## 📐 Architecture

```
User uploads document (PDF/Image)
         │
         ▼
┌─────────────────────┐
│   Next.js Frontend   │  React + Tailwind CSS
│   (Client Browser)   │  Drag-drop, state management
└──────────┬──────────┘
           │ POST /api/summarize (multipart/form-data)
           ▼
┌─────────────────────┐
│  Next.js API Route   │  Validation, file processing
│  (Serverless Fn)     │  Converts to base64
└──────────┬──────────┘
           │ Gemini API call (inline data)
           ▼
┌─────────────────────┐
│  Google Gemini API   │  Native PDF + Image understanding
│  (gemini-2.0-flash)  │  OCR, summarization, analysis
└─────────────────────┘
```

**Key Design Decision:** Instead of using separate tools for PDF parsing (pdf-parse), OCR (Tesseract), and summarization (OpenAI), I used Google Gemini's multimodal API which natively handles all three in a single API call. This results in:
- Fewer dependencies and failure points
- Cleaner, more maintainable code
- Better accuracy (the AI understands document layout, not just raw text)

---

## 📝 Approach Write-up (200 words)

I built DocSummary AI as a full-stack Next.js application that leverages Google Gemini 2.0 Flash's multimodal capabilities to handle the entire document processing pipeline in a single API call.

**The core insight** was recognizing that modern multimodal LLMs can natively read PDFs and images, eliminating the need for separate OCR (Tesseract) and PDF parsing libraries. This dramatically simplified the architecture — one API call replaces three separate tools while delivering better accuracy since the AI understands document layout and context holistically.

**Architecture choices** were driven by simplicity and deployment efficiency. Next.js App Router provides both the React frontend and serverless API routes in one codebase, keeping the API key secure on the server side. Tailwind CSS ensures a responsive, mobile-first design with minimal custom CSS.

**The UI** focuses on clarity: drag-and-drop upload, visual summary length selection, collapsible result sections, and a copy-to-clipboard feature. Loading states with animated progress indicators provide feedback during AI processing. Comprehensive error handling with retry functionality ensures robustness.

**Deployment** on Vercel provides automatic scaling via serverless functions, meaning the application handles multiple concurrent users without infrastructure management — ideal for a lightweight, production-ready submission.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/summarize/route.js    # Backend API endpoint
│   ├── globals.css                # Tailwind imports + custom styles
│   ├── layout.js                  # Root layout with metadata
│   └── page.js                    # Main page (orchestrates components)
├── components/
│   ├── Header.jsx                 # App header
│   ├── FileUpload.jsx             # Drag-and-drop upload zone
│   ├── SummaryOptions.jsx         # Summary length selector
│   ├── SummaryDisplay.jsx         # Results display with sections
│   ├── LoadingSpinner.jsx         # Animated loading indicator
│   └── ErrorMessage.jsx           # Error display with retry
└── lib/
    └── gemini.js                  # Gemini API helper functions
```

---

## 🧪 Testing

The application has been manually tested with:
- ✅ PDF documents (text-based and scanned)
- ✅ Image files (PNG, JPG, WEBP)
- ✅ All three summary lengths (short, medium, long)
- ✅ Invalid file types (proper error messages)
- ✅ Oversized files (proper error messages)
- ✅ Mobile responsive design
- ✅ Drag-and-drop and file picker functionality

---

## 📄 License

This project was created as a technical assessment submission.
