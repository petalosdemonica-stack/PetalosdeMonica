import Link from "next/link";
import { CheckIcon, CloseIcon, FlowerIcon } from "./Icons";

export type PaymentStatus = "success" | "pending" | "failure";

const config: Record<
  PaymentStatus,
  { title: string; description: string; cta: string; ctaHref: string }
> = {
  success: {
    title: "¡Gracias por tu compra!",
    description: "Tu pedido fue recibido correctamente.",
    cta: "Volver a la tienda",
    ctaHref: "/coleccion",
  },
  pending: {
    title: "Tu pago está pendiente",
    description:
      "Te mostraremos el resultado cuando sea confirmado.",
    cta: "Volver a la tienda",
    ctaHref: "/coleccion",
  },
  failure: {
    title: "No pudimos completar el pago",
    description: "Puedes intentarlo nuevamente.",
    cta: "Reintentar",
    ctaHref: "/coleccion",
  },
};

/**
 * Pantallas de retorno desde Mercado Pago.
 * NUNCA se muestran errores técnicos al usuario (sección 61).
 */
export function PaymentResult({
  status,
  children,
}: {
  status: PaymentStatus;
  children?: React.ReactNode;
}) {
  const { title, description, cta, ctaHref } = config[status];

  return (
    <div className="container-page flex min-h-[80svh] items-center justify-center py-28 md:py-36">
      <div className="w-full max-w-lg text-center">
        <span
          className={[
            "mx-auto flex h-20 w-20 items-center justify-center rounded-full",
            status === "success"
              ? "bg-sage-100 text-sage-600"
              : status === "pending"
                ? "bg-petal-50 text-petal-500"
                : "bg-cream-200 text-ink-500",
          ].join(" ")}
        >
          {status === "success" ? (
            <CheckIcon className="h-9 w-9" />
          ) : status === "failure" ? (
            <CloseIcon className="h-8 w-8" />
          ) : (
            <FlowerIcon className="h-8 w-8" />
          )}
        </span>

        <h1 className="mt-8 font-display text-[clamp(2rem,5vw,3rem)] leading-tight text-balance">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink-500 md:text-base">
          {description}
        </p>

        {children}

        <Link href={ctaHref} className="btn btn-primary mt-9">
          {cta}
        </Link>
      </div>
    </div>
  );
}
