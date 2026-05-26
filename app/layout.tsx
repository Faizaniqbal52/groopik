import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GROOPIK — Collect Every Moment",
  description: "Create an event. Share the link. Everyone uploads. One gallery — yours to keep. The easiest way to collect photos from any gathering.",
  keywords: ["photo sharing", "event photos", "group gallery", "photo collection", "event gallery"],
  openGraph: {
    title: "GROOPIK — Collect Every Moment",
    description: "The photos you almost never got. Create an event, share a link, and collect every photo in one place.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
