import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Bebas_Neue, Yuji_Syuku, Hina_Mincho } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/providers/lenis-provider";
import { Navbar } from "@/components/navbar";
import { LoadingScreen } from "@/components/loading-screen";
import { CursorGlow } from "@/components/ui/cursor-glow";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const yujiSyuku = Yuji_Syuku({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-yuji",
  display: "swap",
});

const hinaMincho = Hina_Mincho({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hina",
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://luxury-anime.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Luxury Anime — Cinematic Showcase",
    template: "%s — Luxury Anime",
  },
  description:
    "A cinematic showcase of the greatest anime of all time. Premium dark luxury design.",
  keywords: [
    "anime",
    "naruto",
    "bleach",
    "one piece",
    "jujutsu kaisen",
    "demon slayer",
    "showcase",
    "cinematic",
  ],
  authors: [{ name: "Luxury Anime" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Luxury Anime",
    title: "Luxury Anime — Cinematic Showcase",
    description:
      "A cinematic showcase of the greatest anime of all time. Premium dark luxury design.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Anime — Cinematic Showcase",
    description:
      "A cinematic showcase of the greatest anime of all time.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0F",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${bebasNeue.variable} ${yujiSyuku.variable} ${hinaMincho.variable}`}
      suppressHydrationWarning
    >
      <body className="noise-texture antialiased">
        <LenisProvider>
          <LoadingScreen />
          <Navbar />
          <CursorGlow color="#C9A84C" size={320} opacity={0.14} blendMode="screen" />
          <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
