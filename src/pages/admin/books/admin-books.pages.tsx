import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { Check } from 'lucide-react';
import { cn } from "@/lib/utils";
import { bookAPI, authorAPI, publisherAPI } from '@/api/api';
import { BookDto, CreateBookDto, UpdateBookDto } from '@/models/book.model';
import { AuthorDto } from '@/models/author.model';
import { PublisherDto } from '@/models/publisher.model';
import { Language, BookFormat, Genre } from '@/models/enums';
import { getLanguageName, getFormatName, getGenreName } from '@/models/enums';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [authors, setAuthors] = useState<AuthorDto[]>([]);
  const [publishers, setPublishers] = useState<PublisherDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<BookDto | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | undefined>(undefined);  const [editingStock, setEditingStock] = useState<{id: string, qty: number} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [discountDialogOpen, setDiscountDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<{
    id: string;
    data: {
      discountPercentage: number;
      discountStartDate: string;
      discountEndDate: string;
    }
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateBookDto>({
    defaultValues: {
      isAvailableInLibrary: false
    }
  });

  // Form validation rules
  const registerOptions = {
    title: { 
      required: "Title is required",
      minLength: { value: 1, message: "Title must be at least 1 character" },
      maxLength: { value: 200, message: "Title must not exceed 200 characters" }
    },
    isbn: {
      required: "ISBN is required",
      minLength: { value: 10, message: "ISBN must be at least 10 characters" },
      maxLength: { value: 13, message: "ISBN must not exceed 13 characters" }
    },
    description: {
      required: "Description is required",
      maxLength: { value: 2000, message: "Description cannot exceed 2000 characters" }
    },
    authorIds: {
      required: "At least one author is required",
      validate: (value: string[]) => value.length > 0 || "At least one author is required"
    },
    publisherIds: {
      required: "At least one publisher is required",
      validate: (value: string[]) => value.length > 0 || "At least one publisher is required"
    },
    publicationDate: {
      required: "Publication date is required"
    },
    price: {
      required: "Price is required",
      min: { value: 0.01, message: "Price must be at least 0.01" },
      max: { value: 9999.99, message: "Price cannot exceed 9999.99" }
    },
    stockQuantity: {
      required: "Stock quantity is required",
      min: { value: 0, message: "Stock quantity cannot be negative" }
    },
    language: {
      required: "Language is required"
    },
    format: {
      required: "Format is required"
    },
    genre: {
      required: "Genre is required"
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchAuthorsAndPublishers();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await bookAPI.getAll();
      setBooks(response.data.data);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuthorsAndPublishers = async () => {
    try {
      const [authorsRes, publishersRes] = await Promise.all([
        authorAPI.getAll(),
        publisherAPI.getAll()
      ]);
      setAuthors(authorsRes.data.data);
      setPublishers(publishersRes.data.data);
    } catch (error) {
      console.error('Error fetching authors and publishers:', error);
      toast.error('Failed to load authors and publishers');
    }
  };
  const handleAddBook = async (data: CreateBookDto) => {
    try {
      // Convert local date to UTC
      const utcDate = new Date(data.publicationDate);
      const bookData = {
        ...data,
        publicationDate: utcDate.toISOString(),
      };

      await bookAPI.create(JSON.stringify(bookData), selectedImage);
      toast.success('Book added successfully');
      setAddDialogOpen(false);
      reset();
      setSelectedImage(undefined);
      fetchBooks();
    } catch (error: any) {
      console.error('Error adding book:', error);
      toast.error(error?.response?.data?.message || 'Failed to add book. Please check your input and try again.');
    }
  };
  const handleEditBook = async (data: UpdateBookDto) => {
    if (!selectedBook) return;

    try {
      const updateData = { 
        ...data,
        language: parseInt(data.language as string),
        format: parseInt(data.format as string),
        genre: parseInt(data.genre as string)
      };
      
      // If publication date is being updated, convert to UTC
      if (data.publicationDate) {
        const utcDate = new Date(data.publicationDate);
        updateData.publicationDate = utcDate.toISOString();
      }

      await bookAPI.update(selectedBook.id, updateData);
      if (selectedImage) {
        await bookAPI.uploadCover(selectedBook.id, selectedImage);
      }
      toast.success('Book updated successfully');
      setEditDialogOpen(false);
      setSelectedBook(null);
      setSelectedImage(undefined);
      fetchBooks();
    } catch (error: any) {
      console.error('Error updating book:', error);
      toast.error(error?.response?.data?.message || 'Failed to update book. Please check your input and try again.');
    }
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;

    try {
      await bookAPI.delete(selectedBook.id);
      toast.success('Book deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedBook(null);
      fetchBooks();
    } catch (error: any) {
      console.error('Error deleting book:', error);
      toast.error(error?.response?.data?.message || 'Failed to delete book. Please try again.');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };
  const handleUpdateStock = async (bookId: string, newQuantity: number) => {
    if (newQuantity < 0) {
      toast.error('Stock quantity cannot be negative');
      return;
    }

    try {
      await bookAPI.updateStock(bookId, newQuantity);
      toast.success('Stock updated successfully');
      fetchBooks();
    } catch (error: any) {
      console.error('Error updating stock:', error);
      toast.error(error?.response?.data?.message || 'Failed to update stock quantity. Please try again.');
    } finally {
      setEditingStock(null);
    }
  };  const handleDiscountUpdate = async () => {
    if (!editingDiscount) return;

    try {
      await bookAPI.setDiscount(
        editingDiscount.id,
        editingDiscount.data.discountPercentage,
        new Date(editingDiscount.data.discountStartDate),
        new Date(editingDiscount.data.discountEndDate)
      );
      toast.success('Discount updated successfully');
      setDiscountDialogOpen(false);
      setEditingDiscount(null);
      fetchBooks();
    } catch (error: any) {
      console.error('Error updating discount:', error);
      toast.error(error?.response?.data?.message || 'Failed to update discount');
    }
  };

  const handleRemoveDiscount = async (bookId: string) => {
    try {
      await bookAPI.removeDiscount(bookId);
      toast.success('Discount removed successfully');
      fetchBooks();
    } catch (error: any) {
      console.error('Error removing discount:', error);
      toast.error(error?.response?.data?.message || 'Failed to remove discount');
    }
  };

  const openEdit = (book: BookDto) => {
    setSelectedBook(book);
    
    // Convert date to local timezone for input
    const localDate = new Date(book.publicationDate);
    const formattedDate = localDate.toISOString().split('T')[0];
    
    setValue('title', book.title);
    setValue('isbn', book.isbn);
    setValue('description', book.description);
    setValue('authorIds', book.authors.map(a => a.id));
    setValue('publisherIds', book.publishers.map(p => p.id));
    setValue('publicationDate', formattedDate);
    setValue('price', book.price);
    setValue('stockQuantity', book.stockQuantity);
    setValue('language', book.language.toString()); // Convert to string for select component
    setValue('format', book.format.toString()); // Convert to string for select component
    setValue('genre', book.genre.toString()); // Convert to string for select component
    setValue('isAvailableInLibrary', book.isAvailableInLibrary);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Books</h2>
          <p className="text-gray-500 mt-2">Manage your library books.</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Book
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex justify-between gap-2 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search books..."
            className="pl-8"
            onChange={(e) => {
              // TODO: Add search functionality
            }}
          />
        </div>
      </div>

      {/* Books Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Books ({books.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>ISBN</TableHead>
                <TableHead>Authors</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((book) => (
                <TableRow key={book.id}>
                  <TableCell>{book.title}</TableCell>                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.authors.map(a => a.name).join(', ')}</TableCell>
                  <TableCell>{getGenreName(book.genre)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      ${book.price.toFixed(2)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 items-center">
                      {editingStock?.id === book.id ? (
                        <>
                          <Input
                            type="number"
                            className="w-20 mr-2"
                            value={editingStock.qty}
                            min={0}
                            onChange={(e) => setEditingStock({ 
                              id: book.id, 
                              qty: parseInt(e.target.value) || 0 
                            })}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2 h-8"
                            onClick={() => handleUpdateStock(book.id, editingStock.qty)}
                          >
                            ✓
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="p-2 h-8"
                            onClick={() => setEditingStock(null)}
                          >
                            ×
                          </Button>
                        </>
                      ) : (
                        <div 
                          className="hover:bg-gray-100 p-1 rounded cursor-pointer flex items-center gap-2"
                          onClick={() => setEditingStock({
                            id: book.id,
                            qty: book.stockQuantity
                          })}
                        >
                          {book.stockQuantity}
                          <span className="text-xs text-gray-500">(click to edit)</span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {book.isOnSale && (
                        <Badge variant="destructive">On Sale</Badge>
                      )}
                      {book.isAvailableInLibrary && (
                        <Badge variant="secondary">Library</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {book.isOnSale ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRemoveDiscount(book.id)}
                          className="flex items-center gap-1"
                        >
                          Remove Discount
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditingDiscount({
                              id: book.id,
                              data: {
                                discountPercentage: 0,
                                discountStartDate: new Date().toISOString().split('T')[0],
                                discountEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                              }
                            });
                            setDiscountDialogOpen(true);
                          }}
                          className="flex items-center gap-1"
                        >
                          Add Discount
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(book)}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setSelectedBook(book);
                          setDeleteDialogOpen(true);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Pagination */}
      {books.length > itemsPerPage && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(books.length / itemsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(books.length / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add Book Dialog */}      <Dialog open={addDialogOpen} onOpenChange={(open) => {
          setAddDialogOpen(open);
          if (!open) {
            reset({
              title: '',
              isbn: '',
              description: '',
              authorIds: [],
              publisherIds: [],
              publicationDate: undefined,
              price: undefined,
              stockQuantity: undefined,
              language: undefined,
              format: undefined,
              genre: undefined,
              isAvailableInLibrary: false
            });
            setSelectedImage(undefined);
          }
        }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddBook)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Book title"
                  {...register("title", registerOptions.title)}
                />
                {errors.title && (
                  <span className="text-sm text-red-500">{errors.title.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  placeholder="ISBN"
                  {...register("isbn", registerOptions.isbn)}
                />
                {errors.isbn && (
                  <span className="text-sm text-red-500">{errors.isbn.message}</span>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Book description"
                {...register("description", registerOptions.description)}
              />
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description.message}</span>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorIds">Authors</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {watch('authorIds')?.map((authorId) => {
                    const author = authors.find(a => a.id === authorId);
                    if (!author) return null;
                    return (
                      <Badge key={authorId} variant="secondary" className="gap-1">
                        {author.name}
                        <button
                          type="button"
                          onClick={() => {
                            const currentAuthors = watch('authorIds') || [];
                            setValue('authorIds', currentAuthors.filter(id => id !== authorId));
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <span className="line-clamp-1">
                        Select authors
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search authors..." />
                      <CommandEmpty>No author found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {authors
                          .filter(author => !(watch('authorIds') || []).includes(author.id))
                          .map((author) => (
                            <CommandItem
                              key={author.id}
                              onSelect={() => {
                                const currentAuthors = watch('authorIds') || [];
                                setValue('authorIds', [...currentAuthors, author.id]);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  watch('authorIds')?.includes(author.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {author.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.authorIds && (
                  <span className="text-sm text-red-500">{errors.authorIds.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="publisherIds">Publishers</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {watch('publisherIds')?.map((publisherId) => {
                    const publisher = publishers.find(p => p.id === publisherId);
                    if (!publisher) return null;
                    return (
                      <Badge key={publisherId} variant="secondary" className="gap-1">
                        {publisher.name}
                        <button
                          type="button"
                          onClick={() => {
                            const currentPublishers = watch('publisherIds') || [];
                            setValue('publisherIds', currentPublishers.filter(id => id !== publisherId));
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <span className="line-clamp-1">
                        Select publishers
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search publishers..." />
                      <CommandEmpty>No publisher found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {publishers
                          .filter(publisher => !(watch('publisherIds') || []).includes(publisher.id))
                          .map((publisher) => (
                            <CommandItem
                              key={publisher.id}
                              onSelect={() => {
                                const currentPublishers = watch('publisherIds') || [];
                                setValue('publisherIds', [...currentPublishers, publisher.id]);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  watch('publisherIds')?.includes(publisher.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {publisher.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.publisherIds && (
                  <span className="text-sm text-red-500">{errors.publisherIds.message}</span>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publicationDate">Publication Date</Label>
                <Input
                  id="publicationDate"
                  type="date"
                  {...register("publicationDate", registerOptions.publicationDate)}
                />
                {errors.publicationDate && (
                  <span className="text-sm text-red-500">{errors.publicationDate.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", registerOptions.price)}
                />
                {errors.price && (
                  <span className="text-sm text-red-500">{errors.price.message}</span>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select onValueChange={(value) => setValue('language', value)} value={watch('language')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Language)
                      .filter((v) => !isNaN(Number(v)))
                      .map((language) => (
                        <SelectItem key={language} value={language.toString()}>
                          {getLanguageName(language as Language)}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && (
                  <span className="text-sm text-red-500">{errors.language.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <Select onValueChange={(value) => setValue('format', value)} value={watch('format')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BookFormat)
                      .filter((v) => !isNaN(Number(v)))
                      .map((format) => (
                        <SelectItem key={format} value={format.toString()}>
                          {getFormatName(format as BookFormat)}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.format && (
                  <span className="text-sm text-red-500">{errors.format.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Select onValueChange={(value) => setValue('genre', value)} value={watch('genre')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Genre)
                      .filter((v) => !isNaN(Number(v)))
                      .map((genre) => (
                        <SelectItem key={genre} value={genre.toString()}>
                          {getGenreName(genre as Genre)}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genre && (
                  <span className="text-sm text-red-500">{errors.genre.message}</span>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  {...register("stockQuantity", registerOptions.stockQuantity)}
                />
                {errors.stockQuantity && (
                  <span className="text-sm text-red-500">{errors.stockQuantity.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="image">Cover Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Checkbox
                  {...register("isAvailableInLibrary")}
                />
                <span>Available in Library</span>
              </Label>
            </div>            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setAddDialogOpen(false);
                  reset({
                    title: '',
                    isbn: '',
                    description: '',
                    authorIds: [],
                    publisherIds: [],
                    publicationDate: undefined,
                    price: undefined,
                    stockQuantity: undefined,
                    language: undefined,
                    format: undefined,
                    genre: undefined,
                    isAvailableInLibrary: false
                  });
                  setSelectedImage(undefined);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Book</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Book Dialog */}      <Dialog open={editDialogOpen} onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            reset({
              title: '',
              isbn: '',
              description: '',
              authorIds: [],
              publisherIds: [],
              publicationDate: undefined,
              price: undefined,
              stockQuantity: undefined,
              language: undefined,
              format: undefined,
              genre: undefined,
              isAvailableInLibrary: false
            });
            setSelectedImage(undefined);
            setSelectedBook(null);
          }
        }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditBook)} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Book title"
                  {...register("title", registerOptions.title)}
                />
                {errors.title && (
                  <span className="text-sm text-red-500">{errors.title.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  placeholder="ISBN"
                  {...register("isbn", registerOptions.isbn)}
                />
                {errors.isbn && (
                  <span className="text-sm text-red-500">{errors.isbn.message}</span>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Book description"
                {...register("description", registerOptions.description)}
              />
              {errors.description && (
                <span className="text-sm text-red-500">{errors.description.message}</span>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorIds">Authors</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {watch('authorIds')?.map((authorId) => {
                    const author = authors.find(a => a.id === authorId);
                    if (!author) return null;
                    return (
                      <Badge key={authorId} variant="secondary" className="gap-1">
                        {author.name}
                        <button
                          type="button"
                          onClick={() => {
                            const currentAuthors = watch('authorIds') || [];
                            setValue('authorIds', currentAuthors.filter(id => id !== authorId));
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <span className="line-clamp-1">
                        Select authors
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search authors..." />
                      <CommandEmpty>No author found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {authors
                          .filter(author => !(watch('authorIds') || []).includes(author.id))
                          .map((author) => (
                            <CommandItem
                              key={author.id}
                              onSelect={() => {
                                const currentAuthors = watch('authorIds') || [];
                                setValue('authorIds', [...currentAuthors, author.id]);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  watch('authorIds')?.includes(author.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {author.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.authorIds && (
                  <span className="text-sm text-red-500">{errors.authorIds.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="publisherIds">Publishers</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {watch('publisherIds')?.map((publisherId) => {
                    const publisher = publishers.find(p => p.id === publisherId);
                    if (!publisher) return null;
                    return (
                      <Badge key={publisherId} variant="secondary" className="gap-1">
                        {publisher.name}
                        <button
                          type="button"
                          onClick={() => {
                            const currentPublishers = watch('publisherIds') || [];
                            setValue('publisherIds', currentPublishers.filter(id => id !== publisherId));
                          }}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    );
                  })}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <span className="line-clamp-1">
                        Select publishers
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search publishers..." />
                      <CommandEmpty>No publisher found.</CommandEmpty>
                      <CommandGroup className="max-h-64 overflow-auto">
                        {publishers
                          .filter(publisher => !(watch('publisherIds') || []).includes(publisher.id))
                          .map((publisher) => (
                            <CommandItem
                              key={publisher.id}
                              onSelect={() => {
                                const currentPublishers = watch('publisherIds') || [];
                                setValue('publisherIds', [...currentPublishers, publisher.id]);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  watch('publisherIds')?.includes(publisher.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {publisher.name}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.publisherIds && (
                  <span className="text-sm text-red-500">{errors.publisherIds.message}</span>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="publicationDate">Publication Date</Label>
                <Input
                  id="publicationDate"
                  type="date"
                  {...register("publicationDate", registerOptions.publicationDate)}
                />
                {errors.publicationDate && (
                  <span className="text-sm text-red-500">{errors.publicationDate.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", registerOptions.price)}
                />
                {errors.price && (
                  <span className="text-sm text-red-500">{errors.price.message}</span>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="language">Language</Label>
                <Select onValueChange={(value) => setValue('language', value)} value={watch('language')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Language)
                      .filter((v) => !isNaN(Number(v)))
                      .map((language) => (
                        <SelectItem key={language} value={language.toString()}>
                          {getLanguageName(language as Language)}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.language && (
                  <span className="text-sm text-red-500">{errors.language.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="format">Format</Label>
                <Select onValueChange={(value) => setValue('format', value)} value={watch('format')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(BookFormat)
                      .filter((v) => !isNaN(Number(v)))
                      .map((format) => (
                        <SelectItem key={format} value={format.toString()}>
                          {getFormatName(format as BookFormat)}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.format && (
                  <span className="text-sm text-red-500">{errors.format.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="genre">Genre</Label>
                <Select onValueChange={(value) => setValue('genre', value)} value={watch('genre')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(Genre)
                      .filter((v) => !isNaN(Number(v)))
                      .map((genre) => (
                        <SelectItem key={genre} value={genre.toString()}>
                          {getGenreName(genre as Genre)}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.genre && (
                  <span className="text-sm text-red-500">{errors.genre.message}</span>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  {...register("stockQuantity", registerOptions.stockQuantity)}
                />
                {errors.stockQuantity && (
                  <span className="text-sm text-red-500">{errors.stockQuantity.message}</span>
                )}
              </div>
              <div>
                <Label htmlFor="image">Cover Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div>
              <Label className="flex items-center gap-2">
                <Checkbox
                  {...register("isAvailableInLibrary")}
                />
                <span>Available in Library</span>
              </Label>
            </div>            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setEditDialogOpen(false);
                  reset({
                    title: '',
                    isbn: '',
                    description: '',
                    authorIds: [],
                    publisherIds: [],
                    publicationDate: undefined,
                    price: undefined,
                    stockQuantity: undefined,
                    language: undefined,
                    format: undefined,
                    genre: undefined,
                    isAvailableInLibrary: false
                  });
                  setSelectedImage(undefined);
                  setSelectedBook(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete "{selectedBook?.title}"?</p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteBook}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Discount Dialog */}
      <Dialog open={discountDialogOpen} onOpenChange={setDiscountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingDiscount ? 'Add Discount' : 'Edit Discount'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Discount Percentage</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={editingDiscount?.data.discountPercentage}
                onChange={(e) => setEditingDiscount(prev => prev ? {
                  ...prev,
                  data: {
                    ...prev.data,
                    discountPercentage: Number(e.target.value)
                  }
                } : null)}
                placeholder="Enter discount percentage"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={editingDiscount?.data.discountStartDate}
                  onChange={(e) => setEditingDiscount(prev => prev ? {
                    ...prev,
                    data: {
                      ...prev.data,
                      discountStartDate: e.target.value
                    }
                  } : null)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={editingDiscount?.data.discountEndDate}
                  onChange={(e) => setEditingDiscount(prev => prev ? {
                    ...prev,
                    data: {
                      ...prev.data,
                      discountEndDate: e.target.value
                    }
                  } : null)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDiscountDialogOpen(false);
                setEditingDiscount(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleDiscountUpdate}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {books.length > itemsPerPage && (
        <div className="flex justify-center mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(books.length / itemsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(books.length / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
