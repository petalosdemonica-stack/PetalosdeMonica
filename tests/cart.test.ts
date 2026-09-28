import { describe, expect, it } from "vitest";
import {
  clampQuantity,
  getCartCount,
  getCartSubtotal,
  isCartPurchasable,
  normalizeCart,
  resolveCart,
} from "@/lib/cart";
import { getProductById, products } from "@/lib/products";

describe("carrito: normalización", () => {
  it("fusiona el mismo producto en una sola línea", () => {
    const result = normalizeCart([
      { productId: "1", quantity: 2 },
      { productId: "1", quantity: 3 },
    ]);
    expect(result).toEqual([{ productId: "1", quantity: 5 }]);
  });

  it("descarta productos que ya no existen en el catálogo", () => {
    const result = normalizeCart([
      { productId: "1", quantity: 1 },
      { productId: "9999", quantity: 4 },
    ]);
    expect(result).toEqual([{ productId: "1", quantity: 1 }]);
  });

  it("nunca deja cantidades fuera del rango permitido", () => {
    const result = normalizeCart([{ productId: "1", quantity: 9999 }]);
    expect(result[0].quantity).toBe(99);
  });
});

describe("carrito: límites de cantidad (sección 65)", () => {
  it("clamp enforce el mínimo 1", () => {
    expect(clampQuantity(0)).toBe(1);
    expect(clampQuantity(-5)).toBe(1);
  });

  it("clamp enforce el máximo 99", () => {
    expect(clampQuantity(1000)).toBe(99);
  });

  it("descarta valores no numéricos", () => {
    expect(clampQuantity(Number.NaN)).toBe(1);
    expect(clampQuantity(Number.POSITIVE_INFINITY)).toBe(1);
  });

  it("trunca decimales", () => {
    expect(clampQuantity(3.9)).toBe(3);
  });
});

describe("carrito: totales", () => {
  it("cuenta unidades, no productos distintos (sección 28)", () => {
    const count = getCartCount([
      { productId: "1", quantity: 3 },
      { productId: "2", quantity: 1 },
    ]);
    expect(count).toBe(4);
  });

  it("calcula el subtotal con los precios del catálogo", () => {
    const ramo = getProductById("1")!;
    const girasoles = getProductById("2")!;
    const subtotal = getCartSubtotal([
      { productId: "1", quantity: 2 },
      { productId: "2", quantity: 1 },
    ]);
    expect(subtotal).toBe(ramo.price * 2 + girasoles.price);
  });

  it("un carrito vacío tiene subtotal 0 y no permite pagar", () => {
    expect(getCartSubtotal([])).toBe(0);
    expect(isCartPurchasable([])).toBe(false);
  });
});

describe("carrito: disponibilidad", () => {
  it("bloquea el checkout si hay un producto agotado", () => {
    const soldOut = products.find((p) => !p.available)!;
    expect(isCartPurchasable([{ productId: soldOut.id, quantity: 1 }])).toBe(false);
  });

  it("marca la línea como no disponible sin romperse (sección 64)", () => {
    const soldOut = products.find((p) => !p.available)!;
    const [line] = resolveCart([{ productId: soldOut.id, quantity: 1 }]);
    expect(line.unavailable).toBe(true);
    expect(line.product.name).toBe(soldOut.name);
  });
});
