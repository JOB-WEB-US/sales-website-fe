export type ProductType = 'T-Shirt' | 'Hoodie' | 'Sweatshirt' | 'Wall Calendar';

export interface ProductVariant {
  id: string;
  sku: string;
  size: string; // S, M, L, XL, 2XL, 3XL
  color: string; // Black, Navy, White, Dark Heather
  productType: ProductType;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: 'halloween' | 'horror' | 'vintage' | 'trending' | 'ella-langley' | 'car-truck' | 'tombstone' | 'ozzy' | 'bts' | 'morgan-wallen' | 'keith-whitley';
  categoryLabel: string;
  basePrice: number;
  originalPrice?: number;
  frontImage: string;
  backImage: string;
  isSale: boolean;
  isFeatured?: boolean;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  description?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}
