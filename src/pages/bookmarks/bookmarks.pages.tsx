import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BookDto } from '@/models/book.model';
import { userAPI } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Bookmark, BookMarked } from 'lucide-react';
import { getFormatName } from '@/models/enums';
import { Rating } from '@/components/rating';

export default function BookmarksPage() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getBookmarks();
      setBookmarks(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      toast.error('Failed to load bookmarks');
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (bookId: string) => {
    try {      const response = await userAPI.toggleBookmark(bookId);
      toast.success(response.data.message);
      // Refresh bookmarks
      fetchBookmarks();
    } catch (error) {
      console.error('Error removing bookmark:', error);
      toast.error('Failed to remove bookmark');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 pb-16">
      {/* Header */}
      <header className="mb-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900">Your Bookmarks</h1>
          <p className="mt-2 text-gray-600">Your personal collection of saved books</p>
        </div>
      </header>
      
      {/* Bookmarks Container */}
      <div className="max-w-6xl mx-auto">
        {bookmarks.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map(book => (
              <Card 
                key={book.id} 
                className="group flex flex-col overflow-hidden bg-white/50 backdrop-blur-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div 
                  className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => navigate(`/books/${book.slug}`)}
                >
                  <img 
                    src={book.imageUrl || '/placeholder-book.jpg'} 
                    alt={book.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Floating badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm shadow-sm">
                      {getFormatName(book.format)}
                    </Badge>
                    {book.isAvailableInLibrary && (
                      <Badge className="bg-green-500/90 text-white backdrop-blur-sm shadow-sm">
                        Library
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow relative">
                  {/* Title & Author */}
                  <div className="flex-grow">
                    <h3 
                      className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors cursor-pointer line-clamp-1 group-hover:text-blue-600"
                      onClick={() => navigate(`/books/${book.slug}`)}
                    >
                      {book.title}
                    </h3>

                    <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                      {book.authors.map(a => a.name).join(', ')}
                    </p>

                    {/* Rating */}
                    <div className="mt-2 flex items-center gap-2">
                      <Rating rating={book.averageRating} size="sm" />
                      <span className="text-sm text-gray-500">({book.reviewCount})</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      {book.discountPercentage ? (
                        <div className="flex flex-col">
                          <span className="text-lg font-semibold text-blue-600">
                            ${(book.price * (1 - book.discountPercentage/100)).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${book.price.toFixed(2)}
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            Save {book.discountPercentage}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-semibold text-gray-900">
                          ${book.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-blue-600 hover:text-white hover:bg-blue-600 transition-colors"
                      onClick={() => handleRemoveBookmark(book.id)}
                    >
                      <BookMarked className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-lg shadow-sm">
            <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600 mb-6">Start exploring and save your favorite books!</p>
            <Button onClick={() => navigate('/books')} className="bg-blue-600 hover:bg-blue-700 text-white">
              Browse Books
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}