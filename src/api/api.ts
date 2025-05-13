import api from '@/config/axios.config';
import { CreateAnnouncementDto, UpdateAnnouncementDto } from '@/models/announcement.model';
import { CreateAuthorDto, UpdateAuthorDto } from '@/models/author.model';
import { BookFilterDto, UpdateBookDto } from '@/models/book.model';
import { AddToCartDto, UpdateCartItemDto } from '@/models/cart.model';
import { CreateOrderDto } from '@/models/order.model';
import { CreatePublisherDto, UpdatePublisherDto } from '@/models/publisher.model';
import { CreateReviewDto, UpdateReviewDto } from '@/models/review.model';
import {
  ChangePasswordDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  SendPasswordResetCodeDto,
  UpdateUserDto,
} from '@/models/user.model';

// User/Auth API endpoints
export const userAPI = {
  // Auth
  register: (userData: RegisterDto) =>
    api.post('/api/user/register', userData),
  login: (credentials: LoginDto) =>
    api.post('/api/user/login', credentials),
  forgotPassword: (data: SendPasswordResetCodeDto) =>
    api.post('/api/user/forgot-password', data),
  resetPassword: (data: ResetPasswordDto) =>
    api.post('/api/user/reset-password', data),
  changePassword: (data: ChangePasswordDto) =>
    api.post('/api/user/change-password', data),

  // User management
  getAll: () => api.get('/api/user'),
  getMe: () => api.get('/api/user/me'),
  getById: (id: string) => api.get(`/api/user/${id}`),
  getByEmail: (email: string) => api.get(`/api/user/email/${email}`),
  update: (id: string, data: UpdateUserDto) => api.put(`/api/user/${id}`, data),
  activate: (id: string) => api.post(`/api/user/${id}/activate`),
  deactivate: (id: string) => api.post(`/api/user/${id}/deactivate`),
  delete: (id: string) => api.delete(`/api/user/${id}`),

  // Bookmarks
  toggleBookmark: (bookId: string) => api.post(`/api/user/bookmarks/${bookId}`),
  getBookmarks: () => api.get('/api/user/bookmarks'),
};

// Book API endpoints
export const bookAPI = {
  getAll: () => api.get('/api/book'),
  getById: (id: string) => api.get(`/api/book/${id}`),
  getByIsbn: (isbn: string) => api.get(`/api/book/isbn/${isbn}`),
  getBySlug: (slug: string) => api.get(`/api/book/slug/${slug}`),
  filter: (filter: BookFilterDto) => api.get('/api/book/filter', { params: filter }),
  getBestSellers: (limit: number = 10) => api.get('/api/book/best-sellers', { params: { limit } }),
  getNewReleases: () => api.get('/api/book/new-releases'),
  getNewArrivals: () => api.get('/api/book/new-arrivals'),
  getComingSoon: () => api.get('/api/book/coming-soon'),
  getDeals: () => api.get('/api/book/deals'),
  getRating: (id: string) => api.get(`/api/book/${id}/average-rating`),
  checkAvailability: (id: string) => api.get(`/api/book/${id}/availability`),
  isBookmarked: (id: string) => api.get(`/api/book/${id}/is-bookmarked`),
  create: (bookData: string, coverImage?: File) => {
    const formData = new FormData();
    formData.append('bookData', bookData);
    if (coverImage) formData.append('coverImage', coverImage);
    return api.post('/api/book', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  update: (id: string, data: UpdateBookDto) => api.put(`/api/book/${id}`, data),
  delete: (id: string) => api.delete(`/api/book/${id}`),
  updateStock: (id: string, quantity: number) => api.patch(`/api/book/${id}/stock`, quantity),
  setDiscount: (id: string, percentage: number, startDate?: Date, endDate?: Date) =>
    api.patch(`/api/book/${id}/discount`, null, { params: { percentage, startDate, endDate } }),
  removeDiscount: (id: string) => api.delete(`/api/book/${id}/discount`),
  uploadCover: (id: string, image: File) => {
    const formData = new FormData();
    formData.append('image', image);
    return api.post(`/api/book/${id}/cover-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Cart API endpoints
export const cartAPI = {
  get: () => api.get('/api/cart'),
  getSummary: () => api.get('/api/cart/summary'),
  addItem: (data: AddToCartDto) => api.post('/api/cart/items', data),
  updateItem: (itemId: string, data: UpdateCartItemDto) => api.put(`/api/cart/items/${itemId}`, data),
  removeItem: (itemId: string) => api.delete(`/api/cart/items/${itemId}`),
  clear: () => api.delete('/api/cart/items'),
};

// Order API endpoints
export const orderAPI = {
  getAll: () => api.get('/api/order'),
  getById: (id: string) => api.get(`/api/order/${id}`),
  getUserOrders: () => api.get('/api/order/user'),
  create: (data: CreateOrderDto) => api.post('/api/order', data),
  createFromCart: () => api.post('/api/order/from-cart'),
  cancel: (orderId: string) => api.post(`/api/order/${orderId}/cancel`),
  getByClaimCode: (claimCode: string) => api.get(`/api/order/claim/${claimCode}`),
  complete: (orderId: string, membershipId: string) =>
    api.post(`/api/order/${orderId}/complete`, null, { params: { membershipId } }),
  setReadyForPickup: (orderId: string) => api.post(`/api/order/${orderId}/ready-for-pickup`),
};

// Author API endpoints
export const authorAPI = {
  getAll: () => api.get('/api/author'),
  getById: (id: string) => api.get(`/api/author/${id}`),
  getBooks: (id: string) => api.get(`/api/author/${id}/books`),
  create: (data: CreateAuthorDto) => api.post('/api/author', data),
  update: (id: string, data: UpdateAuthorDto) => api.put(`/api/author/${id}`, data),
  delete: (id: string) => api.delete(`/api/author/${id}`),
};

// Publisher API endpoints
export const publisherAPI = {
  getAll: () => api.get('/api/publisher'),
  getById: (id: string) => api.get(`/api/publisher/${id}`),
  getBooks: (id: string) => api.get(`/api/publisher/${id}/books`),
  create: (data: CreatePublisherDto) => api.post('/api/publisher', data),
  update: (id: string, data: UpdatePublisherDto) => api.put(`/api/publisher/${id}`, data),
  delete: (id: string) => api.delete(`/api/publisher/${id}`),
};

// Announcement API endpoints
export const announcementAPI = {
  getAll: () => api.get('/api/announcement'),
  getActive: () => api.get('/api/announcement/active'),
  getById: (id: string) => api.get(`/api/announcement/${id}`),
  create: (data: CreateAnnouncementDto) => api.post('/api/announcement', data),
  update: (id: string, data: UpdateAnnouncementDto) => api.put(`/api/announcement/${id}`, data),
  delete: (id: string) => api.delete(`/api/announcement/${id}`),
  toggle: (id: string) => api.patch(`/api/announcement/${id}/toggle`),
};

// Review API endpoints
export const reviewAPI = {
  getAll: () => api.get('/api/review'),
  getById: (id: string) => api.get(`/api/review/${id}`),
  getBookReviews: (bookId: string) => api.get(`/api/review/book/${bookId}`),
  getUserReviews: (userId: string) => api.get(`/api/review/user/${userId}`),
  create: (data: CreateReviewDto) => api.post('/api/review', data),
  update: (id: string, data: UpdateReviewDto) => api.put(`/api/review/${id}`, data),
  delete: (id: string) => api.delete(`/api/review/${id}`),
};
