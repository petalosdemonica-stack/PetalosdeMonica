"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPromotionState, shouldShowCountdown, type Promotion } from "@/lib/promotions";
import { Reveal } from "./Reveal";
import { CountdownTimer } from "./CountdownTimer";
import { ArrowRightIcon } from "./Icons";

/**
 * Banner de una promoción.
 *
 * El reloj SOLO aparece si `showCountdown` es true, hay `endDate` y la
 * promoción sigue vigente. Nunca vive en el Hero (secciones 40 y 82).
 */
export function PromotionBanner({ promotion }: { promotion: Promotion }) {
  const [state, setState] = useState<ReturnType<typeof getPromotionState>>(
    "inactive",
  );
  const [showClock, setShowClock] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      setState(getPromotionState(promotion, now));
      setShowClock(shouldShowCountdown(promotion, now));
    };
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, [promotion]);

  if (state !== "active") return null;

  return (
    <section className="container-page py-16 md:py-20">
      <Reveal className="relative overflow-hidden rounded-[1.75rem] bg-ink-900">
        <Image
          src={promotion.image ?? ""}
          alt=""
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-ink-900/85 via-ink-900/60 to-ink-900/40"
        />

        <div className="relative z-10 flex flex-col gap-8 p-8 text-cream-50 md:flex-row md:items-center md:justify-between md:p-14">
          <div className="max-w-lg">
            {promotion.eyebrow && (
              <p className="text-[0.625rem] tracking-[0.28em] text-cream-50/70 uppercase">
                {promotion.eyebrow}
              </p>
            )}
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-tight">
              {promotion.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-cream-50/80">
              {promotion.description}
            </p>
            <Link href={promotion.href} className="btn btn-light mt-6">
              {promotion.ctaLabel}
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>

          {showClock && promotion.endDate && (
            <div className="shrink-0">
              {promotion.discountText && (
                <p className="mb-3 font-display text-2xl text-petal-300">
                  {promotion.discountText}
                </p>
              )}
              <CountdownTimer endDate={promotion.endDate} />
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
