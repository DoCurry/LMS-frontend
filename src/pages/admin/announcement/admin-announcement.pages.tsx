import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Edit, Save, Search, BellDot, Bell } from 'lucide-react';
import { announcementAPI } from '@/api/api';
import { AnnouncementDto, CreateAnnouncementDto, UpdateAnnouncementDto } from '@/models/announcement.model';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { AnnouncementType, parseAnnouncementType, getAnnouncementTypeName } from '@/models/enums';

// Helper functions
const formatDate = (date: Date): string => date.toISOString().split('T')[0];
const parseDate = (dateStr: string): Date => new Date(dateStr);

// Component
export default function AnnouncementManagement() {
    // State
    const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [deleteDialogAnnouncement, setDeleteDialogAnnouncement] = useState<AnnouncementDto | null>(null);
    
    const [createForm, setCreateForm] = useState<CreateAnnouncementDto>({
        title: '',
        content: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        type: AnnouncementType.Information
    });

    const [editingAnnouncement, setEditingAnnouncement] = useState<{
        id: string;
        data: UpdateAnnouncementDto;
    } | null>(null);

    // Effect hooks
    useEffect(() => {
        fetchAnnouncements();
    }, []);

    // Data fetching
    const fetchAnnouncements = async () => {
        try {
            setIsLoading(true);
            const response = await announcementAPI.getAll();
            const announcementsWithDates = response.data.data.map((announcement: Partial<AnnouncementDto>) => ({
                ...announcement,
                startDate: announcement.startDate ? new Date(announcement.startDate) : new Date(),
                endDate: announcement.endDate ? new Date(announcement.endDate) : new Date(),
                createdAt: announcement.createdAt ? new Date(announcement.createdAt) : new Date(),
                lastUpdated: announcement.lastUpdated ? new Date(announcement.lastUpdated) : undefined
            }));
            setAnnouncements(announcementsWithDates);
            setError(null);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Failed to fetch announcements');
            toast.error('Failed to fetch announcements');
        } finally {
            setIsLoading(false);
        }
    };

    // Event handlers
    const handleCreate = async () => {
        if (!createForm.title.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!createForm.content.trim()) {
            toast.error('Content is required');
            return;
        }

        try {
            await announcementAPI.create({
                ...createForm,
                startDate: new Date(formatDate(createForm.startDate)),
                endDate: new Date(formatDate(createForm.endDate))
            });
            toast.success('Announcement created successfully');
            setIsCreateDialogOpen(false);
            setCreateForm({
                title: '',
                content: '',
                startDate: new Date(),
                endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                type: AnnouncementType.Information
            });
            fetchAnnouncements();
        } catch (err: any) {
            toast.error(err?.response?.data?.error || 'Failed to create announcement');
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editingAnnouncement) return;

        if (!editingAnnouncement.data.title?.trim()) {
            toast.error('Title is required');
            return;
        }

        if (!editingAnnouncement.data.content?.trim()) {
            toast.error('Content is required');
            return;
        }

        try {
            const updateData: UpdateAnnouncementDto = {
                ...editingAnnouncement.data,
                startDate: editingAnnouncement.data.startDate ? parseDate(formatDate(editingAnnouncement.data.startDate)) : undefined,
                endDate: editingAnnouncement.data.endDate ? parseDate(formatDate(editingAnnouncement.data.endDate)) : undefined
            };

            await announcementAPI.update(id, updateData);
            toast.success('Announcement updated successfully');
            setEditingAnnouncement(null);
            fetchAnnouncements();
        } catch (err: any) {
            toast.error(err?.response?.data?.error || 'Failed to update announcement');
        }
    };

    const handleDelete = async (announcement: AnnouncementDto) => {
        try {
            await announcementAPI.delete(announcement.id);
            toast.success('Announcement deleted successfully');
            setDeleteDialogAnnouncement(null);
            fetchAnnouncements();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to delete announcement');
        }
    };

    const toggleActive = async (announcement: AnnouncementDto) => {
        try {
            await announcementAPI.toggle(announcement.id);
            toast.success(`Announcement ${announcement.isActive ? 'deactivated' : 'activated'} successfully`);
            fetchAnnouncements();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Failed to update announcement status');
        }
    };    // Computed values
    const filteredAnnouncements = announcements.filter(announcement =>
        announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getAnnouncementTypeName(announcement.type).toLowerCase().includes(searchTerm.toLowerCase())
    );    const getStatusBadge = (announcement: AnnouncementDto) => {
        const now = new Date();
        if (!announcement.isActive) return <Badge variant="secondary">Inactive</Badge>;
        if (now < announcement.startDate) return <Badge variant="outline">Scheduled</Badge>;
        if (now > announcement.endDate) return <Badge variant="destructive">Expired</Badge>;
        return <Badge variant="default">Active</Badge>;
    };

    // Loading state
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
                    <h2 className="text-3xl font-bold tracking-tight">Announcements</h2>
                    <p className="text-gray-500 mt-2">Manage your library announcements and deals.</p>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Announcement
                </Button>
            </div>

            {/* Search Bar */}
            <div className="flex justify-between gap-2 items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search announcements..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Announcements Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Announcements ({filteredAnnouncements.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAnnouncements.map((announcement) => (
                                <TableRow key={announcement.id}>
                                    <TableCell>
                                        {editingAnnouncement?.id === announcement.id ? (
                                            <div className="space-y-2">
                                                <Input
                                                    value={editingAnnouncement.data.title ?? announcement.title}
                                                    onChange={(e) => setEditingAnnouncement({
                                                        id: announcement.id,
                                                        data: { ...editingAnnouncement.data, title: e.target.value }
                                                    })}
                                                    placeholder="Title"
                                                />
                                                <Textarea
                                                    value={editingAnnouncement.data.content ?? announcement.content}
                                                    onChange={(e) => setEditingAnnouncement({
                                                        id: announcement.id,
                                                        data: { ...editingAnnouncement.data, content: e.target.value }
                                                    })}
                                                    placeholder="Content"
                                                />
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-medium">{announcement.title}</div>
                                                <div className="text-sm text-gray-500 truncate">{announcement.content}</div>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingAnnouncement?.id === announcement.id ? (                                            <Select
                                                value={AnnouncementType[editingAnnouncement.data.type ?? announcement.type]}
                                                onValueChange={(value) => setEditingAnnouncement({
                                                    id: announcement.id,
                                                    data: { ...editingAnnouncement.data, type: AnnouncementType[value as keyof typeof AnnouncementType] }
                                                })}
                                            >
                                                <SelectTrigger className="w-[200px]">
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.keys(AnnouncementType)
                                                        .filter(key => isNaN(Number(key)))
                                                        .map(type => (
                                                            <SelectItem key={type} value={type}>
                                                                {type.replace(/([A-Z])/g, ' $1').trim()}
                                                            </SelectItem>
                                                        ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (                                            <Badge variant="outline" className="capitalize">
                                                {getAnnouncementTypeName(announcement.type)}
                                            </Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingAnnouncement?.id === announcement.id ? (
                                            <div className="space-y-2">
                                                <Input
                                                    type="date"
                                                    value={formatDate(
                                                        editingAnnouncement.data.startDate ?? announcement.startDate
                                                    )}
                                                    onChange={(e) => setEditingAnnouncement({
                                                        id: announcement.id,
                                                        data: { ...editingAnnouncement.data, startDate: parseDate(e.target.value) }
                                                    })}
                                                />
                                                <Input
                                                    type="date"
                                                    value={formatDate(
                                                        editingAnnouncement.data.endDate ?? announcement.endDate
                                                    )}
                                                    onChange={(e) => setEditingAnnouncement({
                                                        id: announcement.id,
                                                        data: { ...editingAnnouncement.data, endDate: parseDate(e.target.value) }
                                                    })}
                                                />
                                            </div>
                                        ) : (
                                            <div className="space-y-1 text-sm">
                                                <div>From: {announcement.startDate.toLocaleDateString()}</div>
                                                <div>To: {announcement.endDate.toLocaleDateString()}</div>
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(announcement)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {editingAnnouncement?.id === announcement.id ? (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdate(announcement.id)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Save className="h-4 w-4" />
                                                    Save
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingAnnouncement(null)}
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
                                                    onClick={() => setEditingAnnouncement({
                                                        id: announcement.id,
                                                        data: {
                                                            title: announcement.title,
                                                            content: announcement.content,
                                                            type: announcement.type,
                                                            startDate: announcement.startDate,
                                                            endDate: announcement.endDate
                                                        }
                                                    })}
                                                    className="flex items-center gap-1"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant={announcement.isActive ? "secondary" : "default"}
                                                    onClick={() => toggleActive(announcement)}
                                                    className="flex items-center gap-1"
                                                >
                                                    {announcement.isActive ? (
                                                        <>
                                                            <BellDot className="h-4 w-4" />
                                                            Deactivate
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Bell className="h-4 w-4" />
                                                            Activate
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => setDeleteDialogAnnouncement(announcement)}
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

            {/* Create Announcement Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New Announcement</DialogTitle>
                        <DialogDescription>
                            Create a new announcement for your library. Fill in the details below.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                placeholder="Announcement title"
                                value={createForm.title}
                                onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content</label>
                            <Textarea
                                placeholder="Announcement content"
                                value={createForm.content}
                                onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Type</label>                            <Select
                                value={AnnouncementType[createForm.type]}
                                onValueChange={(value) => setCreateForm({
                                    ...createForm,
                                    type: AnnouncementType[value as keyof typeof AnnouncementType]
                                })}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(AnnouncementType)
                                        .filter(key => isNaN(Number(key)))
                                        .map(type => (
                                            <SelectItem key={type} value={type}>
                                                {type.replace(/([A-Z])/g, ' $1').trim()}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Start Date</label>
                                <Input
                                    type="date"
                                    value={formatDate(createForm.startDate)}
                                    onChange={(e) => setCreateForm({ ...createForm, startDate: parseDate(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">End Date</label>                                <Input
                                    type="date"
                                    value={formatDate(createForm.endDate)}
                                    onChange={(e) => setCreateForm({ ...createForm, endDate: parseDate(e.target.value) })}
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate}>
                            Create Announcement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Announcement Dialog */}
            <Dialog open={!!deleteDialogAnnouncement} onOpenChange={() => setDeleteDialogAnnouncement(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Announcement</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the announcement "{deleteDialogAnnouncement?.title}"?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogAnnouncement(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => deleteDialogAnnouncement && handleDelete(deleteDialogAnnouncement)}
                            className="flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            Delete Announcement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}