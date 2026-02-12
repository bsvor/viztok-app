import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viztok",
  description:
    "The streaming platform for AI-generated short-form TV shows, movies, and feature-length films.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
