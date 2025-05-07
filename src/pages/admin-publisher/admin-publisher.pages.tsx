import { useState } from 'react';
import { Plus, Trash2, X, Book, Calendar, Mail, Edit } from 'lucide-react';

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

const PublisherManagement = () => {
    // Sample data
    const [publishers, setPublishers] = useState<PublisherDto[]>([
        {
            id: '1',
            name: 'Penguin Random House',
            email: 'contact@penguinrandomhouse.com',
            bookCount: 15000,
            createdAt: new Date('1935-01-01'),
            lastUpdated: new Date('2023-01-15')
        },
        {
            id: '2',
            name: 'HarperCollins',
            email: 'info@harpercollins.com',
            bookCount: 12000,
            createdAt: new Date('1817-01-01'),
            lastUpdated: new Date('2023-03-22')
        },
        {
            id: '3',
            name: 'Simon & Schuster',
            bookCount: 8500,
            createdAt: new Date('1924-01-01'),
            lastUpdated: new Date('2023-02-10')
        }
    ]);

    // Form states
    const [createFormData, setCreateFormData] = useState<CreatePublisherDto>({
        name: '',
        email: ''
    });

    const [updateFormData, setUpdateFormData] = useState<UpdatePublisherDto>({
        name: '',
        email: ''
    });

    const [errors, setErrors] = useState<{
        create?: Partial<CreatePublisherDto>;
        update?: Partial<UpdatePublisherDto>;
    }>({});

    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Handle create form input changes
    const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCreateFormData(prev => ({ ...prev, [name]: value }));

        if (errors.create?.[name as keyof CreatePublisherDto]) {
            setErrors(prev => ({ ...prev, create: { ...prev.create, [name]: undefined } }));
        }
    };

    // Handle update form input changes
    const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateFormData(prev => ({ ...prev, [name]: value }));

        if (errors.update?.[name as keyof UpdatePublisherDto]) {
            setErrors(prev => ({ ...prev, update: { ...prev.update, [name]: undefined } }));
        }
    };

    // Validate create form
    const validateCreateForm = (): boolean => {
        const newErrors: Partial<CreatePublisherDto> = {};

        if (!createFormData.name.trim()) {
            newErrors.name = 'Publisher name is required';
        } else if (createFormData.name.length > 100) {
            newErrors.name = 'Publisher name must be 100 characters or less';
        }

        if (createFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createFormData.email)) {
            newErrors.email = 'Invalid email address';
        }

        setErrors(prev => ({ ...prev, create: newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    // Validate update form
    const validateUpdateForm = (): boolean => {
        const newErrors: Partial<UpdatePublisherDto> = {};

        if (updateFormData.name && updateFormData.name.length > 100) {
            newErrors.name = 'Publisher name must be 100 characters or less';
        }

        if (updateFormData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateFormData.email)) {
            newErrors.email = 'Invalid email address';
        }

        setErrors(prev => ({ ...prev, update: newErrors }));
        return Object.keys(newErrors).length === 0;
    };

    // Handle create form submission
    const handleCreateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateCreateForm()) {
            const newPublisher: PublisherDto = {
                id: crypto.randomUUID(),
                name: createFormData.name,
                email: createFormData.email || undefined,
                bookCount: 0,
                createdAt: new Date(),
                lastUpdated: undefined
            };

            setPublishers(prev => [...prev, newPublisher]);
            setCreateFormData({ name: '', email: '' });
            setIsCreating(false);
        }
    };

    // Handle update form submission
    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateUpdateForm() && isEditing) {
            setPublishers(prev => prev.map(publisher => {
                if (publisher.id === isEditing) {
                    return {
                        ...publisher,
                        name: updateFormData.name || publisher.name,
                        email: updateFormData.email !== undefined ? updateFormData.email : publisher.email,
                        lastUpdated: new Date()
                    };
                }
                return publisher;
            }));

            setUpdateFormData({ name: '', email: '' });
            setIsEditing(null);
        }
    };

    // Delete a publisher
    const handleDelete = (id: string) => {
        setPublishers(prev => prev.filter(publisher => publisher.id !== id));
    };

    // Start editing a publisher
    const startEditing = (publisher: PublisherDto) => {
        setUpdateFormData({
            name: publisher.name,
            email: publisher.email || ''
        });
        setIsEditing(publisher.id);
    };

    // Format date for display
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Publisher Management</h1>



            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search publishers..."
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
                    <span>Add Publisher</span>
                </button>
            </div>

            {/* Create Publisher Form */}
            {isCreating && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Create New Publisher</h2>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="create-name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="create-name"
                                name="name"
                                value={createFormData.name}
                                onChange={handleCreateInputChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.create?.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Publisher name"
                            />
                            {errors.create?.name && <p className="mt-1 text-sm text-red-500">{errors.create.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="create-email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="create-email"
                                name="email"
                                value={createFormData.email || ''}
                                onChange={handleCreateInputChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.create?.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="publisher@example.com"
                            />
                            {errors.create?.email && <p className="mt-1 text-sm text-red-500">{errors.create.email}</p>}
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
                                Create Publisher
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Update Publisher Form (Modal) */}
            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit Publisher</h2>
                            <button
                                onClick={() => setIsEditing(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="update-name" className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="update-name"
                                    name="name"
                                    value={updateFormData.name || ''}
                                    onChange={handleUpdateInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.update?.name ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Publisher name"
                                />
                                {errors.update?.name && <p className="mt-1 text-sm text-red-500">{errors.update.name}</p>}
                            </div>

                            <div>
                                <label htmlFor="update-email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="update-email"
                                    name="email"
                                    value={updateFormData.email || ''}
                                    onChange={handleUpdateInputChange}
                                    className={`w-full px-3 py-2 border rounded-md ${errors.update?.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="publisher@example.com"
                                />
                                {errors.update?.email && <p className="mt-1 text-sm text-red-500">{errors.update.email}</p>}
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
                                    Update Publisher
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Publishers Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <Mail className="h-4 w-4 inline mr-1" />
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <Book className="h-4 w-4 inline mr-1" />
                                    Books
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <Calendar className="h-4 w-4 inline mr-1" />
                                    Created
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Last Updated
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {publishers.map((publisher) => (
                                <tr key={publisher.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{publisher.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {publisher.email || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {publisher.bookCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {formatDate(publisher.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {publisher.lastUpdated ? formatDate(publisher.lastUpdated) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => startEditing(publisher)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(publisher.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PublisherManagement;