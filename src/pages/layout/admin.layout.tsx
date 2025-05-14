import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="h-16 flex items-center gap-2 px-6 border-b border-gray-700">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-lg font-bold text-white">L</span>
            </div>
            <span className="text-lg font-semibold text-white">LMS Admin</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-4 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 transition-colors px-3 py-2 rounded-md mb-1"
              onClick={() => navigate("/admin")}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 transition-colors px-3 py-2 rounded-md mb-1"
              onClick={() => navigate("/admin/books")}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Books Management
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 transition-colors px-3 py-2 rounded-md mb-1"
              onClick={() => navigate("/admin/author")}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Authors Management
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 transition-colors px-3 py-2 rounded-md mb-1"
              onClick={() => navigate("/admin/publisher")}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Publishers Management
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start bg-transparent text-gray-300 hover:text-white hover:bg-gray-800 transition-colors px-3 py-2 rounded-md mb-1"
              onClick={() => navigate("/admin/announcement")}
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              Announcements
            </Button>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <Button
              variant="destructive"
              className="w-full bg-red-600 hover:bg-red-700 text-white gap-2"
              onClick={handleLogout}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white">
        <div className="container mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
