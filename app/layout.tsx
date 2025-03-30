import type { Metadata } from "next";

import { Roboto } from "next/font/google";
import "@/styles/globals.css";

const roboto = Roboto({ subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Mflix",
  authors: [{ name: "Emmanuel Lefevre" }],
  keywords: ["NextJS", "Tailwind", "MongoDB", "Css", "Vercel"],
  description: "🎞️ Movies list Next.js API"
};

export const viewport = {
  themeColor: "#89BF03"
};


export default function RootLayout({ children }: { children: React.ReactNode;}) {
  return (
    <html lang="en">
      <body className={roboto.className}>{ children }</body>
    </html>
  );
}
