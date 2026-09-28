"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";
import { BagIcon } from "./Icons";

export function ProductCard({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const soldOut = !product.available;

  function handleAdd() {
    if (soldOut) return;
    addItem(product.id, 1);
    openCart(); // abrir el drawer al agregar
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-card border border-cream-200 bg-cream-50 transition-all duration-300 hover:-translate-y-1 hover:border-cream-300 hover:shadow-lift">
      {/* Imagen: nunca se deforma (aspect-ratio + object-cover) */}
      <Link
        href={`/coleccion/${product.slug}`}
        className="relative block aspect-[4/5] overflow-hidden bg-cream-200"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={product.image}
          alt=""
          fill
          loading="lazy"
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {soldOut && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-900/85 px-3 py-1 text-[0.625rem] tracking-[0.18em] text-cream-50 uppercase">
            Agotado
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{product.category}</p>

        <h3 className="mt-2 font-display text-xl leading-snug">
          <Link
            href={`/coleccion/${product.slug}`}
            className="transition-colors hover:text-petal-700"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
          {product.shortDescription}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="font-display text-xl tabular-nums">
            {formatPrice(product.price)}
          </span>

          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            aria-label={
              soldOut
                ? `${product.name} agotado`
                : `Agregar ${product.name} al carrito`
            }
            className="btn btn-primary px-5 py-2.5 text-[0.6875rem] group-hover:bg-petal-700"
          >
            {soldOut ? "Agotado" : (
              <>
                <BagIcon className="h-3.5 w-3.5" />
                Agregar
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
