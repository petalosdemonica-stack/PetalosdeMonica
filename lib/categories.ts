/**
 * ÚNICA fuente de verdad de categorías.
 *
 * "Todos" es el pseudo-filtro inicial y no corresponde a una categoría real.
 * IMPORTANTE: "Condolencias" está fuera del proyecto a propósito.
 */

export const ALL_CATEGORY = "Todos" as const;

export const CATEGORIES = [
  ALL_CATEGORY,
  "Aniversario",
  "Cumpleaños",
  "San Valentín",
  "Día de la Madre",
  "Halloween",
  "Regalos",
  "Personalizados",
] as const;

export type Category = (typeof CATEGORIES)[number];
/** Categorías reales, sin el pseudo-filtro "Todos". */
export type RealCategory = Exclude<Category, typeof ALL_CATEGORY>;

export const REAL_CATEGORIES: readonly RealCategory[] = CATEGORIES.filter(
  (c): c is RealCategory => c !== ALL_CATEGORY,
);

export function isCategory(value: unknown): value is Category {
  return typeof value === "string" && (CATEGORIES as readonly string[]).includes(value);
}
