import Image from "next/image";
import { placeholderImages } from "@/lib/products";
import { Reveal } from "./Reveal";

/** Sección de marca: refuerza el concepto de trabajo artesanal. */
export function BrandStory() {
  return (
    // `id="historia"`: destino real del CTA "CONOCER MÁS" del Hero.
    <section
      id="historia"
      className="relative isolate scroll-mt-24 overflow-hidden bg-cream-100 py-20 md:py-28"
    >
      <div className="container-page grid items-center gap-12 md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="eyebrow">Nuestra esencia</p>
          <h2 className="mt-4 font-display text-[clamp(2.25rem,6vw,4rem)] leading-[1.05] text-balance">
            Hecho a mano,
            <br />
            <span className="italic text-petal-700">pensado para durar.</span>
          </h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-500 md:text-base">
            Cada creación de Pétalos de Mónica nace del trabajo manual y de la
            intención de transformar un regalo en un recuerdo. Trabajamos la
            limpia pipa pétalo a pétalo, porque sabemos que lo que se hace con
            cuidado se nota.
          </p>
        </Reveal>

        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-cream-200 sm:aspect-square md:aspect-[4/5]">
          <Image
            src={placeholderImages.textura}
            alt="Texturas y materiales del trabajo artesanal — imagen referencial"
            fill
            loading="lazy"
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
