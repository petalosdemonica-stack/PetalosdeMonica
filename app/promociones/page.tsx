"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getPromotionState, promotions, shouldShowCountdown } from "@/lib/promotions";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ArrowRightIcon } from "@/components/Icons";

export default function PromotionsPage() {
  const [visible, setVisible] = useState<string[] | null>(null);
  const [clocks, setClocks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      setVisible(
        promotions
          .filter((p) => getPromotionState(p, now) === "active")
          .map((p) => p.id),
      );
      setClocks(
        Object.fromEntries(
          promotions.map((p) => [p.id, shouldShowCountdown(p, now)]),
        ),
      );
    };
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Antes de hidratar se muestra un placeholder para evitar desajustes.
  if (visible === null) {
    return <div className="container-page min-h-[60svh] pt-28 md:pt-36" />;
  }

  const active = promotions.filter((p) => visible.includes(p.id));

  return (
    <div className="container-page pt-28 pb-20 md:pt-36">
      <p className="eyebrow">Promociones</p>
      <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-tight">
        Ofertas del momento
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-500 md:text-base">
        Campañas activas en Pétalos de Mónica. Cuando una promoción termina,
        deja de mostrarse automáticamente.
      </p>

      {active.length > 0 ? (
        <ul className="mt-12 space-y-6">
          {active.map((promotion) => (
            <li
              key={promotion.id}
              className="grid overflow-hidden rounded-[1.75rem] border border-cream-200 bg-cream-50 md:grid-cols-2"
            >
              <div className="relative aspect-[16/10] bg-cream-200 md:aspect-auto md:min-h-[18rem]">
                {promotion.image && (
                  <Image
                    src={promotion.image}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col justify-center p-8 md:p-10">
                {promotion.eyebrow && (
                  <p className="eyebrow">{promotion.eyebrow}</p>
                )}
                <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">
                  {promotion.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {promotion.description}
                </p>

                {clocks[promotion.id] && promotion.endDate && (
                  <div className="mt-6">
                    <CountdownTimer endDate={promotion.endDate} />
                  </div>
                )}

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link href={promotion.href} className="btn btn-primary">
                    {promotion.ctaLabel}
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  {promotion.discountText && (
                    <span className="font-display text-xl text-petal-700">
                      {promotion.discountText}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-12 rounded-card border border-dashed border-cream-300 px-6 py-16 text-center">
          <p className="font-display text-xl">No hay promociones activas</p>
          <p className="mt-2 text-sm text-ink-500">
            Mientras tanto, explora nuestra colección completa.
          </p>
          <Link href="/coleccion" className="btn btn-secondary mt-6">
            Ver colección
          </Link>
        </div>
      )}
    </div>
  );
}
