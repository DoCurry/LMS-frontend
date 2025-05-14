import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, BookMarked, ClipboardList, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { announcementAPI } from "@/api/api";
import { AnnouncementDto } from "@/models/announcement.model";

export function Navbar() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<AnnouncementDto[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await announcementAPI.getAll();
        const latestAnnouncements = response.data.data.slice(0, 5);
        setAnnouncements(latestAnnouncements);
        
        // Set unread count based on last 24 hours
        const lastDay = new Date(Date.now() - 24 * 60 * 60 * 1000);
        setUnreadCount(
          latestAnnouncements.filter(
            (announcement: AnnouncementDto) => new Date(announcement.createdAt) > lastDay
          ).length
        );
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isStaff');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-700/50 bg-gradient-to-b from-gray-800/95 to-gray-900/95 backdrop-blur-md supports-[backdrop-filter]:from-gray-800/80 supports-[backdrop-filter]:to-gray-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Left side - Brand */}
        <Link to="/" className="flex items-center gap-2 group py-2">
          <span className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-all duration-200 ease-out transform group-hover:scale-105">LMS</span>
        </Link>

        {/* Middle - Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link 
            to="/" 
            className="text-sm font-medium text-gray-200 transition-all hover:text-white relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-0.5 after:bg-blue-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out after:origin-left"
          >
            Home
          </Link>
          <Link 
            to="/books" 
            className="text-sm font-medium text-gray-200 transition-all hover:text-white relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-0.5 after:bg-blue-400 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-out after:origin-left"
          >
            Books
          </Link>
        </div>

        {/* Right side - Cart, Announcements and User Menu */}
        <div className="flex items-center gap-3">
          {/* Announcements Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 text-gray-200 hover:text-white hover:bg-gray-700/40 active:bg-gray-700/60 relative transition-all duration-200 hover:scale-105"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-blue-500 text-[10px] font-medium text-white flex items-center justify-center ring-2 ring-gray-800 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 bg-gray-800/95 border-gray-700/50 shadow-2xl backdrop-blur-sm rounded-lg">
              <div className="max-h-[400px] overflow-auto p-4 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-700">
                <h3 className="font-medium mb-4 text-gray-100">Latest Updates</h3>
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div
                        key={announcement.id}
                        className="group border-b border-gray-700/30 last:border-0 pb-3 last:pb-0 hover:bg-gray-700/20 transition-all duration-200 px-2 -mx-2 rounded-md"
                      >
                        <h4 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">{announcement.title}</h4>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 line-clamp-2 transition-colors">{announcement.content}</p>
                        <time className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No announcements</p>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart Button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/cart')}
            className="h-9 w-9 text-gray-200 hover:text-white hover:bg-gray-700/40 active:bg-gray-700/60 transition-all duration-200 hover:scale-105"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {/* User Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-9 w-9 text-gray-200 hover:text-white hover:bg-gray-700/40 active:bg-gray-700/60 transition-all duration-200 hover:scale-105"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 bg-gray-800/95 border-gray-700/50 shadow-2xl backdrop-blur-sm rounded-lg">
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/profile')} className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700/40 focus:bg-gray-700/40 transition-all duration-200 rounded-md gap-3">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/bookmarks')} className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700/40 focus:bg-gray-700/40 transition-all duration-200 rounded-md gap-3">
                        <BookMarked className="h-4 w-4" />
                        <span className="font-medium">Bookmarks</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/orders')} className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700/40 focus:bg-gray-700/40 transition-all duration-200 rounded-md gap-3">
                        <ClipboardList className="h-4 w-4" />
                        <span className="font-medium">Order History</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700/40 focus:bg-gray-700/40 transition-all duration-200 rounded-md gap-3">
                        <LogOut className="h-4 w-4" />
                        <span className="font-medium">Logout</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/login')} className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700/40 focus:bg-gray-700/40 transition-all duration-200 rounded-md">
                        Login
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/sign-up')} className="text-gray-200 hover:text-white focus:text-white hover:bg-gray-700/40 focus:bg-gray-700/40 transition-all duration-200 rounded-md">
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
