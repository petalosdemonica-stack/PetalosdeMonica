import { placeholderImages } from "./products";

export type Promotion = {
  id: string;
  title: string;
  description: string;
  image?: string;
  /** Texto del descuento, ej: "20% OFF" */
  discountText?: string;
  /** Etiqueta sobre el título, ej: "OFERTA DE TEMPORADA" */
  eyebrow?: string;
  /** ISO 8601. Si se define, la promoción está acotada en el tiempo. */
  startDate?: string;
  endDate?: string;
  active: boolean;
  /**
   * El reloj SOLO se muestra cuando `true` Y la promoción tiene `endDate`.
   * Nunca se muestra en el Hero.
   */
  showCountdown: boolean;
  /** Destino del CTA. Debe ser una ruta interna real. */
  href: string;
  ctaLabel: string;
};

/**
 * Promociones de demostración.
 *
 * Para activar una campaña con reloj, fija `active: true` y una `endDate`
 * futura. Sin `endDate`, la promoción se muestra sin countdown.
 */
export const promotions: Promotion[] = [
  {
    id: "temporada",
    eyebrow: "OFERTA DE TEMPORADA",
    title: "20% OFF en ramos seleccionados",
    description: "Aprovecha esta promoción antes de que termine.",
    discountText: "20% OFF",
    image: placeholderImages.promo,
    // Sin fechas: la campaña queda visible pero sin reloj.
    active: true,
    showCountdown: false,
    href: "/coleccion",
    ctaLabel: "VER PROMOCIÓN",
  },
  {
    id: "nueva-coleccion",
    eyebrow: "NUEVA COLECCIÓN",
    title: "Descubre nuestros nuevos diseños",
    description: "Arreglos recientes, elaborados a mano y listos para regalar.",
    image: placeholderImages.detalle,
    active: true,
    showCountdown: false,
    href: "/coleccion",
    ctaLabel: "VER COLECCIÓN",
  },
  {
    id: "halloween",
    eyebrow: "TEMPORADA",
    title: "Arreglos para Halloween",
    description: "Naranja, negro y morado. Disponibles por tiempo limitado.",
    discountText: "-15%",
    image: placeholderImages.halloween,
    active: false,
    showCountdown: true,
    // Actualiza estas fechas cuando la campaña esté confirmada.
    startDate: "2026-10-01T00:00:00.000Z",
    endDate: "2026-11-02T00:00:00.000Z",
    href: "/coleccion?categoria=Halloween",
    ctaLabel: "VER PROMOCIÓN",
  },
];

function parseDate(value?: string): number | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

export type PromotionState = "active" | "scheduled" | "expired" | "inactive";

/**
 * Estado de una promoción en un instante dado.
 * `now` se inyecta para que el countdown no dependa del reloj del servidor.
 */
export function getPromotionState(
  promotion: Promotion,
  now: number,
): PromotionState {
  if (!promotion.active) return "inactive";
  const start = parseDate(promotion.startDate);
  const end = parseDate(promotion.endDate);
  if (start !== null && now < start) return "scheduled";
  if (end !== null && now >= end) return "expired";
  return "active";
}

/** ¿Tiene sentido mostrar el reloj para esta promoción? */
export function shouldShowCountdown(
  promotion: Promotion,
  now: number,
): boolean {
  if (!promotion.showCountdown) return false;
  if (parseDate(promotion.endDate) === null) return false;
  return getPromotionState(promotion, now) === "active";
}

/** Promociones visibles en este momento. */
export function getActivePromotions(now: number): Promotion[] {
  return promotions.filter((p) => getPromotionState(p, now) === "active");
}
