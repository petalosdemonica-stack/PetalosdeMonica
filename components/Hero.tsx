import Image from "next/image";
import Link from "next/link";
import { placeholderImages } from "@/lib/products";
import { siteConfig } from "@/lib/config";
import { ArrowRightIcon } from "./Icons";

/**
 * Textos y medios del Hero, centralizados y fáciles de editar (sección 6).
 */
export const heroContent = {
  eyebrow: "CREACIONES ARTESANALES · PÉTALOS DE MÓNICA",
  titleLines: ["FLORES", "QUE DURAN"],
  description:
    "Flores hechas a mano con limpia pipa, creadas para regalar, sorprender y conservar.",
  primaryCta: { label: "VER COLECCIÓN", href: "/coleccion" },
  secondaryCta: { label: "CONOCER MÁS", href: "/#historia" },

  /**
   * Video de fondo (movimiento suave).
   *
   * Para activarlo:
   *   1. Coloca el archivo en `public/hero/hero-movimiento.mp4`
   *   2. Cambia `videoSrc` por "/hero/hero-movimiento.mp4"
   *
   * Mientras sea `null` se muestra la imagen de fondo, de modo que nunca queda
   * un bloque vacío si el archivo todavía no existe.
   */
  videoSrc: null as string | null,

  /** Imagen de respaldo. Sigue siendo un placeholder de Unsplash (sección 16). */
  image: placeholderImages.hero,
  imageAlt:
    "Arreglo floral de Pétalos de Mónica — imagen referencial de ejemplo",
} as const;

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-cream-50"
    >
      {/* Fondo: video con movimiento suave + respaldo en imagen */}
      {heroContent.videoSrc ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          // Evita que el navegador descargue el video cuando está en Data Saver
          preload="metadata"
          poster={heroContent.image}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={heroContent.videoSrc} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={heroContent.image}
          alt={heroContent.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      )}

      {/*
        Degradado claro: el texto va en oscuro sobre fondo crema, así que el
        velo va del crema al transparente (y no al revés como en un hero oscuro).
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-cream-50 from-[15%] via-cream-50/85 via-[55%] to-cream-50/20 md:from-cream-50/95 md:via-cream-50/70"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-cream-50 to-transparent"
      />

      {/* Contenido — el navbar lo aporta el Header fijo, no se duplica aquí */}
      <div className="container-page relative z-10 flex flex-1 flex-col justify-center pt-28 pb-20 md:pt-32 md:pb-24">
        <div className="max-w-xl">
          <p className="text-[0.625rem] tracking-[0.35em] text-ink-700 uppercase sm:text-[0.6875rem]">
            {heroContent.eyebrow}
          </p>

          <h1 className="mt-4 font-display text-[clamp(2.75rem,14vw,5.75rem)] leading-[0.88] font-light break-words text-ink-900">
            <span className="block">{heroContent.titleLines[0]}</span>
            <span className="block italic text-petal-500">
              {heroContent.titleLines[1]}
            </span>
          </h1>

          <p className="mt-5 max-w-[23rem] text-[0.8125rem] leading-relaxed text-ink-700 sm:text-sm">
            {heroContent.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={heroContent.primaryCta.href}
              className="btn btn-light shadow-soft"
            >
              {heroContent.primaryCta.label}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href={heroContent.secondaryCta.href} className="btn btn-secondary">
              {heroContent.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      <p className="sr-only">{siteConfig.tagline}</p>
    </section>
  );
}

