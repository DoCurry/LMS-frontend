import { useState } from 'react';
import { Heart, Search, ShoppingCart, Menu, X, ChevronDown, ChevronUp, Bookmark } from 'lucide-react';
import { useForm } from 'react-hook-form';

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
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    price: 11.99,
    coverImg: "/api/placeholder/200/300",
    category: "Self-Help",
    format: "Paperback",
    rating: 4.8,
    year: 2018
  },
  {
    id: 3,
    title: "Dune",
    author: "Frank Herbert",
    price: 9.99,
    coverImg: "/api/placeholder/200/300",
    category: "Sci-Fi",
    format: "Paperback",
    rating: 4.7,
    year: 1965
  },
  {
    id: 4,
    title: "Project Hail Mary",
    author: "Andy Weir",
    price: 16.99,
    coverImg: "/api/placeholder/200/300",
    category: "Sci-Fi",
    format: "Hardcover",
    rating: 4.9,
    year: 2021
  },
  {
    id: 5,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    price: 13.99,
    coverImg: "/api/placeholder/200/300",
    category: "Finance",
    format: "Paperback",
    rating: 4.6,
    year: 2020
  },
  {
    id: 6,
    title: "Educated",
    author: "Tara Westover",
    price: 12.99,
    coverImg: "/api/placeholder/200/300",
    category: "Memoir",
    format: "Paperback",
    rating: 4.7,
    year: 2018
  },
  {
    id: 7,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    price: 10.99,
    coverImg: "/api/placeholder/200/300",
    category: "Thriller",
    format: "Paperback",
    rating: 4.5,
    year: 2019
  },
  {
    id: 8,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    price: 14.99,
    coverImg: "/api/placeholder/200/300",
    category: "Fiction",
    format: "Hardcover",
    rating: 4.8,
    year: 2018
  }
];

// Filter categories
const categories = ["Fiction", "Non-Fiction", "Self-Help", "Sci-Fi", "Thriller", "Memoir", "Finance", "History", "Biography"];
const ratings = ["5 Stars", "4+ Stars", "3+ Stars"];
const languages = ["English", "Spanish", "French", "German", "Chinese", "Japanese", "Russian"];
const publishers = ["Penguin", "HarperCollins", "Random House", "Simon & Schuster", "Macmillan", "Hachette", "Viking"];

export default function BookCatalog() {
  const { register, handleSubmit, watch } = useForm();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('relevance');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<ExpandedSections>({
    categories: true,
    formats: true,
    ratings: true,
    years: true,
    languages: true,
    publishers: true,
    availability: true,
    priceRange: true
  });

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 100 });
  const [availability, setAvailability] = useState<Availability>({
    inStock: true,
    physicalAccess: true
  });

  const toggleBookmark = (id: number) => {
    if (bookmarks.includes(id)) {
      setBookmarks(bookmarks.filter(item => item !== id));
    } else {
      setBookmarks([...bookmarks, id]);
    }
  };

  const onSubmit = (data: any) => {
    console.log('Filter Data:', {
      searchTerm,
      sortOption,
      selectedRatings,
      selectedLanguages,
      selectedPublishers,
      priceRange,
      availability,
      ...data
    });
  };

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(item => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const toggleSection = (section: keyof ExpandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };


  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };

  const togglePublisher = (publisher: string) => {
    if (selectedPublishers.includes(publisher)) {
      setSelectedPublishers(selectedPublishers.filter(p => p !== publisher));
    } else {
      setSelectedPublishers([...selectedPublishers, publisher]);
    }
  };

  // Filter and sort books
  const filteredBooks = books.filter(book => {
    // Search filter
    if (searchTerm && !book.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !book.author.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !(book.description?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      !book.isbn?.includes(searchTerm)) {
      return false;
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(book.category)) {
      return false;
    }

    // Format filter
    if (selectedFormats.length > 0 && !selectedFormats.includes(book.format)) {
      return false;
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      const passesRating = selectedRatings.some(rating => {
        if (rating === '5 Stars') return book.rating === 5;
        if (rating === '4+ Stars') return book.rating >= 4;
        if (rating === '3+ Stars') return book.rating >= 3;
        setSelectedRatings(selectedRatings);
        return true;

      });

      if (!passesRating) return false;
    }


    // Language filter
    if (selectedLanguages.length > 0 && book.language && !selectedLanguages.includes(book.language)) {
      return false;
    }

    // Publisher filter
    if (selectedPublishers.length > 0 && book.publisher && !selectedPublishers.includes(book.publisher)) {
      return false;
    }

    // Price range filter
    if (book.price < priceRange.min || book.price > priceRange.max) {
      return false;
    }

    // Availability filter
    if (availability.inStock && (book.stock ?? 0) <= 0) {
      return false;
    }
    if (availability.physicalAccess && !book.physicalAccess) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.year - a.year;
      case 'title':
        return a.title.localeCompare(b.title);
      case 'popularity':
        return (b.popularity ?? 0) - (a.popularity ?? 0);
      default: // relevance
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Subheader with Search */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:max-w-xl relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, author, ISBN, or description..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="md:hidden px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                {mobileFiltersOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar Filters */}
          <div className={`md:w-64 mb-6 md:mb-0 md:pr-6 ${mobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
            <div className="sticky top-4">
              <h2 className="text-lg font-medium mb-4">Filters</h2>
              <div className="space-y-4">
                {/* Price Range */}
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('priceRange')}
                  >
                    <h3 className="text-md font-medium">Price Range</h3>
                    {expandedSections.priceRange ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedSections.priceRange && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="1000"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                        />
                        <span>to</span>
                        <input
                          type="number"
                          min="0"
                          max="1000"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Availability */}
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('availability')}
                  >
                    <h3 className="text-md font-medium">Availability</h3>
                    {expandedSections.availability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedSections.availability && (
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="inStock"
                          checked={availability.inStock}
                          onChange={(e) => setAvailability({ ...availability, inStock: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
                          In Stock
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="physicalAccess"
                          checked={availability.physicalAccess}
                          onChange={(e) => setAvailability({ ...availability, physicalAccess: e.target.checked })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="physicalAccess" className="ml-2 text-sm text-gray-700">
                          Physical Library Access
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Languages */}
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('languages')}
                  >
                    <h3 className="text-md font-medium">Languages</h3>
                    {expandedSections.languages ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedSections.languages && (
                    <div className="space-y-2">
                      {languages.map((language) => (
                        <div key={language} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`language-${language}`}
                            checked={selectedLanguages.includes(language)}
                            onChange={() => toggleLanguage(language)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`language-${language}`} className="ml-2 text-sm text-gray-700">
                            {language}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Rating */}
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('languages')}
                  >
                    <h3 className="text-md font-medium">Ratings</h3>
                    {expandedSections.ratings ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedSections.ratings && (
                    <div className="space-y-2">
                      {ratings.map((rating) => (
                        <div key={rating} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`language-${rating}`}
                            checked={selectedLanguages.includes(rating)}
                            onChange={() => toggleLanguage(rating)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`language-${rating}`} className="ml-2 text-sm text-gray-700">
                            {rating}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Publishers */}
                <div className="border border-gray-200 rounded-md p-3 bg-white">
                  <div
                    className="flex justify-between items-center cursor-pointer mb-2"
                    onClick={() => toggleSection('publishers')}
                  >
                    <h3 className="text-md font-medium">Publishers</h3>
                    {expandedSections.publishers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                  {expandedSections.publishers && (
                    <div className="space-y-2">
                      {publishers.map((publisher) => (
                        <div key={publisher} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`publisher-${publisher}`}
                            checked={selectedPublishers.includes(publisher)}
                            onChange={() => togglePublisher(publisher)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`publisher-${publisher}`} className="ml-2 text-sm text-gray-700">
                            {publisher}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Existing filter sections */}
                {/* ... Categories, Formats, Ratings, Years sections ... */}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Books</h1>
              <div className="flex items-center">
                <span className="mr-2 text-sm hidden md:inline">Sort By</span>
                <select
                  className="border border-gray-300 rounded-md p-2 text-sm"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="title">Title</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                  <option value="popularity">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Book Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <div key={book.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={book.coverImg}
                      alt={book.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                        onClick={() => toggleFavorite(book.id)}
                      >
                        <Heart
                          className={`h-5 w-5 ${favorites.includes(book.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                        />
                      </button>
                      <button
                        className="p-1 bg-white rounded-full shadow hover:bg-gray-100"
                        onClick={() => toggleBookmark(book.id)}
                      >
                        <Bookmark
                          className={`h-5 w-5 ${bookmarks.includes(book.id) ? 'text-blue-500 fill-blue-500' : 'text-gray-400'}`}
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

            {/* Empty state */}
            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600">No books found matching your filters.</p>
                <p className="mt-2 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}