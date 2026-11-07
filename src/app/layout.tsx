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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-[#164A41]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
