"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { contactConfig } from "@/lib/config";
import { BagIcon, CloseIcon, InstagramIcon, MenuIcon } from "./Icons";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/coleccion", label: "Colección" },
  { href: "/ocaciones", label: "Ocasiones" },
  { href: "/promociones", label: "Promociones" },
] as const;

export function Header() {
  const { count, openCart, ready } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Transparente solo al inicio de la home (donde está el Hero).
  const overlay = !scrolled && pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Bloquear el scroll del body con el menú móvil abierto.
  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);


  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          overlay
            ? "bg-transparent text-cream-50"
            : "border-b border-cream-200/80 bg-cream-50/85 text-ink-900 backdrop-blur-md",
        ].join(" ")}
      >
        <div className="container-page flex h-16 items-center justify-between gap-4 md:h-20">
          <Link
            href="/"
            className="font-display text-base leading-tight tracking-[0.18em] uppercase transition-opacity hover:opacity-70 md:text-lg"
          >
            Pétalos
            <span className="hidden sm:inline"> de Mónica</span>
          </Link>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={[
                        "text-[0.8125rem] tracking-[0.1em] uppercase transition-opacity hover:opacity-60",
                        active ? "opacity-100" : "opacity-70",
                      ].join(" ")}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            {contactConfig.instagramUrl && (
              <a
                href={contactConfig.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Pétalos de Mónica"
                className="hidden h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream-200/60 sm:flex"
              >
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
            )}

            <button
              type="button"
              onClick={openCart}
              aria-label={`Abrir carrito, ${count} ${
                count === 1 ? "producto" : "productos"
              }`}
              className="flex h-10 items-center gap-2 rounded-full px-3 transition-colors hover:bg-cream-200/60"
            >
              <BagIcon className="h-5 w-5" />
              <span className="text-[0.8125rem] tabular-nums">
                {/* Antes de hidratar se omite el contador para no romper SSR. */}
                {ready ? `Carrito (${count})` : "Carrito"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-cream-200/60 md:hidden"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
            className="absolute inset-y-0 right-0 flex w-[85%] max-w-sm flex-col bg-cream-50 shadow-lift"
          >
            <div className="flex h-16 items-center justify-between border-b border-cream-200 px-5">
              <span className="font-display text-sm tracking-[0.18em] uppercase">
                Pétalos de Mónica
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-cream-200"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <nav
              aria-label="Menú móvil"
              className="flex-1 overflow-y-auto px-5 py-6"
            >
              <ul className="space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="block border-b border-cream-200 py-4 font-display text-2xl transition-colors hover:text-petal-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {contactConfig.instagramUrl && (
                <a
                  href={contactConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2 text-sm text-ink-500"
                >
                  <InstagramIcon className="h-4 w-4" />
                  Instagram
                </a>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

