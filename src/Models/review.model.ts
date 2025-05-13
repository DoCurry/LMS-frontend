import { BookDto } from './book.model';
import { UserDto } from './user.model';

export interface ReviewDto {
  id: string;
  bookId: string;
  book: BookDto;
  userId: string;
  user: UserDto;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export interface CreateReviewDto {
  bookId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}
