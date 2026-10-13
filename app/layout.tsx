import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Nav } from "@/components/nav/Nav";
import { Footer } from "@/components/site/Footer";
import { ThemeProvider } from "@/components/site/ThemeProvider";
import { MoldTrail } from "@/components/trail/MoldTrail";
import { INTRO_KEY } from "@/lib/intro-route";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Physarum — Intelligence that navigates", template: "%s · Physarum" },
  description: site.description,
  openGraph: { siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image" },
  ...(site.preview && { robots: { index: false, follow: false } }),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Decide before first paint whether the homepage intro should play, so it never flashes. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem("${INTRO_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("intro-done")}catch(e){document.documentElement.classList.add("intro-done")}`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <noscript>
          <style>{"[data-trail-section]{opacity:1!important}#intro{display:none}"}</style>
        </noscript>
        <ThemeProvider>
          <Nav />
          <div className="relative">
            <MoldTrail />
            <main className="relative pt-16">{children}</main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
