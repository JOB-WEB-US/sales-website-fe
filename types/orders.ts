import { CartItem } from './cart';

export type OrderStatus = 'placed' | 'printing' | 'shipped' | 'delivered';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  paymentMethod: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  totalPrice: number;
  estimatedDeliveryDate: string;
  trackingNumber?: string;
  carrier?: string;
}
