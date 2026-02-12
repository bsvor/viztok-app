import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Viztok",
    template: "%s | Viztok",
  },
  description:
    "The streaming platform for AI-generated short-form TV shows, movies, and feature-length films.",
  openGraph: {
    title: "Viztok",
    description:
      "The streaming platform for AI-generated short-form TV shows, movies, and feature-length films.",
    siteName: "Viztok",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viztok",
    description:
      "The streaming platform for AI-generated short-form TV shows, movies, and feature-length films.",
  },
  metadataBase: new URL("https://app.viztok.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased overflow-x-hidden">{children}</body>
    </html>
  );
}
