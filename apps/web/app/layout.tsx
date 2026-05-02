// apps/web/app/layout.tsx â€” Root layout

import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Providers } from "@/components/Providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jasma Collections â€” Luxury African Fashion",
    template: "%s | Jasma Collections",
  },
  description:
    "Discover Jasma Collections â€” curated luxury African fashion, imported from Turkey and China. Shop our exclusive dresses, tops, and trousers.",
  keywords: ["African fashion", "luxury clothing", "Nairobi fashion", "Ankara dresses", "Jasma Collections"],
  authors: [{ name: "Jasma Collections" }],
  openGraph: {
    title: "Jasma Collections â€” Luxury African Fashion",
    description: "Curated luxury African fashion. Shop online or visit us in Westlands and Karen, Nairobi.",
    type: "website",
    locale: "en_KE",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="bg-cream font-inter antialiased">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
