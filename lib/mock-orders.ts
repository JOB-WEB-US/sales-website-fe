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

/**
 * Computes display status of order fulfillment based on elapsed time since creation
 */
export function getOrderTrackingStatus(order: Order): OrderStatus {
  if (order.status === 'delivered') return 'delivered';
  const elapsedMs = Date.now() - new Date(order.createdAt).getTime();
  if (elapsedMs < 15 * 1000) return 'placed';
  if (elapsedMs < 45 * 1000) return 'printing';
  if (elapsedMs < 90 * 1000) return 'shipped';
  return 'delivered';
}
