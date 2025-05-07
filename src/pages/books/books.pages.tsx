
import { useState } from 'react';
import { Heart, Search, ShoppingCart, Menu, X, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';

interface FilterFormData {
  searchTerm: string;
  genre: string[];
  priceRange: {
    min: number;
    max: number;
  };
  ratings: string[];
  language: string[];
  format: string[];
  publishers: string[];
  sortBy: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  coverImg: string;
  category: string;
  format: string;
  rating: number;
  year: number;
  isbn: string;
  language: string;
  publisher: string;
  stock: number;
  physicalAccess: boolean;
  description: string;
  popularity: number;
}

interface ExpandedSections {
  categories: boolean;
  formats: boolean;
  ratings: boolean;
  years: boolean;
  languages: boolean;
  publishers: boolean;
  availability: boolean;
  priceRange: boolean;
}

interface PriceRange {
  min: number;
  max: number;
}

interface Availability {
  inStock: boolean;
  physicalAccess: boolean;
}

// Sample book data
const books = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 14.99,
    coverImg: "/api/placeholder/200/300",
    category: "Fiction",
    format: "Hardcover",
    rating: 4.5,
    year: 2020,
    isbn: "9780525559474",
    language: "English",
    publisher: "Viking",
    stock: 10,
    physicalAccess: true,
    description: "A dazzling novel about all the choices that go into a life well lived.",
    popularity: 95
  }
];

// Filter options
const genres = ["Fiction", "Non-Fiction", "Self-Help", "Sci-Fi", "Thriller", "Memoir", "Finance", "History", "Biography"];
const formats = ["Hardcover", "Paperback", "E-Book", "Audiobook", "Signed Edition", "Limited Edition", "First Edition", "Collector's Edition", "Author's Edition", "Deluxe Edition"];
const ratings = ["5 Stars", "4+ Stars", "3+ Stars"];
const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Russian"];
const publishers = ["Penguin", "HarperCollins", "Random House", "Simon & Schuster", "Macmillan", "Hachette", "Viking"];
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "title", label: "Title" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
  { value: "popularity", label: "Most Popular" }
];

export default function BookCatalog() {
  const { control, handleSubmit, watch } = useForm<FilterFormData>({
    defaultValues: {
      searchTerm: '',
      genre: [],
      priceRange: {
        min: 0,
        max: 100
      },
      ratings: [],
      language: [],
      format: [],
      publishers: [],
      sortBy: 'relevance'
    }
  });

  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedBooks, setBookmarkedBooks] = useState<number[]>([]);
  const itemsPerPage = 12;

  const onSubmit = (data: FilterFormData) => {
    // Convert the form data into an array of key-value pairs
    const filterData = Object.entries(data).map(([key, value]) => ({
      key,
      value
    }));
    console.log('Filter Data:', filterData);
  };

  // Calculate pagination
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = books.slice(startIndex, endIndex);

  const handleBookmark = (bookId: number) => {
    setBookmarkedBooks(prev => {
      if (prev.includes(bookId)) {
        return prev.filter(id => id !== bookId);
      } else {
        return [...prev, bookId];
      }
    });
    console.log('Bookmark clicked for book ID:', bookId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex gap-4">
              <Controller
                name="searchTerm"
                control={control}
                render={({ field }) => (
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        {...field}
                        type="text"
                        placeholder="Search by title, author, ISBN, or description..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                )}
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Mobile filter button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="flex items-center justify-center w-full p-2 bg-blue-600 text-white rounded"
            >
              {mobileFiltersOpen ? <X className="h-5 w-5 mr-2" /> : <Menu className="h-5 w-5 mr-2" />}
              {mobileFiltersOpen ? 'Close Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters Sidebar */}
          <div className={`md:w-64 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-4 space-y-4">
              <h2 className="text-lg font-medium mb-4">Filters</h2>

              {/* Genre Filter */}
              <div className="border border-gray-200 rounded-md p-3 bg-white">
                <h3 className="text-md font-medium mb-2">Genre</h3>
                <Controller
                  name="genre"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {genres.map((genre) => (
                        <div key={genre} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`genre-${genre}`}
                            checked={field.value.includes(genre)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, genre]
                                : field.value.filter(g => g !== genre);
                              field.onChange(newValue);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`genre-${genre}`} className="ml-2 text-sm text-gray-700">
                            {genre}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Format Filter */}
              <div className="border border-gray-200 rounded-md p-3 bg-white">
                <h3 className="text-md font-medium mb-2">Format</h3>
                <Controller
                  name="format"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {formats.map((format) => (
                        <div key={format} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`format-${format}`}
                            checked={field.value.includes(format)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, format]
                                : field.value.filter(f => f !== format);
                              field.onChange(newValue);
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`format-${format}`} className="ml-2 text-sm text-gray-700">
                            {format}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Price Range */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
                <div className="flex items-center space-x-4">
                  <Controller
                    name="priceRange.min"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        min="0"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Min"
                      />
                    )}
                  />
                  <span className="text-gray-500">to</span>
                  <Controller
                    name="priceRange.max"
                    control={control}
                    render={({ field }) => (
                      <input
                        type="number"
                        {...field}
                        min="0"
                        className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Max"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Language Filter */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Language</h3>
                <div className="space-y-2">
                  {['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese'].map((lang) => (
                    <div key={lang} className="flex items-center">
                      <Controller
                        name="language"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="checkbox"
                            checked={field.value.includes(lang)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, lang]
                                : field.value.filter((l) => l !== lang);
                              field.onChange(newValue);
                            }}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                        )}
                      />
                      <label className="ml-2 text-sm text-gray-600">{lang}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ratings Filter */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Ratings</h3>
                <div className="space-y-2">
                  {['5 Stars', '4 Stars & Up', '3 Stars & Up', '2 Stars & Up', '1 Star & Up'].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <Controller
                        name="ratings"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="checkbox"
                            checked={field.value.includes(rating)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, rating]
                                : field.value.filter((r) => r !== rating);
                              field.onChange(newValue);
                            }}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                        )}
                      />
                      <label className="ml-2 text-sm text-gray-600">{rating}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Publishers Filter */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Publishers</h3>
                <div className="space-y-2">
                  {['Penguin', 'HarperCollins', 'Random House', 'Simon & Schuster', 'Macmillan', 'Hachette'].map((publisher) => (
                    <div key={publisher} className="flex items-center">
                      <Controller
                        name="publishers"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="checkbox"
                            checked={field.value.includes(publisher)}
                            onChange={(e) => {
                              const newValue = e.target.checked
                                ? [...field.value, publisher]
                                : field.value.filter((p) => p !== publisher);
                              field.onChange(newValue);
                            }}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300"
                          />
                        )}
                      />
                      <label className="ml-2 text-sm text-gray-600">{publisher}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div className="border border-gray-200 rounded-md p-3 bg-white">
                <h3 className="text-md font-medium mb-2">Sort By</h3>
                <Controller
                  name="sortBy"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Book Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={book.coverImg}
                      alt={book.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <button
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                        onClick={() => handleBookmark(book.id)}
                      >
                        <Bookmark
                          className={`h-5 w-5 ${bookmarkedBooks.includes(book.id)
                              ? 'text-blue-600 fill-blue-600'
                              : 'text-gray-400'
                            }`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-md font-medium text-gray-900 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(book.rating) ? '★' : i < book.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs ml-1 text-gray-500">({book.rating})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold">${book.price.toFixed(2)}</p>
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                        Add to Cart
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      <p>ISBN: {book.isbn}</p>
                      <p>Publisher: {book.publisher}</p>
                      <p>Language: {book.language}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 rounded ${currentPage === index + 1
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300'
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}