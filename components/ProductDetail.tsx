"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import { cartRules } from "@/lib/config";
import { clampQuantity } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/products";
import { ArrowRightIcon, BagIcon } from "./Icons";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];
  const soldOut = !product.available;

  function handleAdd() {
    if (soldOut) return;
    addItem(product.id, quantity);
    openCart();
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-16">
      {/* Galería */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-[1.75rem] bg-cream-200">
          <Image
            src={images[activeImage]}
            alt={`${product.name} — imagen ${activeImage + 1} de ${images.length}`}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
          {soldOut && (
            <span className="absolute left-4 top-4 rounded-full bg-ink-900/85 px-4 py-1.5 text-[0.6875rem] tracking-[0.18em] text-cream-50 uppercase">
              Agotado
            </span>
          )}
        </div>

        {images.length > 1 && (
          <ul className="mt-4 flex gap-3" aria-label="Galería del producto">
            {images.map((src, index) => (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setActiveImage(index)}
                  aria-label={`Ver imagen ${index + 1}`}
                  aria-current={index === activeImage}
                  className={[
                    "relative h-20 w-20 overflow-hidden rounded-xl bg-cream-200 transition-all",
                    index === activeImage
                      ? "ring-2 ring-ink-900 ring-offset-2 ring-offset-cream-50"
                      : "opacity-70 hover:opacity-100",
                  ].join(" ")}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>


      {/* Información */}
      <div className="flex flex-col">
        <Link
          href={`/coleccion?categoria=${encodeURIComponent(product.category)}`}
          className="eyebrow w-fit transition-colors hover:text-petal-700"
        >
          {product.category}
        </Link>

        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] leading-tight">
          {product.name}
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-ink-500 md:text-base">
          {product.description}
        </p>

        <p className="mt-7 font-display text-3xl tabular-nums">
          {formatPrice(product.price)}
        </p>

        {!soldOut && (
          <div className="mt-7">
            <label
              htmlFor="product-quantity"
              className="text-[0.8125rem] tracking-[0.1em] text-ink-500 uppercase"
            >
              Cantidad
            </label>
            <div className="mt-2.5 flex w-fit items-center rounded-full border border-cream-300">
              <button
                type="button"
                onClick={() => setQuantity((q) => clampQuantity(q - 1))}
                disabled={quantity <= cartRules.minQuantity}
                aria-label="Quitar una unidad"
                className="flex h-11 w-11 items-center justify-center rounded-full text-xl transition-colors hover:bg-cream-100 disabled:opacity-30"
              >
                −
              </button>
              <input
                id="product-quantity"
                type="number"
                inputMode="numeric"
                min={cartRules.minQuantity}
                max={cartRules.maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(clampQuantity(Number(e.target.value)))}
                className="w-12 border-0 bg-transparent text-center tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => clampQuantity(q + 1))}
                disabled={quantity >= cartRules.maxQuantity}
                aria-label="Agregar una unidad"
                className="flex h-11 w-11 items-center justify-center rounded-full text-xl transition-colors hover:bg-cream-100 disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleAdd}
            disabled={soldOut}
            className="btn btn-primary flex-1"
          >
            {soldOut ? (
              "Agotado"
            ) : (
              <>
                <BagIcon className="h-4 w-4" />
                Agregar al carrito
              </>
            )}
          </button>
          <Link href="/coleccion" className="btn btn-secondary">
            Ver colección
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-10 space-y-2.5 border-t border-cream-200 pt-6 text-sm text-ink-500">
          <li>Flores artesanales hechas con limpia pipa.</li>
          <li>Conservan su forma en el tiempo.</li>
          <li>Consulta por piezas personalizadas.</li>
        </ul>
      </div>
    </div>
  );
}
