"use client";

import { useEffect, useState } from "react";
import { getActivePromotions } from "@/lib/promotions";
import type { Promotion } from "@/lib/promotions";
import { PromotionBanner } from "./PromotionBanner";

/**
 * Muestra las promociones vigentes.
 *
 * La evaluación depende de la hora actual, por eso ocurre en el cliente:
 * durante el render del servidor se muestra un placeholder y las tarjetas
 * aparecen tras la hidratación. Así no hay hydration mismatch ni llamadas
 * a `Date.now()` durante el render.
 */
export function PromotionSection() {
  const [active, setActive] = useState<Promotion[] | null>(null);

  useEffect(() => {
    const update = () => setActive(getActivePromotions(Date.now()));
    update();
    // Revisar cada 30 s mantiene la sección al día sin recargar la página.
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (active === null || active.length === 0) return null;

  return (
    <>
      {active.map((promotion) => (
        <PromotionBanner key={promotion.id} promotion={promotion} />
      ))}
    </>
  );
}