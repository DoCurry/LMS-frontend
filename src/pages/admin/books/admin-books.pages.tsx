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
import { useState } from "react";
import { useForm } from "react-hook-form";

type Book = {
  id: string;
  title: string;
  author: string;
  publisher: string;
  genre: string;
  price: number;
  quantity: number;
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([
    {
      id: "1",
      title: "Clean Code",
      author: "Robert C. Martin",
      publisher: "Prentice Hall",
      genre: "Programming",
      price: 35.99,
      quantity: 20,
    },
    {
      id: "2",
      title: "Refactoring",
      author: "Martin Fowler",
      publisher: "Addison-Wesley",
      genre: "Software Engineering",
      price: 42.5,
      quantity: 12,
    },
  ]);

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(books.length / itemsPerPage);

  const paginatedBooks = books.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      author: "",
      publisher: "",
      genre: "",
      price: "",
    },
  });

  const adjustStock = (id: string, change: number) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id
          ? { ...book, quantity: Math.max(0, book.quantity + change) }
          : book
      )
    );
  };

  const openEdit = (book: Book) => {
    setSelectedBook(book);
    setValue("title", book.title);
    setValue("author", book.author);
    setValue("publisher", book.publisher);
    setValue("genre", book.genre);
    setValue("price", book.price.toString());
    setEditDialogOpen(true);
  };

  const saveEdit = (data: any) => {
    console.log("Edited Book Data:", data);
    if (!selectedBook) return;
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === selectedBook.id
          ? { ...book, ...data, price: parseFloat(data.price) }
          : book
      )
    );
    setEditDialogOpen(false);
  };

  const openDelete = (book: Book) => {
    setSelectedBook(book);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedBook) return;
    setBooks((prevBooks) =>
      prevBooks.filter((book) => book.id !== selectedBook.id)
    );
    setDeleteDialogOpen(false);
  };

  const addBook = (data: any) => {
    console.log("New Book Data:", data);
    const newBook: Book = {
      id: Date.now().toString(),
      title: data.title,
      author: data.author,
      publisher: data.publisher,
      genre: data.genre,
      price: parseFloat(data.price),
      quantity: 0,
    };
    setBooks((prevBooks) => {
      const updatedBooks = [...prevBooks, newBook];
      const newTotalPages = Math.ceil(updatedBooks.length / itemsPerPage);
      setCurrentPage(newTotalPages);
      return updatedBooks;
    });
    setAddDialogOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Books</h2>

      <div className="mb-4">
        <Button
          onClick={() => {
            reset();
            setAddDialogOpen(true);
          }}
        >
          + Add Book
        </Button>
      </div>

      <Table>
        <TableCaption>A list of all available books.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Publisher</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.publisher}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>Rs. {book.price}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustStock(book.id, -1)}
                  >
                    −
                  </Button>
                  <span>{book.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => adjustStock(book.id, 1)}
                  >
                    +
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEdit(book)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => openDelete(book)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center space-x-2 mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Prev
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </Button>
      </div>
      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(saveEdit)} className="space-y-2 mt-4">
            <Input
              placeholder="Title"
              {...register("title", { required: true })}
            />
            <Input
              placeholder="Author"
              {...register("author", { required: true })}
            />
            <Input
              placeholder="Publisher"
              {...register("publisher", { required: true })}
            />
            <Input
              placeholder="Genre"
              {...register("genre", { required: true })}
            />
            <Input
              placeholder="Price"
              type="number"
              {...register("price", { required: true })}
            />
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(addBook)} className="space-y-2 mt-4">
            <Input
              placeholder="Title"
              {...register("title", { required: true })}
            />
            <Input
              placeholder="Author"
              {...register("author", { required: true })}
            />
            <Input
              placeholder="Publisher"
              {...register("publisher", { required: true })}
            />
            <Input
              placeholder="Genre"
              {...register("genre", { required: true })}
            />
            <Input
              placeholder="Price"
              type="number"
              {...register("price", { required: true })}
            />
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Book</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <strong>{selectedBook?.title}</strong>?
          </p>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
