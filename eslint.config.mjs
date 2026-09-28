import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * eslint-config-next v16 ya exporta configuración en formato "flat",
 * por lo que no se necesita FlatCompat (que además choca con ESLint 9).
 */
const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypeScript,
  {
    ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"],
  },
];

export default eslintConfig;