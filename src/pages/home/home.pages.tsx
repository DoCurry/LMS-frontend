import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { bookAPI, announcementAPI } from '@/api/api';
import { BookDto } from '@/models/book.model';
import { AnnouncementDto } from '@/models/announcement.model';

function HomePage() {
  const navigate = useNavigate();
  const [featuredBooks, setFeaturedBooks] = useState<BookDto[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  useEffect(() => {
    const fetchData = async () => {      try {
        const [booksResponse, announcementsResponse] = await Promise.all([
          bookAPI.getAll(),
          announcementAPI.getAll()
        ]);
        
        // Ensure we have arrays even if the response is empty or malformed
        const books = Array.isArray(booksResponse?.data?.data) 
          ? booksResponse.data.data
              .sort(() => Math.random() - 0.5) // Shuffle the array
              .slice(0, 8) // Take only 8 random books
          : [];
          setFeaturedBooks(books);
        setAnnouncements(announcementsResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays in case of error
        setFeaturedBooks([]);
        setAnnouncements([]);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Your Digital Library
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore our collection of books and start your reading journey today.
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
              <Button variant="outline" onClick={() => navigate('/books')}>
                <Search className="h-4 w-4" />
              </Button>
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
      </section>      {/* Announcements Section */}
      {announcements.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-medium text-gray-900 mb-6">Latest Updates</h2>
            <div className="space-y-4">
              {announcements.slice(0, 3).map((announcement) => (
                <Card key={announcement.id} className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-base font-medium text-gray-900 mb-1">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {announcement.content}
                        </p>
                      </div>
                      <time className="text-xs text-gray-400 whitespace-nowrap">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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
