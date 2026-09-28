/** Formateo de precios en formato chileno (CLP): $18.990 */
const clpFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

export function formatPrice(value: number): string {
  if (!Number.isFinite(value)) return "$0";
  return clpFormatter.format(Math.round(value));
}
