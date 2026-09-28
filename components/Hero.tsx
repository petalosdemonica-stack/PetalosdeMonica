import Image from "next/image";
import Link from "next/link";
import { placeholderImages } from "@/lib/products";
import { siteConfig } from "@/lib/config";
import { ArrowRightIcon } from "./Icons";

/**
 * Textos del Hero, centralizados y fáciles de editar (sección 6).
 */
export const heroContent = {
  eyebrow: "CREACIONES ARTESANALES · PÉTALOS DE MÓNICA",
  titleLines: ["FLORES", "QUE DURAN"],
  description:
    "Flores hechas a mano con limpia pipa, creadas para regalar, sorprender y conservar.",
  primaryCta: { label: "VER COLECCIÓN", href: "/coleccion" },
  secondaryCta: { label: "CONOCER MÁS", href: "/#coleccion" },
  image: placeholderImages.hero,
  imageAlt:
    "Arreglo floral de Pétalos de Mónica — imagen referencial de ejemplo",
} as const;

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-900">
      {/* Fondo */}
      <Image
        src={heroContent.image}
        alt={heroContent.imageAlt}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      {/* Overlay elegante */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink-900/80 via-ink-900/55 to-ink-900/25"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-transparent to-ink-900/40"
      />

      <div className="container-page relative z-10 py-28 md:py-32">
        <div className="max-w-2xl text-cream-50">
          <p className="text-[0.625rem] tracking-[0.28em] text-cream-50/75 uppercase sm:text-[0.6875rem]">
            {heroContent.eyebrow}
          </p>

          {/* break-words evita overflow en 320px */}
          <h1 className="mt-5 font-display text-[clamp(2.75rem,13vw,6.5rem)] leading-[0.92] break-words">
            <span className="block">{heroContent.titleLines[0]}</span>
            <span className="block italic text-petal-300">
              {heroContent.titleLines[1]}
            </span>
          </h1>

          <p className="mt-6 max-w-md text-sm leading-relaxed text-cream-50/85 sm:text-base sm:leading-relaxed">
            {heroContent.description}
          </p>

          {/* Botones apilados en móvil */}
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={heroContent.primaryCta.href} className="btn btn-light">
              {heroContent.primaryCta.label}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
            <Link href={heroContent.secondaryCta.href} className="btn btn-ghost-light">
              {heroContent.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>

      <p className="sr-only">{siteConfig.tagline}</p>
    </section>
  );
}
