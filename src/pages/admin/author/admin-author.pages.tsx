import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Book, Calendar, Mail, Edit, Save, Search } from 'lucide-react';
import { authorAPI } from '@/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'react-hot-toast';

interface AuthorDto {
    id: string;
    name: string;
    email?: string;
    bookCount: number;
    createdAt: Date;
    lastUpdated?: Date;
}

interface CreateAuthorDto {
    name: string;
    email?: string;
}

interface UpdateAuthorDto {
    name?: string;
    email?: string;
}

export default function AuthorManagement() {
    const [authors, setAuthors] = useState<AuthorDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [deleteDialogAuthor, setDeleteDialogAuthor] = useState<AuthorDto | null>(null);
    const [createForm, setCreateForm] = useState<CreateAuthorDto>({
        name: '',
        email: ''
    });
    const [editingAuthor, setEditingAuthor] = useState<{id: string, data: UpdateAuthorDto} | null>(null);

    // Fetch authors
    useEffect(() => {
        fetchAuthors();
    }, []);

    const fetchAuthors = async () => {
        try {
            setIsLoading(true);
            const response = await authorAPI.getAll();
            setAuthors(response.data.data);
            setError(null);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to fetch authors');
            toast.error('Failed to fetch authors');
        } finally {
            setIsLoading(false);
        }
    };    // Create new author
    const handleCreate = async () => {
        try {
            // Create request data, omitting email if it's empty
            const requestData: CreateAuthorDto = {
                name: createForm.name,
                ...(createForm.email ? { email: createForm.email } : {})
            };

            await authorAPI.create(requestData);
            toast.success('Author created successfully');
            setIsCreateDialogOpen(false);
            setCreateForm({ name: '', email: '' });
            fetchAuthors();
        } catch (err: any) {
            toast.error(err?.response?.data?.error || 'Failed to create author');
        }
    };

    // Update author
    const handleUpdate = async (id: string) => {
        if (!editingAuthor) return;
        try {
            await authorAPI.update(id, editingAuthor.data);
            toast.success('Author updated successfully');
            setEditingAuthor(null);
            fetchAuthors();
        } catch (err: any) {
            toast.error(err?.response?.data?.error || 'Failed to update author');
        }
    };

    // Delete author
    const handleDelete = async (author: AuthorDto) => {
        try {
            await authorAPI.delete(author.id);
            toast.success('Author deleted successfully');
            setDeleteDialogAuthor(null);
            fetchAuthors();
        } catch (err: any) {
            toast.error(err?.response?.data?.error || 'Failed to delete author');
        }
    };

    // Filter authors based on search
    const filteredAuthors = authors.filter(author => 
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <h2 className="text-3xl font-bold tracking-tight">Authors</h2>
                    <p className="text-gray-500 mt-2">Manage your library authors.</p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Author
                </Button>
            </div>

            {/* Search Bar */}
            <div className="flex justify-between gap-2 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search authors..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Authors Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Authors ({filteredAuthors.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Books</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAuthors.map((author) => (
                                <TableRow key={author.id}>
                                    <TableCell>
                                        {editingAuthor?.id === author.id ? (
                                            <Input
                                                value={editingAuthor.data.name || author.name}
                                                onChange={(e) => setEditingAuthor({
                                                    id: author.id,
                                                    data: { ...editingAuthor.data, name: e.target.value }
                                                })}
                                            />
                                        ) : author.name}
                                    </TableCell>
                                    <TableCell>
                                        {editingAuthor?.id === author.id ? (
                                            <Input
                                                value={editingAuthor.data.email || author.email || ''}
                                                onChange={(e) => setEditingAuthor({
                                                    id: author.id,
                                                    data: { ...editingAuthor.data, email: e.target.value }
                                                })}
                                            />
                                        ) : author.email || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-1">
                                            <Book className="h-4 w-4 text-gray-500" />
                                            {author.bookCount}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(author.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        {editingAuthor?.id === author.id ? (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdate(author.id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Save className="h-4 w-4" />
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingAuthor(null)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <X className="h-4 w-4" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingAuthor({
                                                        id: author.id,
                                                        data: { name: author.name, email: author.email }
                                                    })}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => setDeleteDialogAuthor(author)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create Author Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Author</DialogTitle>
                        <DialogDescription>
                            Add a new author to your library. Fill in the details below.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                placeholder="Author name"
                                value={createForm.name}
                                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="Author email (optional)"
                                value={createForm.email}
                                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate}>
                            Create Author
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Author Dialog */}
            <Dialog open={!!deleteDialogAuthor} onOpenChange={() => setDeleteDialogAuthor(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Author</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the author "{deleteDialogAuthor?.name}"? 
                            {deleteDialogAuthor && deleteDialogAuthor.bookCount > 0 && (
                                <span className="text-red-500 block mt-2">
                                    Warning: This author has {deleteDialogAuthor.bookCount} books in the library.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogAuthor(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteDialogAuthor && handleDelete(deleteDialogAuthor)}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Author
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}