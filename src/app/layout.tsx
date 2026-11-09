import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Urivalent | AI Intelligence Feed",
  description: "Autonomous zero-cost full-stack AI intelligence pipeline and delivery engine.",
  icons: {
    icon: "/urivalent_logo.jfif",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-[#164A41]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
