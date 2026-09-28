import { Suspense } from "react";
import type { Metadata } from "next";
import { ProductGrid } from "@/components/ProductGrid";

export const metadata: Metadata = {
  title: "Colección",
  description:
    "Ramos, bouquets y arreglos artesanales hechos con limpia pipa. Explora nuestra colección completa.",
  alternates: { canonical: "/coleccion" },
};

export default function CollectionPage() {
  return (
    <>
      {/* Espaciado para el header fijo */}
      <div className="container-page pt-28 md:pt-36">
        <p className="eyebrow">Pétalos de Mónica</p>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-tight">
          Nuestra colección
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-500 md:text-base">
          Creaciones hechas a mano para regalar algo diferente.
        </p>
      </div>

      <Suspense fallback={<div className="container-page py-20" />}>
        <ProductGrid />
      </Suspense>
    </>
  );
}
