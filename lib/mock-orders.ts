import { Order, OrderStatus } from '@/types/orders';

export const SHIPPING_METHODS = [
  {
    id: 'standard',
    name: 'Standard Ground Shipping',
    description: '3 - 5 Business Days (POD Printing + Carrier)',
    price: 4.99,
    estimatedDays: '3-5 days',
  },
  {
    id: 'express',
    name: 'Express Expedited Shipping',
    description: '1 - 2 Business Days Priority Production',
    price: 12.99,
    estimatedDays: '1-2 days',
  },
];

export const MOCK_ORDERS: Record<string, Order> = {
  'VELORA-84920': {
    id: 'VELORA-84920',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    status: 'printing',
    items: [
      {
        id: 'prod-1-v1-1',
        productId: 'prod-1',
        variantId: 'v1-1',
        title: 'Precious Dog Horror Movie, Silence Lambs, Halloween T-Shirt',
        size: 'M',
        color: 'Black',
        productType: 'T-Shirt',
        price: 19.99,
        originalPrice: 29.99,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
        quantity: 2,
      },
      {
        id: 'prod-3-v3-1',
        productId: 'prod-3',
        variantId: 'v3-1',
        title: 'Ella Langley Country Music Retro Graphic Tee',
        size: 'L',
        color: 'White',
        productType: 'T-Shirt',
        price: 22.99,
        originalPrice: 34.99,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&q=80',
        quantity: 1,
      },
    ],
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 234-5678',
      address: '742 Evergreen Terrace',
      apartment: 'Apt 4B',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'United States',
    },
    shippingMethod: SHIPPING_METHODS[0],
    paymentMethod: 'Credit Card (ending in 4242)',
    subtotal: 62.97,
    discount: 5.0,
    shippingFee: 4.99,
    tax: 4.65,
    totalPrice: 67.61,
    estimatedDeliveryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }),
    trackingNumber: 'US98234109238',
    carrier: 'USPS Priority Mail',
  },
};

export function saveOrderToStorage(order: Order): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getOrdersFromStorage();
    existing[order.id] = order;
    localStorage.setItem('velora_orders', JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save order to localStorage', e);
  }
}

export function getOrderTrackingStatus(order: Order): OrderStatus {
  if (order.status === 'delivered') return 'delivered';
  const elapsedMs = Date.now() - new Date(order.createdAt).getTime();
  if (elapsedMs < 15 * 1000) return 'placed';
  if (elapsedMs < 45 * 1000) return 'printing';
  if (elapsedMs < 90 * 1000) return 'shipped';
  return 'delivered';
}

export function getOrdersFromStorage(): Record<string, Order> {
  if (typeof window === 'undefined') return {};
  try {
    const data = localStorage.getItem('velora_orders');
    if (!data) return {};
    const orders = JSON.parse(data);
    
    let updated = false;
    Object.keys(orders).forEach((id) => {
      const order = orders[id];
      if (order.status !== 'delivered') {
        const elapsedMs = Date.now() - new Date(order.createdAt).getTime();
        let targetStatus = order.status;
        
        if (elapsedMs < 15 * 1000) {
          targetStatus = 'placed';
        } else if (elapsedMs < 45 * 1000) {
          targetStatus = 'printing';
        } else if (elapsedMs < 90 * 1000) {
          targetStatus = 'shipped';
        }
        
        if (order.status !== targetStatus) {
          order.status = targetStatus;
          updated = true;
        }
      }
    });
    
    if (updated) {
      localStorage.setItem('velora_orders', JSON.stringify(orders));
    }
    return orders;
  } catch (e) {
    return {};
  }
}

export function getOrderById(orderId: string): Order | null {
  const orders = getOrdersFromStorage();
  return orders[orderId?.toUpperCase()] || null;
}
