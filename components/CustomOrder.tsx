import Image from "next/image";
import { placeholderImages } from "@/lib/products";
import { whatsappLink } from "@/lib/config";
import { Reveal } from "./Reveal";
import { ArrowRightIcon, WhatsAppIcon } from "./Icons";

const CUSTOM_MESSAGE =
  "Hola Pétalos de Mónica, quiero crear una composición personalizada.";

/**
 * Llamado a la personalización.
 *
 * El CTA usa WhatsApp si `NEXT_PUBLIC_WHATSAPP_NUMBER` está configurado.
 * Si no lo está, se muestra un enlace a la página de contacto en vez de
 * inventar un número (secciones 48 y 49).
 */
export function CustomOrder() {
  const href = whatsappLink(CUSTOM_MESSAGE);

  return (
    <section className="container-page py-16 md:py-24">
      <Reveal className="grid items-center gap-10 overflow-hidden rounded-[1.75rem] border border-cream-200 bg-cream-50 md:grid-cols-2 md:gap-14">
        <div className="p-8 md:p-12">
          <p className="eyebrow">A medida</p>
          <h2 className="mt-3 font-display text-[clamp(1.875rem,4vw,2.75rem)] leading-tight">
            ¿Quieres algo especial?
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500 md:text-base">
            Podemos crear una composición personalizada para esa persona y esa
            ocasión especial.
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500 md:text-base">
            ¿Tienes una idea? Cuéntanos qué tienes en mente.
          </p>

          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary mt-8"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Hablar con nosotros
            </a>
          ) : (
            <a href="/contacto" className="btn btn-primary mt-8">
              Consultar
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[24rem]">
          <Image
            src={placeholderImages.marca}
            alt="Detalle del trabajo artesanal con limpia pipa — imagen referencial"
            fill
            loading="lazy"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </Reveal>
    </section>
  );
}
