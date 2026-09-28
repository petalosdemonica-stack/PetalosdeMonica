import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, normalizeSlug, products } from "@/lib/products";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRightIcon } from "@/components/Icons";

type Params = { params: Promise<{ slug: string }> };

/**
 * Los productos del catálogo son conocidos en build time. Con
 * `dynamicParams = false`, cualquier slug desconocido se resuelve con la
 * página 404 real (`app/coleccion/[slug]/not-found.tsx`) en lugar de una
 * ruta dinámica que falla en render (sección 63).
 */
export const dynamicParams = false;

/** Genera metadata por producto para SEO (sección 57). */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(normalizeSlug(slug));

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/coleccion/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `/coleccion/${product.slug}`,
      images: [{ url: product.image, alt: product.name }],
    },
  };
}

/** Genera las rutas estáticas de todos los productos (sección 21). */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProductBySlug(normalizeSlug(slug));

  // Slug inexistente → página 404 (sección 63).
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <div className="container-page pt-28 pb-16 md:pt-36 md:pb-24">
        <nav aria-label="Migas de pan" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-400">
            <li>
              <Link href="/" className="transition-colors hover:text-petal-700">
                Inicio
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/coleccion"
                className="transition-colors hover:text-petal-700"
              >
                Colección
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink-700" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <ProductDetail product={product} />
      </div>

      {related.length > 0 && (
        <section className="border-t border-cream-200 bg-cream-100 py-16 md:py-20">
          <div className="container-page">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] leading-tight">
                También te puede interesar
              </h2>
              <Link
                href="/coleccion"
                className="hidden shrink-0 items-center gap-2 text-xs tracking-[0.1em] uppercase transition-colors hover:text-petal-700 sm:inline-flex"
              >
                Ver todo
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
