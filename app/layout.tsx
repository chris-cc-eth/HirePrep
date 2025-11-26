import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "HirePrep - AI-Powered Interview Preparation",
  description: "Prepare for your tech interviews with AI-generated questions tailored to your resume and job description",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
