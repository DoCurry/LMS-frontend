import { ShoppingCart } from 'lucide-react';

function HeaderComponent() {
    return (
        <>


            <header className="bg-blue-600 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-xl font-bold">BookHub</h1>
                            </div>
                            <div className="ml-6 hidden md:flex space-x-4">
                                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">Home</a>
                                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">Bestsellers</a>
                                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">New Releases</a>
                                <a href="#" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500">Deals</a>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="text-white hover:text-gray-200">
                                Sign In / Register
                            </button>
                            <button className="flex items-center">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="ml-1">Cart (0)</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>


        </>
    )
}

export default HeaderComponent
