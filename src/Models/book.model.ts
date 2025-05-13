import { AuthorDto } from './author.model';
import { PublisherDto } from './publisher.model';
import { Language, BookFormat, Genre } from './enums';

export interface BookDto {
  id: string;
  title: string;
  isbn: string;
  description: string;
  imageUrl?: string;
  authors: AuthorDto[];
  publishers: PublisherDto[];
  publicationDate: Date;
  price: number;
  stockQuantity: number;
  language: Language;
  format: BookFormat;
  genre: Genre;
  isAvailableInLibrary: boolean;
  soldCount: number;
  discountPercentage?: number;
  discountStartDate?: Date;
  discountEndDate?: Date;
  isOnSale: boolean;
  slug: string;
  averageRating: number;
  reviewCount: number;
  createdAt: Date;
  lastUpdated?: Date;
}

export interface CreateBookDto {
  title: string;
  isbn: string;
  description: string;
  authorIds: string[];
  publisherIds: string[];
  publicationDate: Date;
  price: number;
  stockQuantity: number;
  language: Language;
  format: BookFormat;
  genre: Genre;
  isAvailableInLibrary: boolean;
  coverImage?: File;
}

export interface UpdateBookDto {
  title?: string;
  description?: string;
  authorIds?: string[];
  publisherIds?: string[];
  price?: number;
  language?: Language;
  format?: BookFormat;
  genre?: Genre;
  isAvailableInLibrary?: boolean;
}

export interface BookFilterDto {
  searchTerm?: string;
  authorIds?: string[];
  publisherIds?: string[];
  minPrice?: number;
  maxPrice?: number;
  genres?: Genre[];
  languages?: Language[];
  formats?: BookFormat[];
  isAvailableInLibrary?: boolean;
  hasDiscount?: boolean;
  minRating?: number;
  sortBy?: string;
  sortDescending?: boolean;
  pageNumber: number;
  pageSize: number;
}
