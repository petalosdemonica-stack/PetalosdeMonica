import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { ProductGrid } from "@/components/ProductGrid";
import { OccasionGrid } from "@/components/OccasionGrid";
import { BrandStory } from "@/components/BrandStory";
import { Benefits } from "@/components/Benefits";
import { CustomOrder } from "@/components/CustomOrder";
import { PromotionSection } from "@/components/PromotionSection";

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* ProductGrid usa useSearchParams → necesita Suspense */}
      <Suspense fallback={<div className="container-page py-20" />}>
        <ProductGrid />
      </Suspense>

      <OccasionGrid />

      {/*
        El reloj pertenece al sistema de promociones, NO al Hero (sección 82).
        La selección de promociones se resuelve en el cliente porque depende
        de la hora actual: Doing Date.now() en el render del servidor daría
        resultados distintos entre el HTML y la hidratación.
      */}
      <PromotionSection />

      <BrandStory />
      <Benefits />
      <CustomOrder />
    </>
  );
}
