import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';

import { trip } from '@/data/trip-data';

import './globals.css';

const display = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
});

const sans = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-sans',
});

const description =
  'Digitales Urlaubsbuch: unsere Reise durch die Toskana im Sommer 2026 — Orte, Licht, Genuss und die Momente, die geblieben sind.';

// Basis-URL für Open-Graph-Bilder. Auf Vercel wird VERCEL_URL automatisch
// gesetzt; lokal bleibt es localhost.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL('http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: `${trip.title} — Digitales Urlaubsbuch`,
    template: `%s — ${trip.title}`,
  },
  description,
  applicationName: trip.title,
  authors: [{ name: 'Familie Schellhase' }],
  keywords: ['Toskana', 'Italien', 'Urlaub 2026', 'Reisetagebuch', 'Fotoreise'],
  robots: {
    // Privates Urlaubsbuch — bewusst nicht indexieren.
    index: false,
    follow: false,
    nocache: true,
  },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    title: `${trip.title} — Digitales Urlaubsbuch`,
    description,
    siteName: trip.title,
    images: [
      {
        url: '/images/hero-tuscany.png',
        width: 1920,
        height: 1200,
        alt: 'Toskanische Hügellandschaft im Abendlicht',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${trip.title} — Digitales Urlaubsbuch`,
    description,
    images: ['/images/hero-tuscany.png'],
  },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF7F2' },
    { media: '(prefers-color-scheme: dark)', color: '#141412' },
  ],
  width: 'device-width',
  initialScale: 1,
  // Zoom bleibt erlaubt — Barrierearmut vor Optik.
  maximumScale: 5,
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${display.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
