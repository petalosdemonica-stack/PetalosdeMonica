import type { Metadata } from "next";
import { PaymentResult } from "@/components/PaymentResult";

export const metadata: Metadata = {
  title: "Pago no completado",
  description: "No pudimos completar el pago. Puedes intentarlo nuevamente.",
  robots: { index: false, follow: false },
};

export default function CheckoutFailurePage() {
  // El carrito NO se vacía: el usuario puede reintentar.
  return <PaymentResult status="failure" />;
}
