export interface ReviewDto {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    username: string;
  };
  book: {
    id: string;
    title: string;
    slug: string;
  };
}

export interface CreateReviewDto {
  bookId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}
