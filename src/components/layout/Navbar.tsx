import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, BookMarked, ClipboardList } from "lucide-react";

export function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gray-800/90 backdrop-blur supports-[backdrop-filter]:bg-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Left side - Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">LMS</span>
        </Link>

        {/* Middle - Navigation Links */}
        <div className="hidden md:flex gap-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-gray-200 transition-colors hover:text-white"
          >
            Home
          </Link>
          <Link 
            to="/books" 
            className="text-sm font-medium text-gray-200 transition-colors hover:text-white"
          >
            Books
          </Link>
        </div>

        {/* Right side - Cart and User Menu */}
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/cart')}
            className="h-9 w-9 text-gray-200 hover:text-white hover:bg-gray-700/50"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 text-gray-200 hover:text-white hover:bg-gray-700/50"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-gray-800/95 border-gray-700">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/profile')} className="text-gray-200 focus:text-white focus:bg-gray-700/50">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/bookmarks')} className="text-gray-200 focus:text-white focus:bg-gray-700/50">
                        <BookMarked className="mr-2 h-4 w-4" />
                        Bookmarks
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/orders')} className="text-gray-200 focus:text-white focus:bg-gray-700/50">
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Order History
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="text-gray-200 focus:text-white focus:bg-gray-700/50">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/login')} className="text-gray-200 focus:text-white focus:bg-gray-700/50">
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/sign-up')} className="text-gray-200 focus:text-white focus:bg-gray-700/50">
                        Sign Up
                      </DropdownMenuItem>
                    </>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
