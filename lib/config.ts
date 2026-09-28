/**
 * Configuración central del sitio.
 *
 * Reglas:
 * - No inventar información del negocio (teléfono, dirección, horarios, redes).
 * - Todo dato de contacto proviene de variables de entorno.
 * - Si una variable opcional no está definida, el componente que la use
 *   debe ocultarse en lugar de mostrar un valor falso.
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

/** URL base del sitio, sin barra final. */
export const siteUrl = (rawSiteUrl || "http://localhost:3000").replace(/\/+$/, "");

export const siteConfig = {
  name: "Pétalos de Mónica",
  tagline: "Flores que duran",
  description:
    "Flores y arreglos hechos a mano con limpia pipa. Descubre creaciones únicas para regalar.",
  url: siteUrl,
  locale: "es_CL",
  ogImage: "/og-image.svg",
} as const;

export const seoConfig = {
  title: "Pétalos de Mónica | Flores de Limpia Pipa",
  description:
    "Flores y arreglos hechos a mano con limpia pipa. Descubre creaciones únicas para regalar.",
} as const;

const rawWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ?? "";
const rawInstagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() ?? "";

/** Solo dígitos, como exige wa.me. */
const whatsappDigits = rawWhatsapp.replace(/\D/g, "");

export const contactConfig = {
  /** `null` cuando no está configurado → los CTA de WhatsApp se ocultan. */
  whatsappNumber: whatsappDigits.length > 0 ? whatsappDigits : null,
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE?.trim() ||
    "Hola Pétalos de Mónica, me gustaría consultar por un arreglo.",
  instagramUrl: rawInstagram.length > 0 ? rawInstagram : null,
} as const;

/** Enlace de WhatsApp listo para usar, o `null`. */
export function whatsappLink(message?: string): string | null {
  if (!contactConfig.whatsappNumber) return null;
  const text = encodeURIComponent(
    message?.trim() || contactConfig.whatsappMessage,
  );
  return `https://wa.me/${contactConfig.whatsappNumber}?text=${text}`;
}

/** Reglas de negocio reutilizables por el frontend y el backend. */
export const cartRules = {
  minQuantity: 1,
  maxQuantity: 99,
  storageKey: "pdm.cart.v1",
} as const;

/**
 * Envío.
 * No hay tarifas reales configuradas, por lo que el envío se muestra como
 * "Por calcular". Cuando exista la logística real, reemplazar `mode` por
 * "retiro" | "envio" | "gratis" y agregar el cálculo correspondiente.
 */
export const shippingConfig = {
  mode: "por-calcular" as "por-calcular" | "retiro" | "envio" | "gratis",
  label: "Envío",
  note: "Por calcular",
} as const;
