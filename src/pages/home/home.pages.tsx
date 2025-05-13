import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, BookOpen, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { bookAPI } from '@/api/api';
import { BookDto } from '@/models/book.model';
import heroPattern from '@/assets/hero-pattern.svg';

function HomePage() {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState<BookDto[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const booksResponse = await bookAPI.getAll();
        
        // Ensure we have arrays even if the response is empty or malformed
        const books = Array.isArray(booksResponse?.data?.data) 
          ? booksResponse.data.data
              .sort(() => Math.random() - 0.5) // Shuffle the array
              .slice(0, 8) // Take only 8 random books
          : [];
        setFeaturedBooks(books);
      } catch (error) {
        console.error('Error fetching data:', error);
        setFeaturedBooks([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 z-0 animate-pulse-slow" 
          style={{
            backgroundImage: `url(${heroPattern})`,
            backgroundSize: '200px 200px',
            opacity: 0.7
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-white/80 to-blue-50/90 z-0" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="mb-4 flex justify-center">
              <Badge variant="secondary" className="px-4 py-1 text-blue-600 bg-blue-50">
                Your Digital Library
              </Badge>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Discover Your Next <span className="text-blue-600">Great Read</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Access thousands of books, manage your reading journey, and connect with fellow readers.
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input
                  type="search"
                  placeholder="Search for books..."
                  className="w-full"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      navigate(`/books?search=${e.currentTarget.value}`);
                    }
                  }}
                />
                <Button variant="default" onClick={() => navigate('/books')}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Extensive Collection</h3>
              <p className="text-gray-600">Browse through our vast library of books across all genres</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Borrowing</h3>
              <p className="text-gray-600">Quick and simple process to borrow and return books</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600">Join our community of book lovers and share your thoughts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-medium text-gray-900">Our Books</h2>
            <Button variant="link" onClick={() => navigate('/books')} className="text-gray-600 hover:text-gray-900">
              View all <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredBooks.slice(0, 4).map((book) => (
              <Card 
                key={book.id} 
                className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/books/${book.slug}`)}
              >
                <CardContent className="p-4">
                  <div className="aspect-[2/3] relative mb-3 rounded overflow-hidden bg-gray-100">
                    <img
                      src={book.imageUrl || '/placeholder-book.svg'}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-gray-900 line-clamp-1 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-1">{book.authors?.[0]?.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About LMS Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">About Our Library</h2>
          <p className="text-gray-600 leading-relaxed">
            Our Library Management System provides a modern digital platform for book lovers. 
            Browse through our extensive collection, manage your reading list, and join our 
            community of readers. With features like online reservations, digital tracking, 
            and personalized recommendations, we make it easier than ever to discover and 
            enjoy your next favorite book.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
