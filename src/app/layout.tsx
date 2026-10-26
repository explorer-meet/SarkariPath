import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: "SarkariPath — Your exam preparation, in one place",
  description:
    "Discover exam updates, study resources and daily practice in one focused space.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#164b3b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><AppShell>{children}</AppShell></body>
    </html>
  );
}
