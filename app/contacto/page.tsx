import type { Metadata } from "next";
import { contactConfig, whatsappLink } from "@/lib/config";
import { CustomOrder } from "@/components/CustomOrder";
import { InstagramIcon, WhatsAppIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta a Pétalos de Mónica para consultas, pedidos personalizados y encargos especiales.",
  alternates: { canonical: "/contacto" },
};

const MESSAGE = "Hola Pétalos de Mónica, me gustaría recibir más información.";

export default function ContactPage() {
  const whatsapp = whatsappLink(MESSAGE);
  const hasData = Boolean(whatsapp) || Boolean(contactConfig.instagramUrl);

  return (
    <>
      <div className="container-page pt-28 pb-20 md:pt-36">
        <p className="eyebrow">Contacto</p>
        <h1 className="mt-3 font-display text-[clamp(2.25rem,6vw,4rem)] leading-tight">
          Hablemos
        </h1>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-500 md:text-base">
          Consultas sobre productos, pedidos personalizados o encargos
          especiales.
        </p>

        {hasData ? (
          <ul className="mt-10 flex flex-wrap gap-3">
            {whatsapp && (
              <li>
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  Escribir por WhatsApp
                </a>
              </li>
            )}
            {contactConfig.instagramUrl && (
              <li>
                <a
                  href={contactConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                >
                  <InstagramIcon className="h-4 w-4" />
                  Ver Instagram
                </a>
              </li>
            )}
          </ul>
        ) : (
          /*
            No hay datos de contacto configurados. En lugar de inventar un
            teléfono o un correo, se explica cómo habilitarlos (sección 74).
          */
          <div className="mt-10 max-w-lg rounded-card border border-dashed border-cream-300 px-6 py-8">
            <h2 className="font-display text-xl">
              Canales de contacto próximamente disponibles
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-500">
              Los datos de contacto de Pétalos de Mónica aún no están
              configurados. Puedes revisar nuestra colección mientras tanto.
            </p>
          </div>
        )}
      </div>

      <CustomOrder />
    </>
  );
}
