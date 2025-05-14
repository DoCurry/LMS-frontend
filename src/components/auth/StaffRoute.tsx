import { Navigate, useLocation } from 'react-router-dom';

interface StaffRouteProps {
  element: React.ReactNode;
}

export function StaffRoute({ element }: StaffRouteProps) {
  const location = useLocation();
  const authToken = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const isStaff = localStorage.getItem('isStaff') === 'true';

  if (!authToken) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Allow both admin and staff access
  if (!isAdmin && !isStaff) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
}
