"use client";

import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { cartRules } from "@/lib/config";
import { formatPrice } from "@/lib/format";
import type { ResolvedCartItem } from "@/lib/cart";
import { TrashIcon } from "./Icons";

export function CartItemRow({ item }: { item: ResolvedCartItem }) {
  const { product, quantity, lineTotal } = item;
  const { increment, decrement, setQuantity, removeItem } = useCart();

  const soldOut = !product.available;
  const atMax = quantity >= cartRules.maxQuantity;

  return (
    <li className="flex gap-4 py-5">
      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-cream-200">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-base">{product.name}</h3>
            <p className="mt-0.5 text-xs text-ink-400">{product.category}</p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(product.id)}
            aria-label={`Eliminar ${product.name} del carrito`}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-cream-200 hover:text-petal-700"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>

        {soldOut ? (
          <p className="mt-2 inline-flex w-fit rounded-full bg-petal-100 px-3 py-1 text-[0.625rem] tracking-[0.12em] text-petal-700 uppercase">
            Agotado — elimina para continuar
          </p>
        ) : (
          <div className="mt-3 flex items-center justify-between gap-3">
            {/* Control de cantidad */}
            <div className="flex items-center rounded-full border border-cream-300">
              <button
                type="button"
                onClick={() => decrement(product.id)}
                aria-label={`Quitar una unidad de ${product.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-cream-100"
              >
                −
              </button>
              <input
                type="number"
                inputMode="numeric"
                min={cartRules.minQuantity}
                max={cartRules.maxQuantity}
                value={quantity}
                onChange={(e) => setQuantity(product.id, Number(e.target.value))}
                aria-label={`Cantidad de ${product.name}`}
                className="w-9 border-0 bg-transparent text-center text-sm tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <button
                type="button"
                onClick={() => increment(product.id)}
                disabled={atMax}
                aria-label={`Agregar una unidad de ${product.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-full text-lg leading-none transition-colors hover:bg-cream-100 disabled:opacity-30"
              >
                +
              </button>
            </div>

            <span className="text-sm tabular-nums">{formatPrice(lineTotal)}</span>
          </div>
        )}
      </div>
    </li>
  );
}
