import Image from "next/image";
import Link from "next/link";
import { REAL_CATEGORIES } from "@/lib/categories";
import { products } from "@/lib/products";
import { Reveal } from "./Reveal";
import { ArrowRightIcon } from "./Icons";

/** Ocaciones: cada tarjeta lleva al catálogo ya filtrado (sección 13). */
const occasions = REAL_CATEGORIES.map((category) => {
  const sample = products.find((p) => p.category === category);
  return {
    category,
    // Imagen representativa: al cambiar productos se actualiza sola.
    image: sample?.image ?? products[0].image,
  };
});

export function OccasionGrid() {
  return (
    <section className="border-y border-cream-200 bg-cream-100 py-16 md:py-24">
      <div className="container-page">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Para cada momento</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] leading-tight">
            Encuentra el regalo perfecto
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-500 md:text-base">
            Elige una ocasión y verás las creaciones pensadas para ella.
          </p>
        </Reveal>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:mt-12 md:grid-cols-4 md:gap-5">
          {occasions.map((occasion) => (
            <li key={occasion.category}>
              <Link
                href={`/coleccion?categoria=${encodeURIComponent(occasion.category)}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-card bg-cream-200"
              >
                <Image
                  src={occasion.image}
                  alt=""
                  fill
                  loading="lazy"
                  sizes="(min-width: 768px) 22vw, 45vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-900/75 via-ink-900/15 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                  <h3 className="font-display text-base leading-tight text-cream-50 sm:text-lg">
                    {occasion.category}
                  </h3>
                  <ArrowRightIcon className="h-4 w-4 shrink-0 text-cream-50 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
