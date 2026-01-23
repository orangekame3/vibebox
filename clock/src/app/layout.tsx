import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Clock | Minimal Time Display",
  description: "A beautifully minimal clock with Japanese-inspired design",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
