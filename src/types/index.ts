// Domain types for the affiliate decor platform.
// These mirror the Google Sheets tabs (read by column name) and the
// in-memory shape the UI consumes.

export type ProductStatus = "published" | "draft" | "archived";
export type Retailer = "Shopee" | "Lazada" | "TikTok Shop" | string;

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string; // Category.id
  style: string;
  price: number; // VND, plain integer (0 if unknown)
  priceDisplay?: string;
  retailer: Retailer;
  affiliateUrl: string;
  imageIds: string[]; // Google Drive file IDs, first = cover
  shortDesc: string;
  description: string; // Markdown
  collections: string[]; // Collection.id[]
  tags: string[];
  featured: boolean;
  order: number;
  status: ProductStatus;
  updatedAt?: string;
}

export interface Collection {
  id: string;
  title: string;
  subtitle: string;
  heroImageId: string;
  editorialBody: string; // Markdown
  productIds: string[]; // explicit ordering (optional)
  featured: boolean;
  order: number;
  status: ProductStatus;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  heroImageId: string;
  order: number;
  status: ProductStatus;
}

export interface Style {
  id: string;
  name: string;
  order: number;
}

export interface SiteSettings {
  [key: string]: string;
}

export interface ClickEvent {
  timestamp: string;
  productId: string;
  productName: string;
  retailer: string;
  affiliateUrl: string;
  referrer: string;
  country: string;
  device: string;
  userAgent: string;
}

export interface ProductFilters {
  q?: string;
  category?: string;
  style?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "moi-nhat" | "gia-tang" | "gia-giam" | "noi-bat";
}
