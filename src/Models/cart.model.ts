import { BookDto } from './book.model';
import { UserDto } from './user.model';

export interface CartDto {
  id: string;
  userId: string;
  user: UserDto;
  totalAmount: number;
  items: CartItemDto[];
  createdAt: Date;
  lastUpdated?: Date;
}

export interface CartItemDto {
  id: string;
  bookId: string;
  book: BookDto;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  createdAt: Date;
  lastUpdated?: Date;
}

export interface AddToCartDto {
  bookId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}

export interface CartSummaryDto {
  itemCount: number;
  totalAmount: number;
  discountAmount?: number;
  finalAmount?: number;
}