import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

function FooterComponent() {
    return (
        <footer className="bg-gray-800/95 text-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">LMS</h3>
                        <p className="text-sm text-gray-300">
                            Your one-stop destination for books, learning materials, and academic resources.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/books" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Books
                                </Link>
                            </li>
                            <li>
                                <Link to="/sign-up" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Become a Member
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Student Discounts
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Help Center
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Return Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center text-sm text-gray-300">
                                <MapPin className="h-4 w-4 mr-2" />
                                123 Library Street, London, UK
                            </li>
                            <li className="flex items-center text-sm text-gray-300">
                                <Phone className="h-4 w-4 mr-2" />
                                +44 (0) 20 1234 5678
                            </li>
                            <li className="flex items-center text-sm text-gray-300">
                                <Mail className="h-4 w-4 mr-2" />
                                support@lms.com
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <p className="text-center text-sm text-gray-300">
                        © {new Date().getFullYear()} LMS. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default FooterComponent;