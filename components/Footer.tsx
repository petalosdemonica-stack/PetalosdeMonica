import Link from "next/link";
import { contactConfig } from "@/lib/config";
import { InstagramIcon, WhatsAppIcon } from "./Icons";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/coleccion", label: "Colección" },
  { href: "/ocaciones", label: "Ocasiones" },
  { href: "/promociones", label: "Promociones" },
  { href: "/contacto", label: "Contacto" },
] as const;

export function Footer() {
  const whatsapp = contactConfig.whatsappNumber
    ? `https://wa.me/${contactConfig.whatsappNumber}`
    : null;

  return (
    <footer className="border-t border-cream-200 bg-cream-100">
      <div className="container-page py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16">
          {/* Marca */}
          <div className="max-w-sm">
            <p className="font-display text-lg tracking-[0.18em] uppercase">
              Pétalos de Mónica
            </p>
            <p className="mt-4 text-sm leading-relaxed text-ink-500">
              Flores hechas con limpia pipa, creadas para regalar y conservar.
            </p>

            {(whatsapp || contactConfig.instagramUrl) && (
              <div className="mt-6 flex items-center gap-3">
                {contactConfig.instagramUrl && (
                  <a
                    href={contactConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram de Pétalos de Mónica"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 text-ink-700 transition-colors hover:border-ink-900"
                  >
                    <InstagramIcon className="h-[18px] w-[18px]" />
                  </a>
                )}
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp de Pétalos de Mónica"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-cream-300 text-ink-700 transition-colors hover:border-ink-900"
                  >
                    <WhatsAppIcon className="h-[18px] w-[18px]" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Navegación */}
          <nav aria-label="Pie de página">
            <h2 className="eyebrow">Navegación</h2>
            <ul className="mt-4 space-y-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-700 transition-colors hover:text-petal-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto: solo si hay datos reales configurados */}
          {(whatsapp || contactConfig.instagramUrl) && (
            <div>
              <h2 className="eyebrow">Contacto</h2>
              <ul className="mt-4 space-y-3 text-sm text-ink-700">
                {whatsapp && (
                  <li>
                    <a
                      href={whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-petal-700"
                    >
                      <WhatsAppIcon className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </li>
                )}
                {contactConfig.instagramUrl && (
                  <li>
                    <a
                      href={contactConfig.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 transition-colors hover:text-petal-700"
                    >
                      <InstagramIcon className="h-4 w-4" />
                      Instagram
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream-200 pt-6 text-xs text-ink-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Pétalos de Mónica.</p>
          {/*
            Espacio reservado para Términos, Privacidad y Política de cambios.
            No se inventan enlaces: se habilitan cuando exista el contenido real.
          */}
        </div>
      </div>
    </footer>
  );
}
