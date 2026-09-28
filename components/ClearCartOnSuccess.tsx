"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-context";

/**
 * Vacía el carrito SOLO cuando el pago fue aprobado.
 *
 * En `pending` y `failure` el carrito se conserva para que el usuario pueda
 * reintentar sin perder sus productos (sección 80).
 */
export function ClearCartOnSuccess() {
  const { clearCart, ready } = useCart();

  useEffect(() => {
    if (ready) clearCart();
  }, [ready, clearCart]);

  return null;
}
