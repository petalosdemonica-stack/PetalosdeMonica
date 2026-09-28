import type { Metadata } from "next";
import { OccasionGrid } from "@/components/OccasionGrid";
import { CustomOrder } from "@/components/CustomOrder";

export const metadata: Metadata = {
  title: "Ocasiones",
  description:
    "Encuentra el regalo perfecto para aniversario, cumpleaños, San Valentín, Día de la Madre, Halloween y más.",
  alternates: { canonical: "/ocaciones" },
};

export default function OccasionsPage() {
  return (
    <>
      <div className="container-page pt-28 md:pt-36">
        <p className="eyebrow">Ocasiones</p>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-tight">
          Encuentra el regalo perfecto
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-500 md:text-base">
          Cada ocasión tiene su propia forma de regalar. Elige la tuya y
          revisa las creaciones disponibles.
        </p>
      </div>

      <OccasionGrid />
      <CustomOrder />
    </>
  );
}
