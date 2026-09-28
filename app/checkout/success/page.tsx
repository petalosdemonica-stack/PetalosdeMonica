import type { Metadata } from "next";
import { PaymentResult } from "@/components/PaymentResult";
import { ClearCartOnSuccess } from "@/components/ClearCartOnSuccess";

export const metadata: Metadata = {
  title: "Pago confirmado",
  description: "Tu pedido fue recibido correctamente.",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <>
      <ClearCartOnSuccess />
      <PaymentResult status="success" />
    </>
  );
}
