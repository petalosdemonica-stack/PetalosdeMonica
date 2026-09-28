# Pétalos de Mónica

Tienda online de **flores y arreglos hechos a mano con limpia pipa**.

> **Nota sobre las imágenes:** todas las fotografías actuales provienen de
> Unsplash y son **placeholders de diseño**. No representan los productos
> reales. Para reemplazarlas basta con editar `lib/products.ts`
> (objeto `placeholderImages`) o las URLs en cada producto, sin tocar ningún
> componente de la interfaz.

## Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4**
- **Mercado Pago** (SDK v3, solo en servidor)
- **Vitest** para tests

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completa los valores
npm run dev
```

Scripts disponibles:

| Comando             | Descripción                    |
| ------------------- | ------------------------------ |
| `npm run dev`       | Servidor de desarrollo         |
| `npm run build`     | Build de producción            |
| `npm run start`     | Servidor de producción         |
| `npm run lint`      | ESLint                         |
| `npm run typecheck` | TypeScript sin emitir          |
| `npm test`          | Tests unitarios y de API       |

## Variables de entorno

| Variable                        | Obligatoria | Descripción                                  |
| ------------------------------- | ----------- | -------------------------------------------- |
| `MP_ACCESS_TOKEN`               | **Sí**      | Token de Mercado Pago. **Solo servidor.**    |
| `NEXT_PUBLIC_SITE_URL`          | **Sí**      | URL base, sin barra final.                   |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`   | No          | Solo dígitos. Si falta, el CTA se oculta.   |
| `NEXT_PUBLIC_WHATSAPP_MESSAGE`  | No          | Texto previo del mensaje de WhatsApp.        |
| `NEXT_PUBLIC_INSTAGRAM_URL`     | No          | Si falta, el enlace de Instagram se oculta.  |

> `MP_ACCESS_TOKEN` nunca se expone al navegador: se lee únicamente en
> `app/api/mercadopago/route.ts`. `.env.local` está en `.gitignore`.

## Arquitectura

```
app/
  layout.tsx                  Layout raíz: fuentes, metadata, SEO, carrito
  page.tsx                    Home: Hero → catálogo → ocasiones → promo → marca
  coleccion/page.tsx          Catálogo con filtro por categoría
  coleccion/[slug]/page.tsx   Detalle de producto (SSG)
  coleccion/[slug]/not-found.tsx
  checkout/{success,pending,failure}/page.tsx
  api/mercadopago/route.ts    Creación de preference (servidor)
  robots.ts · sitemap.ts · not-found.tsx

components/
  Header · Hero · ProductGrid · ProductCard · ProductDetail
  CategoryFilter · OccasionGrid · CartDrawer · CartItem · CheckoutButton
  CountdownTimer · PromotionSection · PromotionBanner
  Benefits · BrandStory · CustomOrder · Footer · Reveal · Icons

lib/
  products.ts      Catálogo (fuente única de verdad de productos e imágenes)
  categories.ts    Categorías (fuente única de verdad del filtro)
  promotions.ts    Promociones y sus estados
  cart.ts          Operaciones puras del carrito
  cart-store.ts    Store externo (localStorage, sincronizado entre pestañas)
  cart-context.tsx Provider + hook useCart
  config.ts        Configuración del sitio y contacto
  format.ts        Formato de precios CLP
```

## Seguridad de precios

El cliente **nunca** envía precios. Solo `productId` y `quantity`:

```json
{ "items": [{ "productId": "1", "quantity": 2 }] }
```

El servidor busca el producto, verifica disponibilidad, toma el precio real
del catálogo y calcula el total. Rechaza: carrito vacío, `quantity` no entera
o fuera de 1–99, `productId` inexistente (404), producto agotado (409) y
cualquier precio inyectado por el cliente (se ignora).

## Contenido editable

| Qué                       | Dónde                             |
| ------------------------- | --------------------------------- |
| Productos, precios, fotos | `lib/products.ts`                 |
| Categorías                | `lib/categories.ts`               |
| Promociones               | `lib/promotions.ts`               |
| Textos del Hero           | `heroContent` en `components/Hero.tsx` |
| Colores y tipografías     | bloque `@theme` en `app/globals.css`   |
| Contacto y reglas         | `lib/config.ts`                   |

## Envío

No hay tarifas configuradas: el carrito muestra **"Envío: Por calcular"**.
Para agregar retiro, envío por comuna o envío gratis, modificar
`shippingConfig` en `lib/config.ts`.
