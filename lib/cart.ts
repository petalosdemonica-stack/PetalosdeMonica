import { cartRules } from "./config";
import { getProductById, type Product } from "./products";

/**
 * Única fuente de verdad del carrito en el cliente.
 *
 * IMPORTANTE: el carrito guarda SOLO `productId` y `quantity`.
 * Nunca se guarda el precio, porque el precio lo resuelve el servidor.
 */
export type CartItem = {
  productId: string;
  quantity: number;
};

/** Fila del carrito ya resuelta contra el catálogo (solo para pintar). */
export type ResolvedCartItem = {
  product: Product;
  quantity: number;
  lineTotal: number;
  /** El producto ya no existe en el catálogo. */
  missing: boolean;
  /** El producto existe pero está agotado. */
  unavailable: boolean;
};

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return cartRules.minQuantity;
  return Math.min(
    cartRules.maxQuantity,
    Math.max(cartRules.minQuantity, Math.trunc(value)),
  );
}

/** Fusiona duplicados y normaliza cantidades. */
export function normalizeCart(items: CartItem[]): CartItem[] {
  const merged = new Map<string, number>();
  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) continue; // producto eliminado del catálogo
    const next = clampQuantity((merged.get(item.productId) ?? 0) + item.quantity);
    merged.set(item.productId, next);
  }
  return Array.from(merged, ([productId, quantity]) => ({ productId, quantity }));
}

/** Resuelve el carrito contra el catálogo actual. */
export function resolveCart(items: CartItem[]): ResolvedCartItem[] {
  const resolved: ResolvedCartItem[] = [];
  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product) continue;
    resolved.push({
      product,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
      missing: false,
      unavailable: !product.available,
    });
  }
  return resolved;
}

/** Cantidad total de unidades (no de productos distintos). */
export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/** Subtotal calculado con los precios del catálogo. */
export function getCartSubtotal(items: CartItem[]): number {
  return resolveCart(items).reduce((sum, item) => sum + item.lineTotal, 0);
}

export function isCartPurchasable(items: CartItem[]): boolean {
  const resolved = resolveCart(items);
  return resolved.length > 0 && resolved.every((i) => !i.unavailable);
}
