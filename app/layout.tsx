import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { siteConfig, seoConfig } from "@/lib/config";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: seoConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: seoConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "flores de limpia pipa",
    "limpia pipa",
    "arreglos artesanales",
    "regalos personalizados",
    siteConfig.name,
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: seoConfig.title,
    description: seoConfig.description,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.title,
    description: seoConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  // Los assets viven en /public para servirse estáticamente y poder
  // referenciarlos desde metadata y desde las páginas.
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#fdfbf7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CL" className={`${serif.variable} ${sans.variable}`}>
      <body className="antialiased">
        <CartProvider>
          <a
            href="#contenido"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink-900 focus:px-5 focus:py-3 focus:text-sm focus:text-cream-50"
          >
            Saltar al contenido
          </a>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
