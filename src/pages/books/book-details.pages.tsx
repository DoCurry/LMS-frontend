"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { bookAPI, reviewAPI, userAPI } from "@/api/api";
import { BookDto } from "@/models/book.model";
import { ReviewDto, CreateReviewDto } from "@/models/review.model";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Rating } from "@/components/rating";
import { Textarea } from "@/components/ui/textarea";
import { getFormatName, getLanguageName, getGenreName } from "@/models/enums";
import { useAuth } from "@/hooks/useAuth";

export default function BookDetailsPage() {
  const { slug } = useParams<{ slug: string }>();  const { isAuthenticated, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<BookDto | null>(null);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [orderQty, setOrderQty] = useState(1);
  const [userReview, setUserReview] = useState<ReviewDto | null>(null);  const [addingReview, setAddingReview] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting }
  } = useForm<CreateReviewDto>({
    defaultValues: {
      rating: 5,
      comment: ""
    }
  });

  // Fetch book details and reviews
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch book details
        const bookResponse = await bookAPI.getBySlug(slug!);
        const bookData = bookResponse.data.data;
        setBook(bookData);

        // Fetch book reviews
        const reviewsResponse = await reviewAPI.getBookReviews(bookData.id);
        const reviewsData = reviewsResponse.data.data;
        setReviews(reviewsData);

        // Find user's review if they're authenticated
        if (isAuthenticated && user) {
          const userReviewFound = reviewsData.find(
            (review: ReviewDto) => review.user.id === user.id
          );
          if (userReviewFound) {
            setUserReview(userReviewFound);
          }
        }
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug, isAuthenticated, user]);

  // Check if book is bookmarked
  useEffect(() => {
    const checkBookmark = async () => {
      if (!isAuthenticated || !book) return;
      
      try {
        const response = await bookAPI.isBookmarked(book.id);
        setIsBookmarked(response.data.data);
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmark();
  }, [isAuthenticated, book]);

  const handleToggleBookmark = async () => {
    if (!isAuthenticated || !book) return;
    
    try {
      setBookmarkLoading(true);
      await userAPI.toggleBookmark(book.id);
      setIsBookmarked(prev => !prev);
      toast.success(prev => prev ? 'Book removed from bookmarks' : 'Book added to bookmarks');
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
    } finally {
      setBookmarkLoading(false);
    }
  };

  const onSubmitReview = async (data: CreateReviewDto) => {
    if (!book) return;

    try {
      const response = await reviewAPI.create({
        ...data,
        bookId: book.id
      });

      const newReview = response.data.data;
      setReviews(prev => [...prev, newReview]);
      setUserReview(newReview);
      setAddingReview(false);
      reset();
      toast.success('Review submitted successfully');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="w-full max-h-[500px] overflow-hidden rounded-lg shadow-md">
          <Skeleton className="w-full h-full" />
        </Card>
        <div>
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Book Not Found</h1>
        <p className="text-gray-600">The book you're looking for doesn't exist.</p>
      </div>
    );
  }

  const calculatedPrice = book.isOnSale 
    ? book.price * (1 - book.discountPercentage! / 100)
    : book.price;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="w-full max-h-[500px] overflow-hidden rounded-lg shadow-md">
          <img
            src={book.imageUrl || "/placeholder-book.svg"}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        </Card>

        <div>
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
            <div className="flex items-center gap-2">              <Rating rating={book.averageRating} size="lg" />
              <span className="text-sm text-gray-500">({book.reviewCount})</span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600 mb-6">
            <p>
              Genre: <span className="font-semibold text-gray-900">{getGenreName(book.genre)}</span>
            </p>
            <p>
              Authors:{" "}
              <span className="font-semibold text-gray-900">
                {book.authors.map(a => a.name).join(", ")}
              </span>
            </p>
            <p>
              Publishers:{" "}
              <span className="font-semibold text-gray-900">
                {book.publishers.map(p => p.name).join(", ")}
              </span>
            </p>
            <p>
              Format: <span className="font-semibold text-gray-900">{getFormatName(book.format)}</span>
            </p>
            <p>
              Language: <span className="font-semibold text-gray-900">{getLanguageName(book.language)}</span>
            </p>
            <p>
              ISBN: <span className="font-semibold text-gray-900">{book.isbn}</span>
            </p>
            <div className="flex items-baseline gap-2 mt-4">
              {book.isOnSale ? (
                <>
                  <span className="text-xl font-bold text-red-600">${calculatedPrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 line-through">${book.price.toFixed(2)}</span>
                  <Badge variant="destructive" className="ml-2">{book.discountPercentage}% OFF</Badge>
                </>
              ) : (
                <span className="text-xl font-bold text-blue-600">${book.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-4 mt-1">
              <Input
                id="quantity"
                type="number"
                value={orderQty}
                min={1}
                max={book.stockQuantity}
                onChange={(e) => setOrderQty(parseInt(e.target.value))}
                className="w-24"
              />
              <p className="text-sm text-gray-500">
                {book.stockQuantity === 0 ? (
                  <span className="text-red-500">Out of Stock</span>
                ) : (
                  <span>{book.stockQuantity} in stock</span>
                )}
              </p>
            </div>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            <strong>Description:</strong>
            <br />
            {book.description}
          </p>

          <div className="flex gap-4 mb-6">
            <Button 
              variant="default" 
              disabled={book.stockQuantity === 0}
              onClick={() => {
                // TODO: Implement add to cart
                toast.success(`Added ${orderQty} ${orderQty > 1 ? 'copies' : 'copy'} to cart`);
              }}
            >
              Add to Cart
            </Button>
            <Button 
              variant="outline"
              disabled={book.stockQuantity === 0}
              onClick={() => {
                // TODO: Implement buy now
                toast.success('Redirecting to checkout...');
              }}
            >
              Buy Now
            </Button>            {isAuthenticated && (
              <Button
                variant="ghost"
                className={`${isBookmarked ? 'text-blue-600 hover:text-blue-700' : 'text-gray-600 hover:text-gray-700'}`}
                onClick={handleToggleBookmark}
                disabled={bookmarkLoading}
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill={isBookmarked ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                  {bookmarkLoading ? "..." : (isBookmarked ? "Bookmarked" : "Bookmark")}
                </div>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Reviews</h2>
          {isAuthenticated && (
            userReview ? (
              <div className="text-sm text-gray-600">You have already reviewed this book</div>
            ) : !addingReview ? (
              <Button onClick={() => setAddingReview(true)}>Write a Review</Button>
            ) : null
          )}
        </div>

        {/* Review Form */}
        {isAuthenticated && addingReview && !userReview && (
          <Card className="p-4 mb-6">
            <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
              <div>
                <Label>Rating</Label>
                <Rating
                  className="mt-1"
                  rating={5}
                  readOnly={false}
                  onChange={(rating) => setValue("rating", rating)}
                />
              </div>
              
              <div>
                <Label htmlFor="comment">Your Review</Label>
                <Textarea
                  className="mt-1"
                  placeholder="Share your thoughts about this book..."
                  {...register("comment")}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setAddingReview(false);
                    reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  Post Review
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <Card key={review.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-900">{review.user.username}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Rating rating={review.rating} size="sm" />
                      <span className="text-sm text-gray-500">
                        {format(new Date(review.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                  {isAuthenticated && user?.id === review.user.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {                        try {
                          await reviewAPI.delete(review.id);
                          setReviews(prev => prev.filter(r => r.id !== review.id));
                          setUserReview(null); // This resets the user review state
                          toast.success('Review deleted successfully');
                          // Refresh the book data to get updated review count and rating
                          const bookResponse = await bookAPI.getBySlug(slug!);
                          setBook(bookResponse.data.data);
                        } catch (error) {
                          console.error('Error deleting review:', error);
                          toast.error('Failed to delete review');
                        }
                      }}
                    >
                      Delete
                    </Button>
                  )}
                </div>
                {review.comment && (
                  <p className="mt-2 text-gray-700">{review.comment}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

