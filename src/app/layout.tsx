import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data/settings";
import { getPublishedCategories } from "@/lib/data/categories";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { env } from "@/lib/env";

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-playfair",
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-be-vietnam",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.siteTitle ?? "Tổ Ấm";
  return {
    metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
    title: {
      default: `${title} — ${settings.siteTagline ?? ""}`.trim(),
      template: `%s · ${title}`,
    },
    description: settings.heroSubhead,
    openGraph: { type: "website", locale: "vi_VN", title, description: settings.heroSubhead },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [settings, categories] = await Promise.all([
    getSettings(),
    getPublishedCategories(),
  ]);

  return (
    <html lang="vi" className={`${playfair.variable} ${beVietnam.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Header settings={settings} categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer settings={settings} categories={categories} />
      </body>
    </html>
  );
}
