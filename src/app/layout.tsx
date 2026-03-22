import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/providers";
import { NotificationProvider } from "@/contexts/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ExportImport - Connect Global Buyers & Suppliers",
  description: "Your trusted platform for international trade. Find verified suppliers, discover quality products, and grow your business globally with ExportImport.",
  keywords: ["export", "import", "global trade", "B2B", "suppliers", "buyers", "international trade", "verified companies"],
  authors: [{ name: "ExportImport Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "ExportImport - Global B2B Trade Platform",
    description: "Connect with verified global buyers and suppliers. Find quality products and grow your international business.",
    url: "https://exportimport.com",
    siteName: "ExportImport",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ExportImport - Global B2B Trade Platform",
    description: "Connect with verified global buyers and suppliers. Find quality products and grow your international business.",
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
        <Providers>
          <NotificationProvider>
            {children}
            <Toaster />
          </NotificationProvider>
        </Providers>
      </body>
    </html>
  );
}
