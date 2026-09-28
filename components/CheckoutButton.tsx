"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { SpinnerIcon } from "./Icons";

type Status = "idle" | "loading" | "error";

/**
 * Botón de checkout.
 *
 * REGLA: se envía solo `{ productId, quantity }`. El precio lo resuelve el
 * servidor; el cliente jamás envía precios.
 *
 * El carrito NO se limpia antes de que Mercado Pago confirme el pago: así, si
 * algo falla, el usuario puede reintentar sin perder sus productos (sección 80).
 */
export function CheckoutButton() {
  const { items, canCheckout, ready } = useCart();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  // Bloqueo síncrono contra doble clic (evita dos POST simultáneos).
  const inFlight = useRef(false);
  const redirectTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimer.current) window.clearTimeout(redirectTimer.current);
    };
  }, []);

  const handleCheckout = useCallback(async () => {
    if (inFlight.current || !canCheckout) return;
    inFlight.current = true;
    setStatus("loading");
    setMessage(null);

    // Snapshot: el carrito se vacía al confirmar el redirect.
    const payload = {
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch("/api/mercadopago", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const error =
          data && typeof data === "object" && "error" in data
            ? String((data as { error: unknown }).error)
            : "No pudimos procesar tu solicitud. Inténtalo nuevamente.";
        setStatus("error");
        setMessage(error);
        inFlight.current = false;
        return;
      }

      const initPoint =
        data && typeof data === "object" && "initPoint" in data
          ? (data as { initPoint: unknown }).initPoint
          : null;

      if (typeof initPoint !== "string" || !initPoint) {
        setStatus("error");
        setMessage(
          "No pudimos procesar tu solicitud. Inténtalo nuevamente.",
        );
        inFlight.current = false;
        return;
      }

      // NO se limpia el carrito todavía (sección 80).
      // Si el pago falla o queda pendiente, el usuario conserva sus productos
      // y puede reintentar. El carrito se vacía recién en /checkout/success.
      redirectTimer.current = window.setTimeout(() => {
        window.location.assign(initPoint);
      }, 600);
    } catch {
      setStatus("error");
      setMessage("No pudimos procesar tu solicitud. Inténtalo nuevamente.");
      inFlight.current = false;
    }
  }, [items, canCheckout]);

  const disabled = !ready || !canCheckout || status === "loading";

  return (
    <div>
      <button
        type="button"
        onClick={handleCheckout}
        disabled={disabled}
        aria-busy={status === "loading"}
        className="btn btn-primary w-full"
      >
        {status === "loading" ? (
          <>
            <SpinnerIcon className="h-4 w-4" />
            Preparando tu pago...
          </>
        ) : (
          "Pagar con Mercado Pago"
        )}
      </button>

      {status === "error" && (
        <div
          role="alert"
          className="mt-3 rounded-xl bg-petal-50 px-4 py-3 text-sm text-petal-700"
        >
          <p>{message}</p>
          <button
            type="button"
            onClick={handleCheckout}
            className="mt-2 text-xs tracking-[0.12em] underline uppercase hover:opacity-70"
          >
            Reintentar
          </button>
        </div>
      )}

      {!canCheckout && ready && (
        <p className="mt-3 text-center text-xs text-ink-400">
          Agrega productos disponibles al carrito para continuar.
        </p>
      )}
    </div>
  );
}
