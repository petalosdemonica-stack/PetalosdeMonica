import type { Metadata } from "next";
import { PaymentResult } from "@/components/PaymentResult";

export const metadata: Metadata = {
  title: "Pago pendiente",
  description: "Tu pago está pendiente de confirmación.",
  robots: { index: false, follow: false },
};

export default function CheckoutPendingPage() {
  // El carrito NO se vacía: el usuario conserva sus productos.
  return <PaymentResult status="pending" />;
}
