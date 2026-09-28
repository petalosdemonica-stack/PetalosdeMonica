"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
  valid: boolean;
};

/**
 * Calcula el tiempo restante de forma pura y defensiva.
 * Ante una fecha inválida devuelve `valid: false` en vez de NaN/Infinity.
 */
export function getTimeLeft(endDate: string, now: number): TimeLeft {
  const end = new Date(endDate).getTime();

  if (!Number.isFinite(end)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true, valid: false };
  }

  const diff = end - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true, valid: true };
  }

  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    finished: false,
    valid: true,
  };
}

// Suscripción vacía: solo sirve para distinguir servidor de cliente.
const emptySubscribe = () => () => {};

/**
 * Cuenta regresiva.
 *
 * - El servidor no conoce la hora actual, así que el primer render produce
 *   siempre el mismo placeholder. Esto evita hydration mismatch.
 * - Se detiene en cero y muestra "PROMOCIÓN FINALIZADA" (sección 81).
 */
export function CountdownTimer({
  endDate,
  onFinished,
}: {
  endDate: string;
  onFinished?: () => void;
}) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(endDate, Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [endDate]);

  useEffect(() => {
    if (timeLeft?.finished) onFinished?.();
  }, [timeLeft?.finished, onFinished]);

  // Placeholder estable para el primer render (servidor y cliente coinciden).
  if (!mounted || !timeLeft) {
    return (
      <div className="flex gap-2 sm:gap-3" aria-hidden="true">
        {["Días", "Horas", "Min", "Seg"].map((label) => (
          <div
            key={label}
            className="min-w-[4.25rem] rounded-2xl bg-white/10 px-3 py-3 text-center sm:min-w-[5.5rem] sm:px-4 sm:py-4"
          >
            <div className="font-display text-2xl leading-none tabular-nums sm:text-3xl">
              --
            </div>
            <div className="mt-1.5 text-[0.5625rem] tracking-[0.18em] text-cream-50/60 uppercase">
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Fecha inválida configurada: no inventar valores.
  if (!timeLeft.valid) return null;

  if (timeLeft.finished) {
    return (
      <p className="text-sm tracking-[0.18em] text-cream-50/80 uppercase">
        Promoción finalizada
      </p>
    );
  }

  const units = [
    { value: timeLeft.days, label: "Días" },
    { value: timeLeft.hours, label: "Horas" },
    { value: timeLeft.minutes, label: "Min" },
    { value: timeLeft.seconds, label: "Seg" },
  ];

  return (
    <div
      role="timer"
      aria-live="off"
      aria-label="Tiempo restante de la promoción"
    >
      {/* Lectura accesible: no se anuncia cada segundo. */}
      <span className="sr-only" aria-live="polite">
        Quedan {timeLeft.days} días, {timeLeft.hours} horas,{" "}
        {timeLeft.minutes} minutos.
      </span>

      <div className="flex gap-2 sm:gap-3">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="min-w-[4.25rem] rounded-2xl bg-white/10 px-3 py-3 text-center backdrop-blur-sm sm:min-w-[5.5rem] sm:px-4 sm:py-4"
          >
            <div className="font-display text-2xl leading-none tabular-nums sm:text-3xl">
              {String(unit.value).padStart(2, "0")}
            </div>
            <div className="mt-1.5 text-[0.5625rem] tracking-[0.18em] text-cream-50/60 uppercase">
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
