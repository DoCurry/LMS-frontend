import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Book, Search, Edit, Save } from 'lucide-react';
import { publisherAPI } from '@/api/api';
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

interface PublisherDto {
    id: string;
    name: string;
    email?: string;
    bookCount: number;
    createdAt: Date;
    lastUpdated?: Date;
}

interface CreatePublisherDto {
    name: string;
    email?: string;
}

interface UpdatePublisherDto {
    name?: string;
    email?: string;
}

export default function PublisherManagement() {
    const [publishers, setPublishers] = useState<PublisherDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [deleteDialogPublisher, setDeleteDialogPublisher] = useState<PublisherDto | null>(null);
    const [createForm, setCreateForm] = useState<CreatePublisherDto>({
        name: '',
        email: ''
    });
    const [editingPublisher, setEditingPublisher] = useState<{id: string, data: UpdatePublisherDto} | null>(null);

    useEffect(() => {
        fetchPublishers();
    }, []);

    const fetchPublishers = async () => {
        try {
            setIsLoading(true);
            const response = await publisherAPI.getAll();
            // Convert dates
            const publishersWithDates = response.data.data.map((pub: any) => ({
                ...pub,
                createdAt: new Date(pub.createdAt),
                lastUpdated: pub.lastUpdated ? new Date(pub.lastUpdated) : undefined
            }));
            setPublishers(publishersWithDates);
            setError(null);
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to fetch publishers');
            toast.error('Failed to fetch publishers');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!createForm.name.trim()) {
            toast.error('Publisher name is required');
            return;
        }

        try {
            // Create request data, omitting email if it's empty
            const requestData: CreatePublisherDto = {
                name: createForm.name,
                ...(createForm.email ? { email: createForm.email } : {})
            };

            await publisherAPI.create(requestData);
            toast.success('Publisher created successfully');
            setIsCreateDialogOpen(false);
            setCreateForm({ name: '', email: '' });
            fetchPublishers();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to create publisher');
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editingPublisher) return;
        
        if (!editingPublisher.data.name?.trim()) {
            toast.error('Publisher name is required');
            return;
        }

        try {
            const requestData: UpdatePublisherDto = {
                ...(editingPublisher.data.name ? { name: editingPublisher.data.name } : {}),
                ...(editingPublisher.data.email === '' ? {} : { email: editingPublisher.data.email })
            };
            
            await publisherAPI.update(id, requestData);
            toast.success('Publisher updated successfully');
            setEditingPublisher(null);
            fetchPublishers();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to update publisher');
        }
    };

    const handleDelete = async (publisher: PublisherDto) => {
        try {
            await publisherAPI.delete(publisher.id);
            toast.success('Publisher deleted successfully');
            setDeleteDialogPublisher(null);
            fetchPublishers();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to delete publisher');
        }
    };

    const filteredPublishers = publishers.filter(publisher => 
        publisher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publisher.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h2 className="text-3xl font-bold tracking-tight">Publishers</h2>
                    <p className="text-gray-500 mt-2">Manage your library publishers.</p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Publisher
                </Button>
            </div>

            {/* Search Bar */}
            <div className="flex justify-between gap-2 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search publishers..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Publishers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Publishers ({filteredPublishers.length})</CardTitle>
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
                            {filteredPublishers.map((publisher) => (
                                <TableRow key={publisher.id}>
                                    <TableCell>
                                        {editingPublisher?.id === publisher.id ? (
                                            <Input
                                                value={editingPublisher.data.name || publisher.name}
                                                onChange={(e) => setEditingPublisher({
                                                    id: publisher.id,
                                                    data: { ...editingPublisher.data, name: e.target.value }
                                                })}
                                            />
                                        ) : publisher.name}
                                    </TableCell>
                                    <TableCell>
                                        {editingPublisher?.id === publisher.id ? (
                                            <Input
                                                value={editingPublisher.data.email || publisher.email || ''}
                                                onChange={(e) => setEditingPublisher({
                                                    id: publisher.id,
                                                    data: { ...editingPublisher.data, email: e.target.value }
                                                })}
                                            />
                                        ) : publisher.email || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <span className="flex items-center gap-1">
                                            <Book className="h-4 w-4 text-gray-500" />
                                            {publisher.bookCount}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {publisher.createdAt.toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {editingPublisher?.id === publisher.id ? (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdate(publisher.id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Save className="h-4 w-4" />
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingPublisher(null)}
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
                                                    onClick={() => setEditingPublisher({
                                                        id: publisher.id,
                                                        data: { name: publisher.name, email: publisher.email }
                                                    })}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => setDeleteDialogPublisher(publisher)}
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

            {/* Create Publisher Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Publisher</DialogTitle>
                        <DialogDescription>
                            Add a new publisher to your library. Fill in the details below.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Name</label>
                            <Input
                                placeholder="Publisher name"
                                value={createForm.name}
                                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="Publisher email (optional)"
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
                            Create Publisher
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Publisher Dialog */}
            <Dialog open={!!deleteDialogPublisher} onOpenChange={() => setDeleteDialogPublisher(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Publisher</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the publisher "{deleteDialogPublisher?.name}"? 
                            {deleteDialogPublisher && deleteDialogPublisher.bookCount > 0 && (
                                <span className="text-red-500 block mt-2">
                                    Warning: This publisher has {deleteDialogPublisher.bookCount} books in the library.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogPublisher(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteDialogPublisher && handleDelete(deleteDialogPublisher)}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Publisher
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}