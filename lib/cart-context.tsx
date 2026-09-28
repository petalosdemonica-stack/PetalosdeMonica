"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { cartRules } from "./config";
import { cartStore } from "./cart-store";
import type { CartItem } from "./cart";

type CartContextValue = {
  items: CartItem[];
  /** `false` hasta que el carrito se hidrata desde localStorage. */
  ready: boolean;
  isOpen: boolean;
  count: number;
  subtotal: number;
  canCheckout: boolean;
  /** Hay líneas que ya no se pueden comprar (agotadas). */
  hasUnavailableItems: boolean;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  /*
   * El carrito vive fuera de React (patrón useSyncExternalStore).
   * Durante el render del servidor se usa siempre la instantánea vacía, por
   * lo que nunca se accede a localStorage en SSR ni hay hydration mismatch.
   */
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const ready = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.isHydrated,
    cartStore.getServerHydrated,
  );

  const [isOpen, setIsOpen] = useState(false);

  // Hidratación posterior al montaje + sincronización entre pestañas.
  useEffect(() => {
    cartStore.hydrate();

    function onStorage(event: StorageEvent) {
      if (event.key !== cartRules.storageKey) return;
      cartStore.syncFromStorage();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Los selectores se recalculan cuando cambia el contenido del carrito.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const count = useMemo(() => cartStore.count(), [items]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const subtotal = useMemo(() => cartStore.subtotal(), [items]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const canCheckout = useMemo(() => cartStore.canCheckout(), [items]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const hasUnavailableItems = useMemo(() => cartStore.hasUnavailable(), [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      isOpen,
      count,
      subtotal,
      canCheckout,
      hasUnavailableItems,
      addItem: cartStore.add,
      setQuantity: cartStore.setQuantity,
      increment: cartStore.increment,
      decrement: cartStore.decrement,
      removeItem: cartStore.remove,
      clearCart: cartStore.clear,
      openCart,
      closeCart,
    }),
    [
      items,
      ready,
      isOpen,
      count,
      subtotal,
      canCheckout,
      hasUnavailableItems,
      openCart,
      closeCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
