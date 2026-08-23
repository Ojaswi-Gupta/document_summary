import "./globals.css";

export const metadata = {
  title: "DocSummary AI - Smart Document Summarizer",
  description:
    "Upload any PDF or image document and get AI-powered summaries, key points, and improvement suggestions instantly.",
  keywords: ["document summary", "AI", "PDF", "OCR", "Gemini"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
