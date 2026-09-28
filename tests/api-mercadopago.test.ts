import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getProductById, products } from "@/lib/products";

/**
 * Tests de seguridad del endpoint de Mercado Pago (secciones 68, 93).
 *
 * Se verifica que el servidor:
 *  - rechace body, items y cantidades inválidas,
 *  - resuelva el precio desde el catálogo (nunca desde el cliente),
 *  - rechace productos inexistentes y agotados.
 */

// Mock del SDK: evita llamadas reales y permite inspeccionar la preferencia.
const createPreference = vi.fn();

vi.mock("mercadopago", () => ({
  MercadoPagoConfig: class {
    constructor(public config: { accessToken: string }) {}
  },
  Preference: class {
    create = createPreference;
  },
}));

async function post(body: unknown, raw?: string) {
  const { POST } = await import("@/app/api/mercadopago/route");
  const request = new Request("http://localhost/api/mercadopago", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: raw ?? JSON.stringify(body),
  });
  return POST(request);
}

describe("API Mercado Pago: autenticación", () => {
  beforeEach(() => {
    createPreference.mockReset();
    createPreference.mockResolvedValue({
      id: "pref_1",
      init_point: "https://www.mercadopago.cl/checkout/v1/redirect?pref_id=pref_1",
    });
  });

  afterEach(() => {
    delete process.env.MP_ACCESS_TOKEN;
    vi.restoreAllMocks();
  });

  it("responde 503 si falta MP_ACCESS_TOKEN y NO filtra secretos", async () => {
    delete process.env.MP_ACCESS_TOKEN;
    const response = await post({ items: [{ productId: "1", quantity: 1 }] });
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.code).toBe("PAYMENT_UNAVAILABLE");
    // Nunca devolver el token ni el nombre de la variable.
    expect(JSON.stringify(body)).not.toContain("MP_ACCESS_TOKEN");
  });

  it("crea la preferencia y devuelve initPoint (200)", async () => {
    process.env.MP_ACCESS_TOKEN = "APP_USR-test-token";
    const response = await post({ items: [{ productId: "1", quantity: 2 }] });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.initPoint).toContain("mercadopago");
    expect(body).not.toHaveProperty("accessToken");
  });
});


describe("API Mercado Pago: validación de entrada (secciones 66, 68, 93)", () => {
  beforeEach(() => {
    process.env.MP_ACCESS_TOKEN = "APP_USR-test-token";
    createPreference.mockReset();
    createPreference.mockResolvedValue({
      id: "pref_1",
      init_point: "https://www.mercadopago.cl/checkout/v1/redirect?pref_id=pref_1",
    });
  });

  afterEach(() => {
    delete process.env.MP_ACCESS_TOKEN;
  });

  it("rechaza un body que no es JSON válido (400)", async () => {
    const response = await post(undefined, "{ no-json");
    expect(response.status).toBe(400);
    expect(createPreference).not.toHaveBeenCalled();
  });

  it("rechaza un body vacío (400)", async () => {
    const response = await post({});
    expect(response.status).toBe(400);
  });

  it("rechaza un carrito vacío (400)", async () => {
    const response = await post({ items: [] });
    expect(response.status).toBe(400);
    expect(createPreference).not.toHaveBeenCalled();
  });

  it("rechaza items que no son un array (400)", async () => {
    const response = await post({ items: "producto" });
    expect(response.status).toBe(400);
  });

  it("rechaza productId inexistente (404)", async () => {
    const response = await post({
      items: [{ productId: "no-existe", quantity: 1 }],
    });
    expect(response.status).toBe(404);
    expect(createPreference).not.toHaveBeenCalled();
  });

  it("rechaza productId que no es string (400)", async () => {
    const response = await post({ items: [{ productId: 42, quantity: 1 }] });
    expect(response.status).toBe(400);
  });

  it("rechaza quantity = 0 (400)", async () => {
    const response = await post({ items: [{ productId: "1", quantity: 0 }] });
    expect(response.status).toBe(400);
  });

  it("rechaza quantity negativa (400)", async () => {
    const response = await post({ items: [{ productId: "1", quantity: -1 }] });
    expect(response.status).toBe(400);
  });

  it("rechaza quantity decimal (400)", async () => {
    const response = await post({ items: [{ productId: "1", quantity: 1.5 }] });
    expect(response.status).toBe(400);
  });

  it("rechaza quantity enorme como string (400)", async () => {
    const response = await post({
      items: [{ productId: "1", quantity: "999999" }],
    });
    expect(response.status).toBe(400);
  });

  it("rechaza quantity = 999999 numérico (400)", async () => {
    const response = await post({ items: [{ productId: "1", quantity: 999999 }] });
    expect(response.status).toBe(400);
    expect(createPreference).not.toHaveBeenCalled();
  });

  it("rechaza un producto agotado (409)", async () => {
    const soldOut = products.find((p) => !p.available)!;
    const response = await post({
      items: [{ productId: soldOut.id, quantity: 1 }],
    });
    expect(response.status).toBe(409);
    expect(createPreference).not.toHaveBeenCalled();
  });

  it("acepta el máximo permitido (99) y crea la preferencia", async () => {
    const response = await post({ items: [{ productId: "1", quantity: 99 }] });
    expect(response.status).toBe(200);
  });

  it("no filtra detalles técnicos en los mensajes de error", async () => {
    const response = await post({
      items: [{ productId: "no-existe", quantity: 1 }],
    });
    const text = JSON.stringify(await response.json());
    expect(text).not.toMatch(/TypeError|ReferenceError|at Object|\.ts:\d+/);
  });
});

describe("API Mercado Pago: seguridad de precios (secciones 34, 76)", () => {
  beforeEach(() => {
    process.env.MP_ACCESS_TOKEN = "APP_USR-test-token";
    createPreference.mockReset();
    createPreference.mockResolvedValue({
      id: "pref_1",
      init_point: "https://www.mercadopago.cl/checkout/v1/redirect?pref_id=pref_1",
    });
  });

  afterEach(() => {
    delete process.env.MP_ACCESS_TOKEN;
  });

  /** Extrae los items que se enviaron realmente a Mercado Pago. */
  function sentItems() {
    const { body } = createPreference.mock.calls[0][0];
    return body.items as {
      id: string;
      quantity: number;
      unit_price: number;
    }[];
  }

  it("ignora un price manipulado por el cliente y usa el del catálogo", async () => {
    const real = getProductById("1")!;
    const response = await post({
      items: [{ productId: "1", quantity: 1, price: 1, unit_price: 1 }],
    });

    expect(response.status).toBe(200);
    expect(sentItems()[0].unit_price).toBe(real.price);
    expect(sentItems()[0].unit_price).not.toBe(1);
  });

  it("ignora un precio de 0 enviado por el cliente", async () => {
    const real = getProductById("1")!;
    await post({ items: [{ productId: "1", quantity: 1, price: 0 }] });
    expect(sentItems()[0].unit_price).toBe(real.price);
  });

  it("ignora un precio negativo enviado por el cliente", async () => {
    const real = getProductById("1")!;
    await post({ items: [{ productId: "1", quantity: 1, price: -5000 }] });
    expect(sentItems()[0].unit_price).toBe(real.price);
  });

  it("el total se calcula con los precios reales del catálogo", async () => {
    const ramo = getProductById("1")!;
    const girasoles = getProductById("2")!;
    await post({
      items: [
        { productId: "1", quantity: 2 },
        { productId: "2", quantity: 1 },
      ],
    });
    const { body } = createPreference.mock.calls[0][0];
    expect(body.metadata.total).toBe(ramo.price * 2 + girasoles.price);
  });

  it("envía las URLs de retorno configuradas en el servidor", async () => {
    await post({ items: [{ productId: "1", quantity: 1 }] });
    const { body } = createPreference.mock.calls[0][0];
    expect(body.back_urls.success).toMatch(/\/checkout\/success$/);
    expect(body.back_urls.pending).toMatch(/\/checkout\/pending$/);
    expect(body.back_urls.failure).toMatch(/\/checkout\/failure$/);
  });
});
