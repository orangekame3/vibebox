import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Timer | Minimal Time Tracking",
  description: "A beautifully minimal timer for focused work",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
