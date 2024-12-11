import { OrderItem } from './order-item.entity';

export class Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPING = 'shipping',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}
