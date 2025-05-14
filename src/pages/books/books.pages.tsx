import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { bookAPI } from '@/api/api';
import { BookDto, BookFilterDto } from '@/models/book.model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { BookFormat, Genre, Language, getFormatName, getGenreName, getLanguageName, getEnumValues } from '@/models/enums';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";

const sortOptions = [
  { value: "title-false", label: "Title (A-Z)" },
  { value: "title-true", label: "Title (Z-A)" },
  { value: "price-true", label: "Price: High to Low" },
  { value: "price-false", label: "Price: Low to High" },
  { value: "date-true", label: "Newest First" },
  { value: "date-false", label: "Oldest First" },
  { value: "rating-true", label: "Rating: High to Low" },
  { value: "rating-false", label: "Rating: Low to High" },
  { value: "soldCount-true", label: "Most Popular" },
  { value: "soldCount-false", label: "Least Popular" }
];

function BooksPage() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'best-sellers' | 'new-releases' | 'new-arrivals' | 'coming-soon' | 'deals'>('all');

  const { register, handleSubmit, watch, setValue } = useForm<BookFilterDto>({
    defaultValues: {
      pageNumber: 1,
      pageSize: 12,
      sortBy: 'title',
      sortDescending: false
    }
  });

  const currentFilters = watch();

  // Create a debounced version of fetchBooks
  const debouncedFetchBooks = useDebouncedCallback(
    (filters: BookFilterDto) => {
      fetchBooks(filters);
    },
    500// 500ms delay
  );

  useEffect(() => {
    debouncedFetchBooks(currentFilters);
  }, [currentFilters.pageNumber, currentFilters.pageSize]);

  // Add effect for filter changes
  useEffect(() => {
    const filterData: BookFilterDto = {
      pageNumber: currentFilters.pageNumber,
      pageSize: currentFilters.pageSize,
      sortBy: currentFilters.sortBy,
      sortDescending: currentFilters.sortDescending
    };

    // Add category-specific filters
    if (activeCategory === 'best-sellers') {
      filterData.sortBy = 'soldCount';
      filterData.sortDescending = true;
    } else if (activeCategory === 'new-releases') {
      filterData.sortBy = 'publicationDate';
      filterData.sortDescending = true;
      // Books released in the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filterData.minPublicationDate = thirtyDaysAgo.toISOString();
    } else if (activeCategory === 'new-arrivals') {
      filterData.sortBy = 'createdAt';
      filterData.sortDescending = true;
    } else if (activeCategory === 'coming-soon') {
      filterData.sortBy = 'publicationDate';
      filterData.sortDescending = true;
      // Books that will be released in the next 30 days
      const today = new Date();
      const thirtyDaysLater = new Date();
      thirtyDaysLater.setDate(thirtyDaysLater.getDate() + 30);
      filterData.minPublicationDate = today.toISOString();
      filterData.maxPublicationDate = thirtyDaysLater.toISOString();
    } else if (activeCategory === 'deals') {
      filterData.hasDiscount = true;
      filterData.sortBy = 'discountPercentage';
      filterData.sortDescending = true;
    }

    // Add search term if present
    if (currentFilters.searchTerm?.trim()) {
      filterData.searchTerm = currentFilters.searchTerm.trim();
    }

    // Add array filters if they exist and aren't empty
    if (currentFilters.genres?.length) filterData.genres = currentFilters.genres;
    if (currentFilters.languages?.length) filterData.languages = currentFilters.languages;
    if (currentFilters.formats?.length) filterData.formats = currentFilters.formats;

    // Add numeric filters if they're valid numbers
    if (typeof currentFilters.minRating === 'number') filterData.minRating = currentFilters.minRating;
    if (typeof currentFilters.minPrice === 'number') filterData.minPrice = currentFilters.minPrice;
    if (typeof currentFilters.maxPrice === 'number') filterData.maxPrice = currentFilters.maxPrice;

    // Add boolean filters only if they're explicitly true
    if (currentFilters.hasDiscount === true) filterData.hasDiscount = true;
    if (currentFilters.isAvailableInLibrary === true) filterData.isAvailableInLibrary = true;

    // Fetch books with the filtered data
    debouncedFetchBooks(filterData);
  }, [
    currentFilters.searchTerm,
    currentFilters.genres,
    currentFilters.languages,
    currentFilters.formats,
    currentFilters.minRating,
    currentFilters.hasDiscount,
    currentFilters.isAvailableInLibrary,
    currentFilters.minPrice,
    currentFilters.maxPrice,
    activeCategory
  ]);

  const fetchBooks = async (filters: BookFilterDto) => {
    try {
      setLoading(true);
      const response = await bookAPI.filter(filters);
      if (response.data.data) {
        setBooks(response.data.data);
        setTotalBooks(response.data.data.length);
      } else {
        setBooks([]);
        setTotalBooks(0);
      }
    } catch (error) {
      console.error('Error fetching books:', error);
      setBooks([]);
      setTotalBooks(0);
    } finally {
      setLoading(false);
    }
  };  const onFilterSubmit = (data: BookFilterDto) => {
    // Initialize with required pagination and sorting params
    const cleanData: Partial<BookFilterDto> = {
      pageNumber: 1,
      pageSize: data.pageSize ?? 12,
      sortBy: data.sortBy ?? 'title',
      sortDescending: data.sortDescending ?? false
    };

    // Add non-empty array filters
    if (data.genres?.length) cleanData.genres = data.genres;
    if (data.languages?.length) cleanData.languages = data.languages;
    if (data.formats?.length) cleanData.formats = data.formats;

    // Add numeric filters
    if (data.minRating) cleanData.minRating = data.minRating;
    if (data.minPrice) cleanData.minPrice = data.minPrice;
    if (data.maxPrice) cleanData.maxPrice = data.maxPrice;

    // Add boolean filters only if they are explicitly true
    if (data.hasDiscount === true) cleanData.hasDiscount = true;
    if (data.isAvailableInLibrary === true) cleanData.isAvailableInLibrary = true;

    // Ensure required pagination params are always included
    const filters: BookFilterDto = {
      pageNumber: 1,
      pageSize: data.pageSize ?? 12,
      sortBy: data.sortBy ?? 'title',
      sortDescending: data.sortDescending ?? false,
      ...cleanData
    };

    fetchBooks(filters);
    setFilterOpen(false);
  };

  const handleSortChange = (value: string) => {
    if (activeCategory !== 'all') {
      setActiveCategory('all');
    }
    const [sortBy, sortDescending] = value.split('-');
    setValue('sortBy', sortBy);
    setValue('sortDescending', sortDescending === 'true');
    setValue('pageNumber', 1);
    fetchBooks({
      ...currentFilters,
      sortBy,
      sortDescending: sortDescending === 'true',
      pageNumber: 1
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Catalogue</h1>
            <p className="text-gray-500">Browse our collection of {totalBooks} books</p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto order-3 md:order-none">
            <Button
              variant={activeCategory === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('all')}
            >
              All Books
            </Button>
            <Button
              variant={activeCategory === 'best-sellers' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('best-sellers')}
            >
              Best Sellers
            </Button>
            <Button
              variant={activeCategory === 'new-releases' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('new-releases')}
            >
              New Releases
            </Button>
            <Button
              variant={activeCategory === 'new-arrivals' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('new-arrivals')}
            >
              New Arrivals
            </Button>
            <Button
              variant={activeCategory === 'coming-soon' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('coming-soon')}
            >
              Coming Soon
            </Button>
            <Button
              variant={activeCategory === 'deals' ? 'default' : 'outline'}
              onClick={() => setActiveCategory('deals')}
            >
              Deals
            </Button>
          </div>

          <div className="flex gap-2 order-2 md:order-none">
            <div className="relative flex-1 md:w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search books..."
                className="pl-9"
                {...register('searchTerm')}
                onChange={(e) => {
                  register('searchTerm').onChange(e);
                  debouncedFetchBooks({
                    ...currentFilters,
                    searchTerm: e.target.value,
                    pageNumber: 1
                  });
                }}
              />
            </div>

            <Select onValueChange={handleSortChange} defaultValue="title-false">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="overflow-y-auto py-4 px-3">
                <SheetHeader className="border-b pb-4">
                  <SheetTitle className="text-xl">Filter Books</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-8">
                  <form onSubmit={handleSubmit(onFilterSubmit)} className="space-y-8">
                    {/* Categories Section */}
                    <div className="space-y-6">
                      <h3 className="font-semibold text-sm text-gray-900">Categories</h3>
                      <div className="grid gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm text-gray-600">Genre</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <span className="line-clamp-1">
                                  {currentFilters.genres?.length
                                    ? `${currentFilters.genres.length} selected`
                                    : "Select genres"}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search genres..." />
                                <CommandEmpty>No genre found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {getEnumValues(Genre).map((genre) => (
                                    <CommandItem
                                      key={genre}
                                      onSelect={() => {
                                        const currentGenres = currentFilters.genres || [];
                                        const newGenres = currentGenres.includes(genre)
                                          ? currentGenres.filter(g => g !== genre)
                                          : [...currentGenres, genre];
                                        setValue('genres', newGenres);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          currentFilters.genres?.includes(genre)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {getGenreName(genre)}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm text-gray-600">Language</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <span className="line-clamp-1">
                                  {currentFilters.languages?.length
                                    ? `${currentFilters.languages.length} selected`
                                    : "Select languages"}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search languages..." />
                                <CommandEmpty>No language found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {getEnumValues(Language).map((language) => (
                                    <CommandItem
                                      key={language}
                                      onSelect={() => {
                                        const currentLanguages = currentFilters.languages || [];
                                        const newLanguages = currentLanguages.includes(language)
                                          ? currentLanguages.filter(l => l !== language)
                                          : [...currentLanguages, language];
                                        setValue('languages', newLanguages);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          currentFilters.languages?.includes(language)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {getLanguageName(language)}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm text-gray-600">Format</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <span className="line-clamp-1">
                                  {currentFilters.formats?.length
                                    ? `${currentFilters.formats.length} selected`
                                    : "Select formats"}
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Search formats..." />
                                <CommandEmpty>No format found.</CommandEmpty>
                                <CommandGroup className="max-h-64 overflow-auto">
                                  {getEnumValues(BookFormat).map((format) => (
                                    <CommandItem
                                      key={format}
                                      onSelect={() => {
                                        const currentFormats = currentFilters.formats || [];
                                        const newFormats = currentFormats.includes(format)
                                          ? currentFormats.filter(f => f !== format)
                                          : [...currentFormats, format];
                                        setValue('formats', newFormats);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          currentFilters.formats?.includes(format)
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {getFormatName(format)}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="space-y-6">
                      <h3 className="font-semibold text-sm text-gray-900">Additional Filters</h3>
                      <div className="grid gap-4">
                        <div className="space-y-1.5">
                          <label htmlFor="rating-select" className="text-sm text-gray-600">Rating</label>
                          <Select
                            onValueChange={(value) => setValue('minRating', Number(value))}
                            defaultValue={currentFilters.minRating?.toString()}
                          >
                            <SelectTrigger id="rating-select" className="w-full">
                              <SelectValue placeholder="Minimum rating" />
                            </SelectTrigger>
                            <SelectContent>
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <SelectItem key={rating} value={rating.toString()}>
                                  {rating}+ ★
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm text-gray-600">Price Range</label>
                          <div className="flex items-center gap-4">
                            <Input                              type="number"
                              placeholder="Min"
                              className="w-full"
                              {...register('minPrice', { 
                                setValueAs: (value: string) => value === "" ? undefined : parseFloat(value)
                              })}
                            />
                            <span className="text-gray-500">-</span>
                            <Input
                              type="number"
                              placeholder="Max"
                              className="w-full"
                              {...register('maxPrice', {
                                setValueAs: (value: string) => value === "" ? undefined : parseFloat(value)
                              })}
                            />
                          </div>
                        </div>

                        <div className="space-y-4 pt-2">
                          <label className="flex items-center space-x-2">
                            <Checkbox
                              id="hasDiscount"
                              className="data-[state=checked]:bg-blue-600"
                              {...register('hasDiscount')}
                            />
                            <span className="text-sm text-gray-700">On Sale Only</span>
                          </label>

                          <label className="flex items-center space-x-2">
                            <Checkbox
                              id="isAvailableInLibrary"
                              className="data-[state=checked]:bg-blue-600"
                              {...register('isAvailableInLibrary')}
                            />
                            <span className="text-sm text-gray-700">Available in Library Only</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="sticky bottom-0 bg-white pt-4 border-t">
                      <Button type="submit" className="w-full font-medium">
                        Apply Filters
                      </Button>
                    </div>
                  </form>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters */}        {/* Active Filters */}
        {(currentFilters.minPrice ||
          currentFilters.maxPrice ||
          currentFilters.genres?.length ||
          currentFilters.languages?.length ||
          currentFilters.formats?.length ||
          currentFilters.minRating ||
          currentFilters.hasDiscount ||
          currentFilters.isAvailableInLibrary
        ) && (
          <div className="flex flex-wrap gap-2">
            {currentFilters.genres?.map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setValue('genres', currentFilters.genres?.filter(g => g !== genre));
                  handleSubmit(onFilterSubmit)();
                }}
              >
                Genre: {getGenreName(genre)} ×
              </Badge>
            ))}

            {currentFilters.languages?.map((language) => (
              <Badge
                key={language}
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setValue('languages', currentFilters.languages?.filter(l => l !== language));
                  handleSubmit(onFilterSubmit)();
                }}
              >
                Language: {getLanguageName(language)} ×
              </Badge>
            ))}

            {currentFilters.formats?.map((format) => (
              <Badge
                key={format}
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setValue('formats', currentFilters.formats?.filter(f => f !== format));
                  handleSubmit(onFilterSubmit)();
                }}
              >
                Format: {getFormatName(format)} ×
              </Badge>
            ))}

            {currentFilters.minRating && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setValue('minRating', undefined);
                  handleSubmit(onFilterSubmit)();
                }}
              >
                {currentFilters.minRating}+ ★ ×
              </Badge>
            )}

            {currentFilters.minPrice && currentFilters.maxPrice && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setValue('minPrice', undefined);
                  setValue('maxPrice', undefined);
                  handleSubmit(onFilterSubmit)();
                }}
              >
                ${currentFilters.minPrice} - ${currentFilters.maxPrice} ×
              </Badge>
            )}

            {currentFilters.hasDiscount && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setValue('hasDiscount', false);
                  handleSubmit(onFilterSubmit)();
                }}
              >
                On Sale Only ×
              </Badge>
            )}

            {currentFilters.isAvailableInLibrary && (
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  setValue('isAvailableInLibrary', false);
                  handleSubmit(onFilterSubmit)();
                }}
              >
                Available in Library Only ×
              </Badge>
            )}
          </div>
        )}

        {/* Books Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(12).fill(0).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="aspect-[2/3] bg-gray-200 rounded-md mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Books Found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setValue('searchTerm', '');
                setValue('minPrice', undefined);
                setValue('maxPrice', undefined);
                setValue('genres', undefined);
                setValue('languages', undefined);
                setValue('formats', undefined);
                setValue('minRating', undefined);
                setValue('hasDiscount', false);
                setValue('isAvailableInLibrary', false);
                setValue('pageNumber', 1);
                handleSubmit(onFilterSubmit)();
              }}
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <Card
                key={book.id}
                className="cursor-pointer group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                onClick={() => navigate(`/books/${book.slug}`)}
              >
                {book.isOnSale && (
                  <div className="absolute top-4 left-4 z-10">
                    <Badge variant="destructive" className="bg-red-500">
                      {book.discountPercentage}% OFF
                    </Badge>
                  </div>
                )}
                <CardContent className="px-3 py-1">
                  <div className="aspect-[2/3] relative mb-2 rounded-md overflow-hidden">
                    <img
                      src={book.imageUrl || '/placeholder-book.svg'}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">                      <Badge variant="secondary" className="bg-black/50 text-white backdrop-blur-sm">
                        {getFormatName(book.format)}
                      </Badge>
                      {book.isAvailableInLibrary && (
                        <Badge variant="secondary" className="bg-green-500/50 text-white backdrop-blur-sm">
                          Library
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{book.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{book.authors[0]?.name}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-yellow-500 whitespace-nowrap">
                        <span className="font-medium">{book.averageRating.toFixed(1)}</span>
                        <span>★</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-baseline gap-1">
                        {book.isOnSale ? (
                          <>
                            <span className="text-xs text-gray-500 line-through">${book.price.toFixed(2)}</span>
                            <span className="text-sm font-semibold text-red-600">
                              ${(book.price * (1 - book.discountPercentage! / 100)).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-sm font-semibold text-blue-600">${book.price.toFixed(2)}</span>
                        )}
                      </div>
                      {book.stockQuantity === 0 ? (
                        <Badge variant="destructive" className="text-[10px]">Out of Stock</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[10px]">{book.stockQuantity} Left</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalBooks > currentFilters.pageSize && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setValue('pageNumber', currentFilters.pageNumber - 1)}
                disabled={currentFilters.pageNumber === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setValue('pageNumber', currentFilters.pageNumber + 1)}
                disabled={currentFilters.pageNumber * currentFilters.pageSize >= totalBooks}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BooksPage;