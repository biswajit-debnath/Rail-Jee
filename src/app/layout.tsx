import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Railje - Railway Exam Platform",
  description: "Prepare for Railway exams with our comprehensive platform",
  icons: {
    icon: "/images/logo - favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical animation file */}
        <link
          rel="preload"
          href="/animation/Train Animation.lottie/a/Main Scene.json"
          as="fetch"
          crossOrigin="anonymous"
        />
        {/* Optimize font loading */}
        <link
          href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Hindi:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
