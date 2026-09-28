import type { RealCategory } from "./categories";

export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Precio en CLP. Fuente de verdad: SOLO el servidor. */
  price: number;
  description: string;
  /** Descripción corta para la tarjeta del catálogo. */
  shortDescription: string;
  category: RealCategory;
  image: string;
  images?: string[];
  available: boolean;
  featured?: boolean;
};

/**
 * Imágenes placeholder.
 *
 * Las fotos actuales provienen de Unsplash y son SOLO placeholders de diseño:
 * no representan los productos reales. Para reemplazarlas basta con cambiar
 * la URL dentro de este objeto, sin tocar ningún componente.
 */
function unsplash(id: string, width = 1200): string {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
}

/** IDs verificados de imágenes placeholder. */
export const placeholderImages = {
  rosas: unsplash("photo-1490750967868-88aa4486c946"),
  girasoles: unsplash("photo-1518709268805-4e9042af9f23"),
  corazon: unsplash("photo-1526047932273-341f2a7631f9"),
  pastel: unsplash("photo-1469259943454-aa100abba749"),
  halloween: unsplash("photo-1519681393784-d120267933ba"),
  arcoiris: unsplash("photo-1518709594023-6eab9bab7b23"),
  personalizado: unsplash("photo-1508610048659-a06b669e3321"),
  artesania: unsplash("photo-1512428559087-560fa5ceab42"),
  oscuro: unsplash("photo-1509223197845-458d87318791"),
  detalle: unsplash("photo-1518895949257-7621c3c786d7", 1600),
  textura: unsplash("photo-1471879832106-c7ab9e0cee23", 1600),
  hero: unsplash("photo-1583939003579-730e3918a45a", 2000),
  marca: unsplash("photo-1519225421980-715cb0215aed", 1600),
  promo: unsplash("photo-1460978812857-470ed1c77af0"),
} as const;

/** Alias corto para readability en la definición de productos. */
const img = placeholderImages;

export const products: Product[] = [
  {
    id: "1",
    slug: "ramo-eterno-12-rosas",
    name: "Ramo Eterno 12 Rosas",
    price: 18990,
    category: "Aniversario",
    description:
      "Doce rosas de limpia pipa modeladas una a una y montadas sobre una base estable. Cada pétalo está trabajado a mano para que el ramo conserve su forma mucho después de ser entregado.",
    shortDescription: "Una creación artesanal para un momento especial.",
    image: img.rosas,
    images: [img.rosas, img.detalle, img.textura],
    available: true,
    featured: true,
  },
  {
    id: "2",
    slug: "girasoles-felices",
    name: "Girasoles Felices",
    price: 15990,
    category: "Cumpleaños",
    description:
      "Girasoles de limpia pipa en tonos amarillo y crema, con un centro intenso. Un ramo alegre y resistente, hecho para acompañar un cumpleaños.",
    shortDescription: "Colores cálidos para celebrar a alguien.",
    image: img.girasoles,
    images: [img.girasoles, img.detalle],
    available: true,
    featured: true,
  },
  {
    id: "3",
    slug: "corazon-san-valentin",
    name: "Corazón San Valentín",
    price: 24990,
    category: "San Valentín",
    description:
      "Corazón de limpia pipa con pétalos rojos y contorno en tonos más oscuros. Un regalo con mensaje claro, sin necesidad de tarjetas.",
    shortDescription: "El regalo que dice exactamente lo que sientes.",
    image: img.corazon,
    images: [img.corazon, img.detalle, img.textura],
    available: true,
    featured: true,
  },
  {
    id: "4",
    slug: "ramo-pastel-dia-madre",
    name: "Ramo Pastel Día Madre",
    price: 22990,
    category: "Día de la Madre",
    description:
      "Paleta suave de rosa, lila y crema con un moño artesanal. Un ramo delicado, pensado para acompañar el detalle del día.",
    shortDescription: "Tonos suaves para un regalo lleno de cariño.",
    image: img.pastel,
    images: [img.pastel, img.detalle],
    available: true,
    featured: true,
  },
  {
    id: "5",
    slug: "bouquet-halloween",
    name: "Bouquet Halloween",
    price: 19990,
    category: "Halloween",
    description:
      "Naranja, negro y morado en un arreglo de líneas marcadas. Contraste fuerte y presencia clara, decorado a mano pieza por pieza.",
    shortDescription: "Naranja y negro con mucha personalidad.",
    image: img.halloween,
    images: [img.halloween, img.detalle],
    available: true,
    featured: true,
  },
  {
    id: "6",
    slug: "bouquet-arcoiris",
    name: "Bouquet Arcoíris",
    price: 17990,
    category: "Regalos",
    description:
      "Una gama de colores en un ramo compacto y alegre. Funciona como regalo espontáneo para cualquier fecha y cualquier persona.",
    shortDescription: "Color para regalar sin fecha especial.",
    image: img.arcoiris,
    images: [img.arcoiris, img.detalle],
    available: true,
    featured: true,
  },
  {
    id: "7",
    slug: "ramo-con-nombre-personalizado",
    name: "Ramo con Nombre Personalizado",
    price: 24990,
    category: "Personalizados",
    description:
      "Ramo con el nombre que tú quieras, trabajado a mano. Cuéntanos el nombre y la paleta antes de confirmar; lo preparamos especialmente para ti.",
    shortDescription: "Con el nombre de la persona que importa.",
    image: img.personalizado,
    images: [img.personalizado, img.detalle, img.textura],
    available: true,
    featured: false,
  },
  {
    id: "8",
    slug: "letra-amor-limpia-pipa",
    name: "Letra «Amor» en Limpia Pipa",
    price: 12990,
    category: "Personalizados",
    description:
      "Letra decorativa modelada a mano, ideal para acompañar un ramo. Cada unidad tiene variaciones propias del trabajo artesanal.",
    shortDescription: "Decoración artesanal para acompañar tu ramo.",
    image: img.artesania,
    images: [img.artesania, img.textura],
    // Agotado: sirve para comprobar el estado "no disponible".
    available: false,
    featured: false,
  },
  {
    id: "9",
    slug: "ramo-nocturno",
    name: "Ramo Nocturno",
    price: 20990,
    category: "Aniversario",
    description:
      "Tonos profundos con contrapuntos claros en un arreglo de líneas limpias. Una pieza sobria para ocasiones que piden elegancia.",
    shortDescription: "Tonos profundos y un diseño sobrio.",
    image: img.oscuro,
    images: [img.oscuro, img.textura],
    available: true,
    featured: false,
  },
];

/** Índice por id — el backend lo usa para resolver los precios reales. */
const productsById = new Map(products.map((p) => [p.id, p]));
const productsBySlug = new Map(products.map((p) => [p.slug, p]));

export function getProductById(id: string): Product | undefined {
  return productsById.get(id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return productsBySlug.get(slug);
}

export function getAvailableProducts(): Product[] {
  return products.filter((p) => p.available);
}

/** Normaliza un slug: minúsculas, sin tildes, separado por guiones. */
export function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

