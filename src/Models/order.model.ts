import { OrderStatus } from './enums';
import { UserDto } from './user.model';
import { BookDto } from './book.model';

export interface OrderDto {
  id: string;
  claimCode: string;
  userId: string;
  user: UserDto;
  orderDate: Date;
  status: OrderStatus;
  subTotal: number;
  discountAmount: number;
  finalTotal: number;
  isCancelled: boolean;
  cancellationDate?: Date;
  orderItems: OrderItemDto[];
  createdAt: Date;
  lastUpdated?: Date;
}

export interface OrderItemDto {
  id: string;
  bookId: string;
  book: BookDto;
  quantity: number;
  priceAtTime: number;
  discountAtTime?: number;
  createdAt: Date;
  lastUpdated?: Date;
}

export interface CreateOrderDto {
  items: OrderItemCreateDto[];
}

export interface OrderItemCreateDto {
  bookId: string;
  quantity: number;
}

export interface OrderResponseDto {
  id: string;
  claimCode: string;
  subTotal: number;
  discountAmount: number;
  finalTotal: number;
  email: string;
  orderDate: Date;
  items: OrderItemDto[];
}
