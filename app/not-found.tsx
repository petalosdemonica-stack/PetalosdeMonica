import Link from "next/link";
import { FlowerIcon } from "@/components/Icons";

/** 404 global: nunca una pantalla rota (sección 63). */
export default function NotFound() {
  return (
    <div className="container-page flex min-h-[80svh] flex-col items-center justify-center py-28 text-center md:py-36">
      <FlowerIcon className="h-10 w-10 text-petal-300" />
      <p className="mt-6 eyebrow">Error 404</p>
      <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-tight">
        Producto no encontrado
      </h1>
      <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-500">
        Este producto ya no está disponible.
      </p>
      <Link href="/coleccion" className="btn btn-primary mt-9">
        Ver colección
      </Link>
    </div>
  );
}
