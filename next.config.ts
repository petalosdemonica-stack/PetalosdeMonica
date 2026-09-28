import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Las imágenes de producto son placeholders de Unsplash.
    // Al reemplazarlas por fotos propias, agregar aquí el dominio nuevo.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;