import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes = ["", "/coleccion", "/ociones", "/promociones"].map(
    (path) => ({
      url: `${siteConfig.url}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  const productRoutes = products.map((product) => ({
    url: `${siteConfig.url}/coleccion/${product.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
