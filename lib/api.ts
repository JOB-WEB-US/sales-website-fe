export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  isHidden?: boolean;
  _count?: { products: number };
}

export interface ApiVariant {
  id: string;
  sku: string;
  productId: string;
  productTypeId?: string;
  colorId?: string;
  sizeId?: string;
  productType: string;
  size: string;
  color: string;
  price: number;
  originalPrice?: number | null;
  imageUrl?: string | null;
  stock: number;
  isActive: boolean;
  type?: { id: string; name: string; slug: string; baseCost: number };
  colorRel?: { id: string; name: string; hexCode: string };
  sizeRel?: { id: string; name: string; sortOrder: number };
}

export interface ApiReview {
  id: string;
  productId: string;
  userId?: string | null;
  userName: string;
  userAvatar?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
  product?: {
    id: string;
    title: string;
    slug: string;
    frontImage: string;
  };
}

export interface ApiProduct {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  basePrice: number;
  originalPrice?: number | null;
  frontImage: string;
  backImage?: string | null;
  isSale: boolean;
  discountPercent?: number;
  isFeatured: boolean;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  categoryId?: string | null;
  category?: ApiCategory | null;
  categoryLabel?: string;
  variants: ApiVariant[];
  reviews: ApiReview[];
  createdAt?: string;
  updatedAt?: string;
}


export interface ApiBlog {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  authorAvatar?: string | null;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: string[];
  tags: string[];
  createdAt?: string;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  invoiceNumber: string;
  status: 'PLACED' | 'PRINTING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  customerName: string;
  customerEmail: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  financials: {
    subtotal: number;
    discount: number;
    tax: number;
    totalPrice: number;
    paymentMethod: string;
  };
  trackingNumber?: string | null;
  carrier?: string | null;
  items: {
    id: string;
    productId: string;
    productType: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    product?: {
      id: string;
      title: string;
      slug: string;
      frontImage: string;
    } | null;
  }[];
  createdAt: string;
}

/**
 * Generic fetcher with error handling
 */
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      let errorMessage = `API Error: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.message) errorMessage = errorData.message;
      } catch (e) {}
      throw new Error(errorMessage);
    }

    return await res.json();
  } catch (error: any) {
    console.error(`Failed request to ${url}:`, error);
    throw error;
  }
}

// ---------------- API SERVICES ----------------

/**
 * 1. Products API
 */
export async function getProducts(params?: { category?: string; search?: string }): Promise<ApiProduct[]> {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'all') {
    query.set('category', params.category);
  }
  if (params?.search) {
    query.set('search', params.search);
  }

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const response = await fetchApi<{ success: boolean; count: number; data: ApiProduct[] }>(`/products${queryString}`);
  return (response.data || []).filter(
    (product) => product.isActive !== false && product.category?.isHidden !== true
  );
}

export async function getProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    const response = await fetchApi<{ success: boolean; data: ApiProduct }>(`/products/${slug}`);
    const product = response.data || null;
    if (!product || product.isActive === false || product.category?.isHidden === true) {
      return null;
    }
    return product;
  } catch (error) {
    return null;
  }
}

export async function getAllReviews(): Promise<ApiReview[]> {
  try {
    const response = await fetchApi<{ success: boolean; count: number; data: ApiReview[] }>('/products/reviews/all');
    return response.data || [];
  } catch (error) {
    return [];
  }
}

export async function createProductReview(
  productId: string,
  data: { userName: string; rating: number; comment: string; userAvatar?: string }
): Promise<ApiReview> {
  const response = await fetchApi<{ success: boolean; data: ApiReview }>(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return response.data;
}

/**
 * 2. Categories API
 */
export async function getCategories(): Promise<ApiCategory[]> {
  try {
    const response = await fetchApi<{ success: boolean; count: number; data: ApiCategory[] }>('/categories');
    return (response.data || []).filter((category) => category.isHidden !== true);
  } catch (error) {
    return [];
  }
}

/**
 * 3. Attributes API
 */
export async function getAttributes(): Promise<{
  types: any[];
  colors: any[];
  sizes: any[];
}> {
  try {
    const response = await fetchApi<{ success: boolean; data: any }>('/attributes');
    const data = response.data || { types: [], colors: [], sizes: [] };
    return {
      types: (data.types || []).filter((type: any) => type.isActive !== false),
      colors: (data.colors || []).filter((color: any) => color.isActive !== false),
      sizes: (data.sizes || []).filter((size: any) => size.isActive !== false),
    };
  } catch (error) {
    return { types: [], colors: [], sizes: [] };
  }
}

/**
 * 4. Blogs API
 */
export async function getBlogs(category?: string): Promise<ApiBlog[]> {
  const query = category && category.toLowerCase() !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
  try {
    const response = await fetchApi<{ success: boolean; count: number; data: ApiBlog[] }>(`/blogs${query}`);
    return response.data || [];
  } catch (error) {
    return [];
  }
}


export async function getBlogBySlug(slug: string): Promise<ApiBlog | null> {
  try {
    const response = await fetchApi<{ success: boolean; data: ApiBlog }>(`/blogs/${slug}`);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

/**
 * 5. Orders API
 */
export async function createOrder(orderPayload: {
  userId?: string;
  items: any[];
  shippingAddress: any;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  tax: number;
  totalPrice: number;
}): Promise<{
  orderNumber: string;
  invoiceNumber: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}> {
  const response = await fetchApi<{
    success: boolean;
    message: string;
    data: {
      orderNumber: string;
      invoiceNumber: string;
      status: string;
      totalPrice: number;
      createdAt: string;
    };
  }>('/orders', {
    method: 'POST',
    body: JSON.stringify(orderPayload),
  });
  return response.data;
}

export async function lookupOrder(orderIdentifier: string): Promise<ApiOrder | null> {
  try {
    const response = await fetchApi<{ success: boolean; data: ApiOrder }>(`/orders/lookup/${encodeURIComponent(orderIdentifier)}`);
    return response.data || null;
  } catch (error) {
    return null;
  }
}

export async function confirmOrderDelivery(orderId: string): Promise<boolean> {
  try {
    const response = await fetchApi<{ success: boolean; message: string }>(`/orders/${orderId}/confirm-delivery`, {
      method: 'PATCH',
    });
    return response.success;
  } catch (error) {
    return false;
  }
}

export async function getUserOrders(token?: string): Promise<ApiOrder[]> {
  try {
    const response = await fetchApi<{ success: boolean; count: number; data: ApiOrder[] }>('/orders', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data || [];
  } catch (error) {
    return [];
  }
}

/**
 * 6. Auth API
 */
export async function registerUser(data: { email: string; password: string; name: string }) {
  return fetchApi<{ success: boolean; message: string; user: any; token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function loginUser(data: { email: string; password: string }) {
  return fetchApi<{ success: boolean; message: string; user: any; token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProfile(token: string) {
  return fetchApi<{ success: boolean; authenticated: boolean; user: any }>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

/**
 * Helper to map backend product to UI Product model
 */
export function mapApiProductToUI(p: ApiProduct): any {
  if (!p) return null;
  const catSlug = typeof p.category === 'object' && p.category ? p.category.slug : (typeof p.category === 'string' ? p.category : (p.categoryId || 'trending'));
  const catName = typeof p.category === 'object' && p.category ? p.category.name : catSlug;
  const basePrice = Number(p.basePrice) || 19.99;
  const originalPrice = p.originalPrice ? Number(p.originalPrice) : null;
  const isSale = Boolean(p.isSale || (originalPrice && originalPrice > basePrice));
  const discountPercent = p.discountPercent || (originalPrice && originalPrice > basePrice
    ? Math.round(((originalPrice - basePrice) / originalPrice) * 100)
    : 0);

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    category: catSlug,
    categoryLabel: catName,
    basePrice,
    originalPrice,
    frontImage: p.frontImage,
    backImage: p.backImage || p.frontImage,
    isSale,
    discountPercent,
    isFeatured: Boolean(p.isFeatured),
    isActive: p.isActive !== false,
    rating: Number(p.rating) || 5.0,
    reviewCount: Number(p.reviewCount) || 0,
    variants: (p.variants || []).map((v) => {
      const vPrice = Number(v.price) || basePrice;
      const vOriginal = v.originalPrice ? Number(v.originalPrice) : originalPrice;
      const vDiscount = (vOriginal && vOriginal > vPrice)
        ? Math.round(((vOriginal - vPrice) / vOriginal) * 100)
        : 0;
      return {
        id: v.id,
        sku: v.sku,
        size: v.size || '',
        color: v.color || '',
        colorHex: v.colorRel?.hexCode || null,
        productType: v.productType || '',
        price: vPrice,
        originalPrice: vOriginal,
        discountPercent: vDiscount,
        imageUrl: v.imageUrl || p.frontImage,
        stock: Number(v.stock ?? 100),
        isActive: v.isActive !== false,
      };
    }),
    description: p.description || '',
    reviews: p.reviews || [],
  };
}
