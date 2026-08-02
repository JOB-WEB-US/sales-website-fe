import { ProductType } from './product';

export interface CartItem {
  id: string; // unique cart item id (variantId or generated)
  productId: string;
  variantId: string;
  title: string;
  size: string;
  color: string;
  productType: ProductType;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
}
