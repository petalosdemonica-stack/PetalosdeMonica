"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { resolveCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import { shippingConfig } from "@/lib/config";
import { CartItemRow } from "./CartItem";
import { CheckoutButton } from "./CheckoutButton";
import { BagIcon, CloseIcon, FlowerIcon } from "./Icons";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    count,
    subtotal,
    hasUnavailableItems,
    clearCart,
  } = useCart();

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  const lines = resolveCart(items);

  // Bloquear el scroll del body con el drawer abierto.
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeCart]);

  // Mantener el foco dentro del panel mientras está abierto.
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const panel = panelRef.current;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    panel.addEventListener("keydown", onKeyDown);
    return () => panel.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;
  const isEmpty = lines.length === 0;


  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-cream-50 shadow-lift sm:w-[26rem]"
      >
        <div className="flex items-center justify-between border-b border-cream-200 px-5 py-4">
          <h2
            id="cart-title"
            className="font-display text-lg tracking-[0.1em] uppercase"
          >
            Tu carrito
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream-200"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {isEmpty ? (
          /* Carrito vacío: diseño propio, no un texto plano (sección 23) */
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-petal-50">
              <FlowerIcon className="h-8 w-8 text-petal-300" />
            </span>
            <h3 className="mt-6 font-display text-2xl leading-snug">
              Tu carrito está esperando flores
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Descubre nuestra colección y encuentra el regalo perfecto.
            </p>
            <Link
              href="/coleccion"
              onClick={closeCart}
              className="btn btn-primary mt-7"
            >
              <BagIcon className="h-4 w-4" />
              Ver colección
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-cream-200 overflow-y-auto px-5">
              {lines.map((item) => (
                <CartItemRow key={item.product.id} item={item} />
              ))}
            </ul>


            <div className="border-t border-cream-200 px-5 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">
                    Subtotal ({count}{" "}
                    {count === 1 ? "producto" : "productos"})
                  </dt>
                  <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">{shippingConfig.label}</dt>
                  <dd className="text-ink-400">{shippingConfig.note}</dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-cream-200 pt-3">
                  <dt className="text-[0.8125rem] tracking-[0.12em] uppercase">
                    Total
                  </dt>
                  <dd className="font-display text-2xl tabular-nums">
                    {formatPrice(subtotal)}
                  </dd>
                </div>
              </dl>

              {hasUnavailableItems && (
                <p
                  role="alert"
                  className="mt-3 rounded-xl bg-petal-50 px-4 py-2.5 text-xs text-petal-700"
                >
                  Hay productos agotados en tu carrito. Elimínalos para pagar.
                </p>
              )}

              <div className="mt-5">
                <CheckoutButton />
              </div>

              {/* Vaciar carrito con confirmación */}
              <div className="mt-3 text-center">
                {confirmClear ? (
                  <div className="flex items-center justify-center gap-3 text-xs">
                    <span className="text-ink-500">¿Vaciar el carrito?</span>
                    <button
                      type="button"
                      onClick={() => {
                        clearCart();
                        setConfirmClear(false);
                      }}
                      className="font-medium text-petal-700 underline underline-offset-2"
                    >
                      Sí, vaciar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="text-ink-400 underline underline-offset-2"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="text-xs text-ink-400 underline underline-offset-2 transition-colors hover:text-petal-700"
                  >
                    Vaciar carrito
                  </button>
                )}
              </div>

              <p className="mt-4 text-center text-[0.6875rem] text-ink-400">
                Pago seguro gestionado por Mercado Pago.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
