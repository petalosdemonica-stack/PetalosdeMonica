"use client";

import { useEffect, useRef } from "react";
import { CATEGORIES, type Category } from "@/lib/categories";

type Props = {
  active: Category;
  onChange: (category: Category) => void;
  /** Oculta el filtro cuando no aplica (ej: dentro de un drawer). */
  className?: string;
  idPrefix?: string;
};

/**
 * Filtro por categoría.
 * La lista viene de `lib/categories` (fuente única de verdad).
 */
export function CategoryFilter({
  active,
  onChange,
  className = "",
  idPrefix = "cat",
}: Props) {
  const listRef = useRef<HTMLUListElement>(null);

  // Al cambiar de categoría en móvil, se centra la pastilla activa.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const selected = list.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!selected) return;
    const target =
      selected.offsetLeft - list.clientWidth / 2 + selected.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  }, [active]);

  return (
    <div className={className}>
      <h2 className="sr-only" id={`${idPrefix}-label`}>
        Filtrar por categoría
      </h2>
      {/* Scroll horizontal en móvil, sin overflow de página */}
      <ul
        ref={listRef}
        aria-labelledby={`${idPrefix}-label`}
        className="hide-scrollbar -mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0"
      >
        {CATEGORIES.map((category) => {
          const selected = category === active;
          return (
            <li key={category} className="snap-start">
              <button
                type="button"
                id={`${idPrefix}-${category}`}
                onClick={() => onChange(category)}
                aria-pressed={selected}
                className={[
                  "whitespace-nowrap rounded-full border px-4 py-2 text-[0.75rem] tracking-[0.08em] uppercase transition-all duration-200",
                  selected
                    ? "border-ink-900 bg-ink-900 text-cream-50"
                    : "border-cream-300 text-ink-700 hover:border-ink-900",
                ].join(" ")}
              >
                {category}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
