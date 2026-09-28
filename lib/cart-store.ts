import { cartRules } from "./config";
import {
  clampQuantity,
  getCartCount,
  getCartSubtotal,
  isCartPurchasable,
  normalizeCart,
  resolveCart,
  type CartItem,
} from "./cart";

/**
 * Store externo del carrito.
 *
 * Se implementa fuera de React (patrón `useSyncExternalStore`) por dos
 * razones:
 *  1. El estado se hidrata desde `localStorage`, una fuente externa al render.
 *  2. Permite que varios componentes (Header, Drawer, Checkout) compartan
 *     exactamente la misma instancia sin prop drilling.
 *
 * El carrito guarda SOLO `productId` y `quantity`. Nunca precios.
 */

const EMPTY: CartItem[] = [];

let items: CartItem[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function commit(next: CartItem[]) {
  items = next;
  persist();
  emit();
}

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(cartRules.storageKey, JSON.stringify(items));
  } catch {
    // Modo privado / cuota llena: la tienda sigue funcionando en memoria.
  }
}

function readStoredCart(): CartItem[] {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(cartRules.storageKey);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;

    // Validación estricta: solo se acepta { productId: string, quantity: number }.
    const valid: CartItem[] = [];
    for (const entry of parsed) {
      if (
        entry &&
        typeof entry === "object" &&
        typeof (entry as CartItem).productId === "string" &&
        Number.isFinite((entry as CartItem).quantity)
      ) {
        valid.push({
          productId: (entry as CartItem).productId,
          quantity: (entry as CartItem).quantity,
        });
      }
    }
    return normalizeCart(valid);
  } catch {
    // Carrito corrupto: se descarta en lugar de romper la app.
    return EMPTY;
  }
}

export const cartStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Instantánea para el cliente. Referencialmente estable entre cambios. */
  getSnapshot(): CartItem[] {
    return items;
  },

  /** Instantánea para el servidor: siempre un carrito vacío. */
  getServerSnapshot(): CartItem[] {
    return EMPTY;
  },

  /** `true` una vez que el carrito fue leído desde localStorage. */
  isHydrated(): boolean {
    return hydrated;
  },

  getServerHydrated(): boolean {
    return false;
  },

  /**
   * Lee el carrito persistido. Se llama una vez desde el Provider al montar
   * (nunca durante el render del servidor).
   */
  hydrate(): void {
    if (hydrated || typeof window === "undefined") return;
    hydrated = true;
    items = readStoredCart();
    emit();
  },

  /** Sincroniza con otras pestañas abiertas. */
  syncFromStorage(): void {
    if (!hydrated) return;
    const next = readStoredCart();
    if (JSON.stringify(next) === JSON.stringify(items)) return;
    items = next;
    emit();
  },

  add(productId: string, quantity = 1): void {
    commit(
      normalizeCart([...items, { productId, quantity: clampQuantity(quantity) }]),
    );
  },

  setQuantity(productId: string, quantity: number): void {
    const next = clampQuantity(quantity);
    // Al bajar de 1 la cantidad, la línea se elimina.
    if (next < cartRules.minQuantity) {
      cartStore.remove(productId);
      return;
    }
    commit(
      normalizeCart(
        items.map((i) =>
          i.productId === productId ? { ...i, quantity: next } : i,
        ),
      ),
    );
  },

  increment(productId: string): void {
    commit(
      normalizeCart(
        items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      ),
    );
  },

  decrement(productId: string): void {
    const item = items.find((i) => i.productId === productId);
    if (!item) return;
    if (item.quantity - 1 < cartRules.minQuantity) {
      cartStore.remove(productId);
      return;
    }
    commit(
      normalizeCart(
        items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i,
        ),
      ),
    );
  },

  remove(productId: string): void {
    commit(items.filter((i) => i.productId !== productId));
  },

  clear(): void {
    commit(EMPTY);
  },

  // Selectores derivados
  count: () => getCartCount(items),
  subtotal: () => getCartSubtotal(items),
  canCheckout: () => isCartPurchasable(items),
  hasUnavailable: () => resolveCart(items).some((i) => i.unavailable),
};
