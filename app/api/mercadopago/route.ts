import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { cartRules, siteConfig } from "@/lib/config";
import { getProductById } from "@/lib/products";
import { clampQuantity, type CartItem } from "@/lib/cart";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApiError = {
  status: number;
  code: string;
  message: string;
  field?: string;
};

const badRequest = (message: string, field?: string): ApiError => ({
  status: 400,
  code: "BAD_REQUEST",
  message,
  field,
});

/**
 * Valida el body recibido.
 *
 * REGLA DE ORO: el cliente envía únicamente `productId` y `quantity`.
 * Cualquier campo de precio enviado por el frontend se IGNORA.
 */
function parseItems(body: unknown): CartItem[] | ApiError {
  if (!body || typeof body !== "object") {
    return badRequest("Solicitud inválida.", "body");
  }
  const rawItems = (body as { items?: unknown }).items;
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return badRequest("El carrito está vacío.", "items");
  }
  if (rawItems.length > 50) {
    return badRequest("Demasiados productos en el carrito.", "items");
  }

  const merged = new Map<string, number>();
  for (const raw of rawItems) {
    if (!raw || typeof raw !== "object") {
      return badRequest("Hay un producto inválido en el carrito.", "items");
    }
    const { productId, quantity } = raw as Record<string, unknown>;

    if (typeof productId !== "string" || productId.length === 0) {
      return badRequest("Hay un producto inválido en el carrito.", "productId");
    }

    // `quantity` debe ser un entero. Se rechazan 0, negativos, decimales,
    // null, NaN, Infinity y strings.
    if (
      typeof quantity !== "number" ||
      !Number.isInteger(quantity) ||
      quantity < cartRules.minQuantity
    ) {
      return badRequest("Cantidad inválida en el carrito.", "quantity");
    }
    if (quantity > cartRules.maxQuantity) {
      return badRequest(
        `La cantidad máxima por producto es ${cartRules.maxQuantity}.`,
        "quantity",
      );
    }

    const total = (merged.get(productId) ?? 0) + quantity;
    if (total > cartRules.maxQuantity) {
      return badRequest(
        `La cantidad máxima por producto es ${cartRules.maxQuantity}.`,
        "quantity",
      );
    }
    merged.set(productId, total);
  }

  return Array.from(merged, ([productId, quantity]) => ({
    productId,
    quantity: clampQuantity(quantity),
  }));
}

function isApiError(value: CartItem[] | ApiError): value is ApiError {
  return !Array.isArray(value);
}


export async function POST(request: Request) {
  // 1. Token solo en servidor. Nunca se devuelve al cliente.
  const accessToken = process.env.MP_ACCESS_TOKEN?.trim();
  if (!accessToken) {
    console.error("[mercadopago] Falta MP_ACCESS_TOKEN en el servidor.");
    return NextResponse.json(
      {
        error: "El pago no está disponible en este momento.",
        code: "PAYMENT_UNAVAILABLE",
      },
      { status: 503 },
    );
  }

  // 2. Parsear y validar el body.
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Solicitud inválida.", code: "BAD_REQUEST" },
      { status: 400 },
    );
  }

  const parsed = parseItems(body);
  if (isApiError(parsed)) {
    return NextResponse.json(
      { error: parsed.message, code: parsed.code, field: parsed.field },
      { status: parsed.status },
    );
  }

  // 3. RESOLVER PRODUCTOS Y PRECIOS EN EL SERVIDOR.
  //    El precio enviado por el cliente no existe: no se lee, no se confía.
  const lines: {
    id: string;
    title: string;
    description: string;
    picture_url: string;
    quantity: number;
    unit_price: number;
    currency_id: string;
  }[] = [];
  const unavailable: string[] = [];

  for (const item of parsed) {
    const product = getProductById(item.productId);
    if (!product) {
      return NextResponse.json(
        {
          error: "Uno de los productos ya no está disponible.",
          code: "PRODUCT_NOT_FOUND",
        },
        { status: 404 },
      );
    }
    if (!product.available) {
      unavailable.push(product.name);
      continue;
    }
    lines.push({
      id: product.id,
      title: product.name,
      description: product.shortDescription,
      picture_url: product.image,
      quantity: item.quantity,
      unit_price: product.price, // precio real del catálogo
      currency_id: "CLP",
    });
  }

  if (unavailable.length > 0) {
    return NextResponse.json(
      {
        error: `Sin stock: ${unavailable.join(", ")}.`,
        code: "PRODUCT_UNAVAILABLE",
      },
      { status: 409 },
    );
  }

  if (lines.length === 0) {
    return NextResponse.json(
      { error: "El carrito está vacío.", code: "EMPTY_CART" },
      { status: 400 },
    );
  }

  const total = lines.reduce((sum, l) => sum + l.unit_price * l.quantity, 0);

  // 4. Crear la preferencia de Mercado Pago.
  const siteUrl = siteConfig.url;
  try {
    const client = new MercadoPagoConfig({ accessToken });
    const preference = await new Preference(client).create({
      body: {
        items: lines,
        back_urls: {
          success: `${siteUrl}/checkout/success`,
          pending: `${siteUrl}/checkout/pending`,
          failure: `${siteUrl}/checkout/failure`,
        },
        auto_return: "approved",
        statement_descriptor: siteConfig.name.toUpperCase().slice(0, 20),
        external_reference: `pdm-${Date.now()}`,
        metadata: { total },
      },
    });

    if (!preference.init_point) {
      console.error("[mercadopago] La preferencia no devolvió init_point.");
      return NextResponse.json(
        {
          error: "No pudimos preparar el pago. Inténtalo nuevamente.",
          code: "PREFERENCE_FAILED",
        },
        { status: 502 },
      );
    }

    return NextResponse.json(
      { initPoint: preference.init_point, preferenceId: preference.id },
      { status: 200 },
    );
  } catch (error) {
    // Log interno. Nunca se devuelve el error real al cliente.
    console.error(
      "[mercadopago] Error al crear la preferencia:",
      error instanceof Error ? error.message : "error desconocido",
    );
    return NextResponse.json(
      {
        error: "No pudimos procesar el pago. Inténtalo nuevamente.",
        code: "PAYMENT_ERROR",
      },
      { status: 500 },
    );
  }
}
