import { useState } from 'react';
import { Plus, Trash2, X, Book, Calendar, Mail } from 'lucide-react';

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

const AuthorManagement = () => {
    // Sample data
    const [authors, setAuthors] = useState<AuthorDto[]>([
        {
            id: '1',
            name: 'J.K. Rowling',
            email: 'jkrowling@example.com',
            bookCount: 12,
            createdAt: new Date('1997-06-26'),
            lastUpdated: new Date('2020-11-12')
        },
        {
            id: '2',
            name: 'George R.R. Martin',
            email: 'grrm@example.com',
            bookCount: 8,
            createdAt: new Date('1996-08-01'),
            lastUpdated: new Date('2018-07-22')
        },
        {
            id: '3',
            name: 'Stephen King',
            bookCount: 65,
            createdAt: new Date('1974-01-01'),
            lastUpdated: new Date('2023-05-15')
        }
    ]);

    // Form state
    const [formData, setFormData] = useState<CreateAuthorDto>({
        name: '',
        email: ''
    });

    const [errors, setErrors] = useState<Partial<CreateAuthorDto>>({});
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors: Partial<CreateAuthorDto> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Author name is required';
        } else if (formData.name.length > 100) {
            newErrors.name = 'Author name must be 100 characters or less';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            // Print form data to console before processing
            console.log('Form submitted with data:', formData);

            const newAuthor: AuthorDto = {
                id: crypto.randomUUID(),
                name: formData.name,
                email: formData.email || undefined,
                bookCount: 0,
                createdAt: new Date(),
                lastUpdated: undefined
            };

            setAuthors(prev => [...prev, newAuthor]);
            setFormData({ name: '', email: '' });
            setIsCreating(false);
        }
    };

    // Handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user types
        if (errors[name as keyof CreateAuthorDto]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Delete an author
    const handleDelete = (id: string) => {
        setAuthors(prev => prev.filter(author => author.id !== id));
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
                            {authors.map((author) => (
                                <tr key={author.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{author.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {author.email || '-'}
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
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleDelete(author.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
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

export default AuthorManagement;