import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HirePrep - AI Interview Preparation",
  description: "AI-powered interview preparation with tailored questions and skill gap analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
