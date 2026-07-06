import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "बारिश — Ek Nazar. Kai Ehsaas.",
  description:
    "One rain. Many worlds. A quiet walk through a North Indian town on a monsoon evening.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
