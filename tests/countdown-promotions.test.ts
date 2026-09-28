import { describe, expect, it } from "vitest";
import { getTimeLeft } from "@/components/CountdownTimer";
import {
  getPromotionState,
  shouldShowCountdown,
  type Promotion,
} from "@/lib/promotions";

const base: Promotion = {
  id: "test",
  title: "Promo",
  description: "Descripción",
  active: true,
  showCountdown: true,
  href: "/coleccion",
  ctaLabel: "VER",
};

const NOW = new Date("2026-06-15T12:00:00.000Z").getTime();

describe("countdown: cálculo (sección 94)", () => {
  it("descompone correctamente el tiempo restante", () => {
    const end = "2026-06-17T20:34:17.000Z";
    const result = getTimeLeft(end, NOW);
    expect(result.finished).toBe(false);
    expect(result.valid).toBe(true);
    expect(result.days).toBe(2);
    expect(result.hours).toBe(8);
    expect(result.minutes).toBe(34);
    expect(result.seconds).toBe(17);
  });

  it("se detiene en cero con una fecha pasada", () => {
    const result = getTimeLeft("2020-01-01T00:00:00.000Z", NOW);
    expect(result.finished).toBe(true);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
  });

  it("termina exactamente en la fecha límite", () => {
    const result = getTimeLeft("2026-06-15T12:00:00.000Z", NOW);
    expect(result.finished).toBe(true);
  });

  it("una fecha inválida no produce NaN ni Infinity (sección 94)", () => {
    const result = getTimeLeft("no-es-una-fecha", NOW);
    expect(result.valid).toBe(false);
    expect(result.finished).toBe(true);
    for (const value of [
      result.days,
      result.hours,
      result.minutes,
      result.seconds,
    ]) {
      expect(Number.isFinite(value)).toBe(true);
      expect(value).toBe(0);
    }
  });
});

describe("promociones: estados (sección 81)", () => {
  it("una promoción inactiva nunca está activa", () => {
    expect(getPromotionState({ ...base, active: false }, NOW)).toBe("inactive");
  });

  it("una promoción sin fechas está activa", () => {
    expect(getPromotionState(base, NOW)).toBe("active");
  });

  it("una promoción futura queda programada", () => {
    const promo = {
      ...base,
      startDate: "2026-07-01T00:00:00.000Z",
      endDate: "2026-07-05T00:00:00.000Z",
    };
    expect(getPromotionState(promo, NOW)).toBe("scheduled");
  });

  it("una promoción vencida expira", () => {
    const promo = {
      ...base,
      endDate: "2026-01-01T00:00:00.000Z",
    };
    expect(getPromotionState(promo, NOW)).toBe("expired");
  });
});

describe("promociones: countdown opcional (sección 44)", () => {
  it("no muestra reloj si showCountdown es false", () => {
    const promo = {
      ...base,
      showCountdown: false,
      endDate: "2026-12-31T00:00:00.000Z",
    };
    expect(shouldShowCountdown(promo, NOW)).toBe(false);
  });

  it("no muestra reloj si no hay endDate, aunque showCountdown sea true", () => {
    expect(shouldShowCountdown(base, NOW)).toBe(false);
  });

  it("muestra reloj con showCountdown true y endDate futura", () => {
    const promo = { ...base, endDate: "2026-12-31T00:00:00.000Z" };
    expect(shouldShowCountdown(promo, NOW)).toBe(true);
  });

  it("deja de mostrar el reloj cuando la promoción expira", () => {
    const promo = { ...base, endDate: "2026-01-01T00:00:00.000Z" };
    expect(shouldShowCountdown(promo, NOW)).toBe(false);
  });
});
