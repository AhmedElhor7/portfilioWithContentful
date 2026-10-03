import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { themeScript } from "@/components/layout/theme-script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ada Whitfield — Designer & Engineer",
    template: "%s — Ada Whitfield",
  },
  description:
    "Portfolio of Ada Whitfield, a designer-engineer building calm, considered interfaces for the web. Selected work and writing on typography, motion, and design systems.",
  keywords: ["portfolio", "design engineer", "typography", "design systems", "next.js"],
  authors: [{ name: "Ada Whitfield" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Ada Whitfield — Designer & Engineer",
    description:
      "A designer-engineer building calm, considered interfaces for the web.",
    siteName: "Ada Whitfield",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ada Whitfield — Designer & Engineer",
    description: "A designer-engineer building calm, considered interfaces for the web.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#201d19" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain flex min-h-dvh flex-col">
        <MotionProvider>
          <a
            href="#main"
            className="bg-ink text-paper focus:ring-ring sr-only rounded-full px-4 py-2 font-mono text-[0.75rem] tracking-[0.1em] uppercase focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:ring-2"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
