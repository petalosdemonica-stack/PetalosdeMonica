import { Reveal } from "./Reveal";
import { FlowerIcon } from "./Icons";

const benefits = [
  {
    title: "Hechas a mano",
    description:
      "Cada creación es elaborada cuidadosamente, pieza por pieza.",
  },
  {
    title: "Duran mucho más",
    description:
      "Una alternativa decorativa para conservar y volver a mostrar.",
  },
  {
    title: "Un regalo diferente",
    description: "Diseños pensados para sorprender y durar en el tiempo.",
  },
] as const;

export function Benefits() {
  return (
    <section className="border-t border-cream-200 bg-cream-100 py-16 md:py-24">
      <div className="container-page">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Nuestra diferencia</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,5vw,3.25rem)] leading-tight">
            ¿Por qué Pétalos de Mónica?
          </h2>
        </Reveal>

        <ul className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-6 md:gap-10">
          {benefits.map((benefit) => (
            <li key={benefit.title} className="text-center sm:text-left">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-petal-50 sm:mx-0">
                <FlowerIcon className="h-5 w-5 text-petal-500" />
              </span>
              <h3 className="mt-5 font-display text-xl">{benefit.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-ink-500">
                {benefit.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
