import { useState } from 'react';
import { Plus, Edit, Trash2, X, Calendar, AlertTriangle, Info, Megaphone, Check, ChevronDown } from 'lucide-react';

enum AnnouncementType {
    Information = 'Information',
    Warning = 'Warning',
    Critical = 'Critical'
}

interface AnnouncementDto {
    id: string;
    title: string;
    content: string;
    startDate: Date;
    endDate: Date;
    type: AnnouncementType;
    isActive: boolean;
    createdAt: Date;
    lastUpdated?: Date;
}

interface CreateAnnouncementDto {
    title: string;
    content: string;
    startDate: Date;
    endDate: Date;
    type: AnnouncementType;
}

interface UpdateAnnouncementDto {
    title?: string;
    content?: string;
    startDate?: Date;
    endDate?: Date;
    type?: AnnouncementType;
    isActive?: boolean;
}

const AnnouncementManagement = () => {
    // Sample data
    const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([
        {
            id: '1',
            title: 'System Maintenance',
            content: 'The system will be down for maintenance on Friday from 2-4 AM.',
            startDate: new Date('2023-07-01'),
            endDate: new Date('2023-07-02'),
            type: AnnouncementType.Warning,
            isActive: true,
            createdAt: new Date('2023-06-28'),
            lastUpdated: new Date('2023-06-29')
        },
        {
            id: '2',
            title: 'New Feature Release',
            content: 'We have released a new dashboard feature. Check it out!',
            startDate: new Date('2023-07-10'),
            endDate: new Date('2023-07-20'),
            type: AnnouncementType.Information,
            isActive: true,
            createdAt: new Date('2023-07-05')
        },
        {
            id: '3',
            title: 'Security Alert',
            content: 'Important security update required for all users.',
            startDate: new Date('2023-06-15'),
            endDate: new Date('2023-06-30'),
            type: AnnouncementType.Critical,
            isActive: false,
            createdAt: new Date('2023-06-10'),
            lastUpdated: new Date('2023-06-25')
        }
    ]);

    // Form states
    const [createFormData, setCreateFormData] = useState<CreateAnnouncementDto>({
        title: '',
        content: '',
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000), // Tomorrow
        type: AnnouncementType.Information
    });

    const [updateFormData, setUpdateFormData] = useState<UpdateAnnouncementDto>({
        title: '',
        content: '',
        startDate: undefined,
        endDate: undefined,
        type: undefined,
        isActive: undefined
    });

    const [errors, setErrors] = useState<{
        create?: Partial<CreateAnnouncementDto>;
        update?: Partial<UpdateAnnouncementDto>;
    }>({});

    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Handle create form input changes
    const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCreateFormData(prev => ({
            ...prev,
            [name]: name === 'startDate' || name === 'endDate' ? new Date(value) : value
        }));

        if (errors.create?.[name as keyof CreateAnnouncementDto]) {
            setErrors(prev => ({ ...prev, create: { ...prev.create, [name]: undefined } }));
        }
    };

    // Handle update form input changes
    const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        let newValue: any = value;
        if (name === 'startDate' || name === 'endDate') {
            newValue = new Date(value);
        } else if (name === 'isActive' && type === 'checkbox') {
            newValue = (e.target as HTMLInputElement).checked;
        }

        setUpdateFormData(prev => ({ ...prev, [name]: newValue }));

        if (errors.update?.[name as keyof UpdateAnnouncementDto]) {
            setErrors(prev => ({ ...prev, update: { ...prev.update, [name]: undefined } }));
        }
    };

    // Validate create form
    const validateCreateForm = (): boolean => {
        const newErrors: Partial<CreateAnnouncementDto> = {};

        if (!createFormData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (createFormData.title.length > 200) {
            newErrors.title = 'Title must be 200 characters or less';
        }

        if (!createFormData.content.trim()) {
            newErrors.content = 'Content is required';
        } else if (createFormData.content.length > 2000) {
            newErrors.content = 'Content must be 2000 characters or less';
        }

        if (!createFormData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!createFormData.endDate) {
            newErrors.endDate = 'End date is required';
        } else if (createFormData.endDate < createFormData.startDate) {
            newErrors.endDate = 'End date must be after start date';
        }

        setErrors(prev => ({ ...prev, create: newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    // Validate update form
    const validateUpdateForm = (): boolean => {
        const newErrors: Partial<UpdateAnnouncementDto> = {};

        if (updateFormData.title && updateFormData.title.length > 200) {
            newErrors.title = 'Title must be 200 characters or less';
        }

        if (updateFormData.content && updateFormData.content.length > 2000) {
            newErrors.content = 'Content must be 2000 characters or less';
        }

        if (updateFormData.endDate && updateFormData.startDate && updateFormData.endDate < updateFormData.startDate) {
            newErrors.endDate = 'End date must be after start date';
        }

        setErrors(prev => ({ ...prev, update: newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    // Handle create form submission
    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateCreateForm()) {
            // Log create form data to console
            console.log('Creating announcement with data:', {
                ...createFormData,
                startDate: createFormData.startDate.toISOString(),
                endDate: createFormData.endDate.toISOString()
            });

            const newAnnouncement: AnnouncementDto = {
                id: crypto.randomUUID(),
                title: createFormData.title,
                content: createFormData.content,
                startDate: createFormData.startDate,
                endDate: createFormData.endDate,
                type: createFormData.type,
                isActive: new Date() >= createFormData.startDate && new Date() <= createFormData.endDate,
                createdAt: new Date(),
                lastUpdated: undefined
            };

            setAnnouncements(prev => [...prev, newAnnouncement]);
            setCreateFormData({
                title: '',
                content: '',
                startDate: new Date(),
                endDate: new Date(Date.now() + 86400000),
                type: AnnouncementType.Information
            });
            setIsCreating(false);
        }
    };

    // Handle update form submission
    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateUpdateForm() && isEditing) {
            // Log update form data to console
            console.log('Updating announcement ID:', isEditing, 'with data:', {
                ...updateFormData,
                startDate: updateFormData.startDate?.toISOString(),
                endDate: updateFormData.endDate?.toISOString()
            });

            setAnnouncements(prev => prev.map(announcement => {
                if (announcement.id === isEditing) {
                    const updatedData = {
                        title: updateFormData.title !== undefined ? updateFormData.title : announcement.title,
                        content: updateFormData.content !== undefined ? updateFormData.content : announcement.content,
                        startDate: updateFormData.startDate || announcement.startDate,
                        endDate: updateFormData.endDate || announcement.endDate,
                        type: updateFormData.type || announcement.type,
                        isActive: updateFormData.isActive !== undefined ? updateFormData.isActive : announcement.isActive,
                        lastUpdated: new Date()
                    };

                    // Recalculate isActive if dates changed
                    const isActive = updateFormData.isActive !== undefined ?
                        updateFormData.isActive :
                        (new Date() >= updatedData.startDate && new Date() <= updatedData.endDate);

                    return {
                        ...announcement,
                        ...updatedData,
                        isActive
                    };
                }
                return announcement;
            }));

            setUpdateFormData({
                title: '',
                content: '',
                startDate: undefined,
                endDate: undefined,
                type: undefined,
                isActive: undefined
            });
            setIsEditing(null);
        }
    };

    // Delete an announcement
    const handleDelete = (id: string) => {
        // Log delete action to console
        console.log('Deleting announcement with ID:', id);
        setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
    };

    // Start editing an announcement
    const startEditing = (announcement: AnnouncementDto) => {
        setUpdateFormData({
            title: announcement.title,
            content: announcement.content,
            startDate: announcement.startDate,
            endDate: announcement.endDate,
            type: announcement.type,
            isActive: announcement.isActive
        });
        setIsEditing(announcement.id);
    };

    // Format date for display
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format date for date inputs
    const formatDateForInput = (date: Date) => {
        return new Date(date).toISOString().slice(0, 16);
    };

    // Get type icon and color
    const getTypeDetails = (type: AnnouncementType) => {
        switch (type) {
            case AnnouncementType.Information:
                return { icon: <Info className="h-4 w-4" />, color: 'bg-blue-100 text-blue-800' };
            case AnnouncementType.Warning:
                return { icon: <AlertTriangle className="h-4 w-4" />, color: 'bg-yellow-100 text-yellow-800' };
            case AnnouncementType.Critical:
                return { icon: <Megaphone className="h-4 w-4" />, color: 'bg-red-100 text-red-800' };
            default:
                return { icon: null, color: '' };
        }
    };

    // Get status badge
    const getStatusBadge = (isActive: boolean) => {
        return isActive ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <Check className="h-4 w-4" />
                <span className="ml-1">Active</span>
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                <X className="h-4 w-4" />
                <span className="ml-1">Inactive</span>
            </span>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Announcement Management</h1>



            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        className="px-4 py-2 border rounded-lg w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto justify-center"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Announcement</span>
                </button>
            </div>

            {/* Create Announcement Form */}
            {isCreating && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Create New Announcement</h2>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="create-title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="create-title"
                                name="title"
                                value={createFormData.title}
                                onChange={handleCreateInputChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.create?.title ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Announcement title"
                            />
                            {errors.create?.title && <p className="mt-1 text-sm text-red-500">{errors.create.title}</p>}
                        </div>

                        <div>
                            <label htmlFor="create-content" className="block text-sm font-medium text-gray-700 mb-1">
                                Content <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="create-content"
                                name="content"
                                rows={4}
                                value={createFormData.content}
                                onChange={handleCreateInputChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.create?.content ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Announcement content"
                            />
                            {errors.create?.content && <p className="mt-1 text-sm text-red-500">{errors.create.content}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="create-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    id="create-start-date"
                                    name="startDate"
                                    value={formatDateForInput(createFormData.startDate)}
                                    onChange={handleCreateInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.create?.startDate ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.create?.startDate && <p className="mt-1 text-sm text-red-500">{errors.create.startDate}</p>}
                            </div>

                            <div>
                                <label htmlFor="create-end-date" className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    id="create-end-date"
                                    name="endDate"
                                    value={formatDateForInput(createFormData.endDate)}
                                    onChange={handleCreateInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.create?.endDate ? 'border-red-500' : 'border-gray-300'}`}
                                />
                                {errors.create?.endDate && <p className="mt-1 text-sm text-red-500">{errors.create.endDate}</p>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="create-type" className="block text-sm font-medium text-gray-700 mb-1">
                                Type <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="create-type"
                                name="type"
                                value={createFormData.type}
                                onChange={handleCreateInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value={AnnouncementType.Information}>Information</option>
                                <option value={AnnouncementType.Warning}>Warning</option>
                                <option value={AnnouncementType.Critical}>Critical</option>
                            </select>
                        </div>



                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Create Announcement
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Update Announcement Form (Modal) */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit Announcement</h2>
                            <button
                                onClick={() => setIsEditing(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="update-title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="update-title"
                                    name="title"
                                    value={updateFormData.title || ''}
                                    onChange={handleUpdateInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.update?.title ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Announcement title"
                                />
                                {errors.update?.title && <p className="mt-1 text-sm text-red-500">{errors.update.title}</p>}
                            </div>

                            <div>
                                <label htmlFor="update-content" className="block text-sm font-medium text-gray-700 mb-1">
                                    Content
                                </label>
                                <textarea
                                    id="update-content"
                                    name="content"
                                    rows={4}
                                    value={updateFormData.content || ''}
                                    onChange={handleUpdateInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.update?.content ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Announcement content"
                                />
                                {errors.update?.content && <p className="mt-1 text-sm text-red-500">{errors.update.content}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="update-start-date" className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="update-start-date"
                                        name="startDate"
                                        value={updateFormData.startDate ? formatDateForInput(updateFormData.startDate) : ''}
                                        onChange={handleUpdateInputChange}
                                        className={`w-full px-3 py-2 border rounded-md ${errors.update?.startDate ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.update?.startDate && <p className="mt-1 text-sm text-red-500">{errors.update.startDate}</p>}
                                </div>

                                <div>
                                    <label htmlFor="update-end-date" className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        id="update-end-date"
                                        name="endDate"
                                        value={updateFormData.endDate ? formatDateForInput(updateFormData.endDate) : ''}
                                        onChange={handleUpdateInputChange}
                                        className={`w-full px-3 py-2 border rounded-md ${errors.update?.endDate ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                    {errors.update?.endDate && <p className="mt-1 text-sm text-red-500">{errors.update.endDate}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="update-type" className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        id="update-type"
                                        name="type"
                                        value={updateFormData.type || ''}
                                        onChange={handleUpdateInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    >
                                        <option value={AnnouncementType.Information}>Information</option>
                                        <option value={AnnouncementType.Warning}>Warning</option>
                                        <option value={AnnouncementType.Critical}>Critical</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="update-is-active"
                                        name="isActive"
                                        checked={updateFormData.isActive || false}
                                        onChange={handleUpdateInputChange}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="update-is-active" className="ml-2 block text-sm text-gray-700">
                                        Active
                                    </label>
                                </div>
                            </div>



                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Update Announcement
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Announcements List */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                {announcements.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No announcements found. Create one to get started!
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {announcements
                            .filter(announcement =>
                                announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                announcement.content.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(announcement => (
                                <div key={announcement.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeDetails(announcement.type).color}`}>
                                                    {getTypeDetails(announcement.type).icon}
                                                    <span className="ml-1">{announcement.type}</span>
                                                </span>
                                                {getStatusBadge(announcement.isActive)}
                                            </div>
                                            <h3 className="text-lg font-semibold">{announcement.title}</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEditing(announcement)}
                                                className="text-gray-500 hover:text-blue-600"
                                                title="Edit"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(announcement.id)}
                                                className="text-gray-500 hover:text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="mt-2 text-gray-600">{announcement.content}</p>

                                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>Starts: {formatDate(announcement.startDate)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            <span>Ends: {formatDate(announcement.endDate)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span>Created: {formatDate(announcement.createdAt)}</span>
                                        </div>
                                        {announcement.lastUpdated && (
                                            <div className="flex items-center">
                                                <span>Updated: {formatDate(announcement.lastUpdated)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementManagement;