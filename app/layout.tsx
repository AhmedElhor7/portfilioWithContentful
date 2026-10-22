import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SiteHeader } from "@/components/layout/site-header/site-header";
import { SiteFooter } from "@/components/layout/site-footer/site-footer";
import { themeScript } from "@/components/layout/theme-script";
import { getSiteSettings, resolveSiteDescription } from "@/lib/contentful/portfolio";
import { getSiteUrl } from "@/lib/site-url";

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

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  const siteUrl = getSiteUrl();
  const siteName = settings?.siteName || "Portfolio";
  const professionalTitle = settings?.professionalTitle ?? "";
  const title = professionalTitle ? `${siteName} — ${professionalTitle}` : siteName;
  const description = resolveSiteDescription(settings);
  const ogImage = settings?.ogImage;

  return {
    ...(siteUrl ? { metadataBase: siteUrl } : {}),
    title: {
      default: title,
      template: `%s — ${siteName}`,
    },
    ...(description ? { description } : {}),
    keywords: [
      "portfolio",
      professionalTitle || "front-end developer",
      "react",
      "next.js",
      "angular",
      "typescript",
      "contentful",
    ],
    authors: [{ name: siteName }],
    ...(siteUrl ? { alternates: { canonical: "/" } } : {}),
    openGraph: {
      type: "website",
      ...(siteUrl ? { url: siteUrl.toString() } : {}),
      title,
      ...(description ? { description } : {}),
      siteName,
      ...(ogImage
        ? {
            images: [
              {
                url: ogImage.url,
                width: ogImage.width,
                height: ogImage.height,
                alt: ogImage.alt,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      ...(description ? { description } : {}),
      ...(ogImage ? { images: [ogImage.url] } : {}),
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#201d19" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();

  const siteName = settings?.siteName || "";
  const contactEmail = settings?.contactEmail || "";
  const gitHubUrl = settings?.gitHubUrl ?? null;
  const linkedInUrl = settings?.linkedInUrl ?? null;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${fraunces.variable} ${jetbrainsMono.variable} font-sans`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain flex min-h-dvh flex-col" suppressHydrationWarning>
        <MotionProvider>
          <a
            href="#main"
            className="bg-ink text-paper focus:ring-ring sr-only rounded-full px-4 py-2 font-mono text-[0.75rem] tracking-[0.1em] uppercase focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:ring-2"
          >
            Skip to content
          </a>
          <SiteHeader siteName={siteName} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter
            siteName={siteName}
            contactEmail={contactEmail}
            gitHubUrl={gitHubUrl}
            linkedInUrl={linkedInUrl}
          />
        </MotionProvider>
      </body>
    </html>
  );
}
