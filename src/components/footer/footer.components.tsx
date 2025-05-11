
function FooterComponent() {
    return (
        <>
            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-medium mb-4">About Us</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-white">Our Story</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                                <li><a href="#" className="hover:text-white">Press</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-4">Customer Service</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white">FAQs</a></li>
                                <li><a href="#" className="hover:text-white">Shipping</a></li>
                                <li><a href="#" className="hover:text-white">Returns</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-4">My Account</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                <li><a href="#" className="hover:text-white">Sign In</a></li>
                                <li><a href="#" className="hover:text-white">Register</a></li>
                                <li><a href="#" className="hover:text-white">Order History</a></li>
                                <li><a href="#" className="hover:text-white">Wishlist</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium mb-4">Newsletter</h3>
                            <p className="text-sm text-gray-300 mb-2">Subscribe to receive updates and special offers</p>
                            <div className="flex">
                                <input
                                    type="email"
                                    placeholder="Your email"
                                    className="px-3 py-2 text-white text-sm rounded-l focus:outline-none flex-1"
                                />
                                <button className="bg-blue-600 px-4 py-2 rounded-r text-sm hover:bg-blue-700">
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
                        <p>© 2025 BookHub. All rights reserved.</p>
                    </div>
                </div>
            </footer>

        </>
    )
}

export default FooterComponent