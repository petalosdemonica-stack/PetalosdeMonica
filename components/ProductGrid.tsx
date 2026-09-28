"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ALL_CATEGORY, isCategory, type Category } from "@/lib/categories";
import { products } from "@/lib/products";
import { CategoryFilter } from "./CategoryFilter";
import { ProductCard } from "./ProductCard";
import { FlowerIcon } from "./Icons";

const catalogCopy = {
  eyebrow: "CREACIONES ARTESANALES",
  title: "Nuestra colección",
  description: "Creaciones hechas a mano para regalar algo diferente.",
} as const;

export function ProductGrid() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("categoria");
  const [active, setActive] = useState<Category>(
    initial && isCategory(initial) ? initial : ALL_CATEGORY,
  );

  const filtered = useMemo(
    () =>
      active === ALL_CATEGORY
        ? products
        : products.filter((p) => p.category === active),
    [active],
  );

  function handleChange(category: Category) {
    setActive(category);
    // La URL refleja el filtro: permite compartir y usar el botón "atrás".
    const params = new URLSearchParams(searchParams.toString());
    if (category === ALL_CATEGORY) params.delete("categoria");
    else params.set("categoria", category);
    const query = params.toString();
    router.replace(query ? `/coleccion?${query}` : "/coleccion", {
      scroll: false,
    });
  }

  return (
    <section id="coleccion" className="container-page scroll-mt-24 py-16 md:py-24">
      <div className="max-w-2xl">
        <p className="eyebrow">{catalogCopy.eyebrow}</p>
        <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] leading-tight">
          {catalogCopy.title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-500 md:text-base">
          {catalogCopy.description}
        </p>
      </div>

      <CategoryFilter
        active={active}
        onChange={handleChange}
        className="mt-10"
        idPrefix="catalogo"
      />

      {filtered.length > 0 ? (
        <>
          <p className="mt-8 text-xs text-ink-400" aria-live="polite">
            {filtered.length}{" "}
            {filtered.length === 1 ? "creación" : "creaciones"}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <div className="mt-10 rounded-card border border-dashed border-cream-300 px-6 py-16 text-center">
          <FlowerIcon className="mx-auto h-8 w-8 text-petal-300" />
          <p className="mt-4 font-display text-xl">
            Aún no hay creaciones en esta categoría
          </p>
          <p className="mt-2 text-sm text-ink-500">
            Revisa las otras categorías de nuestra colección.
          </p>
          <button
            type="button"
            onClick={() => handleChange(ALL_CATEGORY)}
            className="btn btn-secondary mt-6"
          >
            Ver todo
          </button>
        </div>
      )}
    </section>
  );
}
