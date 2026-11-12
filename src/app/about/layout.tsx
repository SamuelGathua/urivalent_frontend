import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Urivalent | The Six Pillars & Selection Thesis",
  description:
    "Explore the platform tracking pillars, selection thesis, and founder biography behind the Urivalent autonomous Artificial intelligence pipeline.",
  alternates: {
    canonical: "https://urivalent.tech/about",
  },
  openGraph: {
    title: "About Urivalent | The Six Pillars & Selection Thesis",
    description:
      "Explore the platform tracking pillars, selection thesis, and founder biography behind the Urivalent autonomous Artificial intelligence pipeline.",
    url: "https://urivalent.tech/about",
    siteName: "Urivalent",
    images: [
      {
        url: "/twitter-image.jpg",
        width: 1356,
        height: 614,
        alt: "About Urivalent",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Urivalent | The Six Pillars & Selection Thesis",
    description:
      "Explore the platform tracking pillars, selection thesis, and founder biography behind the Urivalent autonomous Artificial intelligence pipeline.",
    images: ["/twitter-image.jpg"],
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

