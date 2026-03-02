import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Digital Doula — For the stories only you can tell",
  description: "Create rich multimedia stories from your photos and videos. Share the moments that matter most with the people you love.",
  openGraph: {
    title: "Digital Doula",
    description: "For the stories only you can tell.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
