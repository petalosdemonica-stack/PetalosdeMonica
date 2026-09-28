"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Permite aplicar estilos distintos a la etiqueta envoltora. */
  as?: ElementType;
};

/**
 * Aparición suave al entrar en el viewport.
 *
 * Se implementa como componente cliente (y no como hook) para poder usarse
 * también desde Server Components: el hook se ejecutaría en el servidor y
 * no es posible allí.
 *
 * Respeta `prefers-reduced-motion` (verificado en `app/globals.css`).
 * Sin IntersectionObserver el contenido se muestra de inmediato.
 */
export function Reveal({ children, className = "", as: Tag = "div" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      node.classList.add("is-visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </Tag>
  );
}
