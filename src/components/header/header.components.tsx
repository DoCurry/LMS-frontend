import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function HeaderComponent() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    return (
        <header className="bg-blue-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <h1 className="text-xl font-bold">BookHub</h1>
                        </div>
                        {/* Desktop Nav */}
                        <div className="ml-6 hidden md:flex space-x-4">
                            <NavLink to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">Home</NavLink>
                            <NavLink to="/books" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">Books</NavLink>
                            <NavLink to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">New Releases</NavLink>
                            <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">Deals</a>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 relative">
                        <button className="text-white hover:text-gray-200 hidden md:block">
                            Sign In / Register
                        </button>

                        {/* Cart Button */}
                        <button className="flex items-center">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="ml-1">Cart (0)</span>
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="flex items-center focus:outline-none"
                            >
                                <User className="h-6 w-6" />
                            </button>
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg z-20">
                                    <NavLink to="/bookmarks" className="block px-4 py-2 text-sm hover:bg-gray-100">Bookmarks</NavLink>
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">Settings</a>
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100">Logout</a>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden focus:outline-none"
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-2">
                    <a href="#" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">Home</a>
                    <a href="#" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">Bestsellers</a>
                    <a href="#" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">New Releases</a>
                    <a href="#" className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">Deals</a>
                    <button className="w-full text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">
                        Sign In / Register
                    </button>
                </div>
            )}
        </header>
    );
}

export default HeaderComponent;
