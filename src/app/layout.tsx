import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://urivalent.tech"
  ),
  title: "Urivalent | The Edge of Tomorrow",
  description: "The definitive intelligence feed for the AI era. Autonomously tracking frontier models, silicon architectures, agentic tooling, bio-intelligence, and the capital, policy and infrastructure shifts shaping our future.",
  openGraph: {
    title: "Urivalent | The Edge of Tomorrow",
    description: "The definitive intelligence feed for the AI era. Autonomously tracking frontier models, silicon architectures, agentic tooling, bio-intelligence, and the capital, policy and infrastructure shifts shaping our future.",
    url: "https://urivalent.tech",
    siteName: "Urivalent",
    images: [
      {
        url: "/twitter-image.jpg",
        width: 1356,
        height: 614,
        alt: "Urivalent | The Edge of Tomorrow",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Urivalent | The Edge of Tomorrow",
    description: "The definitive intelligence feed for the AI era. Autonomously tracking frontier models, silicon architectures, agentic tooling, bio-intelligence, and the capital, policy and infrastructure shifts shaping our future.",
    images: ["/twitter-image.jpg"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} h-full antialiased scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-[#164A41]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

