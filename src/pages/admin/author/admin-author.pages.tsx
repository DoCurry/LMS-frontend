import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Book, Calendar, Mail, Edit, Save } from 'lucide-react';
import { authorAPI } from '@/api/api';

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
    email?: string; // Allow null to clear email
}

const AuthorManagement = () => {
    const [authors, setAuthors] = useState<AuthorDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateAuthorDto>({
        name: '',
        email: ''
    });
    const [editData, setEditData] = useState<{ id: string, data: UpdateAuthorDto } | null>(null);
    const [errors, setErrors] = useState<Partial<CreateAuthorDto>>({});
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch authors on component mount
    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                setIsLoading(true);
                const response = await authorAPI.getAll();
                setAuthors(response.data.data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch authors');
                console.error('Error fetching authors:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    const validateForm = (data: CreateAuthorDto | UpdateAuthorDto) => {
        const newErrors: Partial<CreateAuthorDto> = {};

        if ('name' in data && !data.name?.trim()) {
            newErrors.name = 'Author name is required';
        } else if ('name' in data && data.name && data.name.length > 100) {
            newErrors.name = 'Author name must be 100 characters or less';
        }

        if ('email' in data && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            newErrors.email = 'Invalid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm(formData)) return;

        try {
            const response = await authorAPI.create(formData);
            setAuthors(prev => [...prev, response.data]);
            setFormData({ name: '', email: '' });
            setIsCreating(false);
        } catch (err) {
            setError('Failed to create author');
            console.error('Error creating author:', err);
        }
    };

    const handleEditSubmit = async (id: string) => {
        if (!editData || !validateForm(editData.data)) return;

        try {
            const response = await authorAPI.update(id, editData.data);
            setAuthors(prev => prev.map(author =>
                author.id === id ? response.data : author
            ));
            setEditData(null);
        } catch (err) {
            setError('Failed to update author');
            console.error('Error updating author:', err);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name as keyof CreateAuthorDto]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData(prev => {
            if (!prev) return null;
            return {
                ...prev,
                data: {
                    ...prev.data,
                    [name]: value === '' ? null : value
                }
            };
        });

        if (errors[name as keyof CreateAuthorDto]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const startEditing = (author: AuthorDto) => {
        setEditData({
            id: author.id,
            data: {
                name: author.name,
                email: author.email || ''
            }
        });
    };

    const cancelEditing = () => {
        setEditData(null);
    };

    const handleDelete = async (id: string) => {
        try {
            await authorAPI.delete(id);
            setAuthors(prev => prev.filter(author => author.id !== id));
        } catch (err) {
            setError('Failed to delete author');
            console.error('Error deleting author:', err);
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Filter authors based on search term
    const filteredAuthors = authors.filter(author =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (author.email && author.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return <div className="container mx-auto px-4 py-8">Loading authors...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Author Management</h1>

            {/* Search and Add Button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search authors..."
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
                    <span>Add Author</span>
                </button>
            </div>

            {/* Create Author Form */}
            {isCreating && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Create New Author</h2>
                        <button
                            onClick={() => setIsCreating(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Author name"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="author@example.com"
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
                                Create Author
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Authors Table */}
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
                            {filteredAuthors.length > 0 ? (
                                filteredAuthors.map((author) => (
                                    <tr key={author.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editData?.id === author.id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={editData.data.name || ''}
                                                    onChange={handleEditChange}
                                                    className={`w-full px-2 py-1 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                            ) : (
                                                <div className="font-medium text-gray-900">{author.name}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {editData?.id === author.id ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={editData.data.email || ''}
                                                    onChange={handleEditChange}
                                                    className={`w-full px-2 py-1 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                                />
                                            ) : (
                                                <span className="text-gray-500">{author.email || '-'}</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {author.bookCount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {formatDate(author.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {author.lastUpdated ? formatDate(author.lastUpdated) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {editData?.id === author.id ? (
                                                <>
                                                    <button
                                                        onClick={() => handleEditSubmit(author.id)}
                                                        className="text-green-600 hover:text-green-900"
                                                        title="Save"
                                                    >
                                                        <Save className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={cancelEditing}
                                                        className="text-gray-500 hover:text-gray-700"
                                                        title="Cancel"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEditing(author)}
                                                        className="text-blue-600 hover:text-blue-900"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(author.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        No authors found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuthorManagement;