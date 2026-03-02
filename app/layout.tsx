import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Doula — Stories for the People You Love",
  description: "Create beautiful multimedia stories from your photos and videos to share with your loved ones.",
  openGraph: {
    title: "Digital Doula",
    description: "Create beautiful multimedia stories from your photos and videos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
