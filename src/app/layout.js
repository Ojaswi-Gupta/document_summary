import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "DocSummary AI - Smart Document Summarizer",
  description:
    "Upload any PDF or image document and get AI-powered summaries, key points, and improvement suggestions instantly.",
  keywords: ["document summary", "AI", "PDF", "OCR", "Gemini"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${jakarta.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
