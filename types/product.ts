export type ProductType = 'T-Shirt' | 'Hoodie' | 'Sweatshirt' | 'Wall Calendar' | 'Phonecase' | string;

export interface ProductVariant {
  id: string;
  sku: string;
  size: string; // S, M, L, XL, 2XL, 3XL
  color: string; // Black, Navy, White, Dark Heather
  colorHex?: string | null;
  productType: ProductType;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string | null;
  stock: number;
  isActive?: boolean;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  categoryLabel?: string;
  basePrice: number;
  originalPrice?: number | null;
  frontImage: string;
  backImage?: string | null;
  isSale: boolean;
  discountPercent?: number;
  isFeatured?: boolean;
  isActive?: boolean;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  description?: string | null;
  reviews?: any[];
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}
