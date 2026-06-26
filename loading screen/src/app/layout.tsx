import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NewForm — Advancing the Economic Networks of the Future",
  description: "A premium, futuristic loading experience for the NewForm brand.",
  keywords: ["NewForm", "futuristic", "premium", "loading experience"],
  authors: [{ name: "NewForm" }],
  openGraph: {
    title: "NewForm",
    description: "Advancing the Economic Networks of the Future",
    siteName: "NewForm",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NewForm",
    description: "Advancing the Economic Networks of the Future",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
