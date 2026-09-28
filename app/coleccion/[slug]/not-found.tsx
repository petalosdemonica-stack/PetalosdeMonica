import Link from "next/link";
import { FlowerIcon } from "@/components/Icons";

/**
 * 404 específico de la sección Colección (sección 63).
 *
 * `notFound()` desde `app/coleccion/[slug]/page.tsx` se resuelve con esta
 * frontera, de modo que el usuario ve el mensaje dentro del layout
 * (header y footer) en lugar de una pantalla vacía.
 */
export default function ProductNotFound() {
  return (
    <div className="container-page flex min-h-[70svh] flex-col items-center justify-center py-28 text-center md:py-36">
      <FlowerIcon className="h-10 w-10 text-petal-300" />
      <p className="eyebrow mt-6">Error 404</p>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-tight">
        Producto no encontrado
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500 md:text-base">
        Este producto ya no está disponible.
      </p>
      <Link href="/coleccion" className="btn btn-primary mt-9">
        Ver colección
      </Link>
    </div>
  );
}
