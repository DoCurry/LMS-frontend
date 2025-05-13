import { Navigate, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  element: React.ReactNode;
  adminOnly?: boolean;
}

export function PrivateRoute({ element, adminOnly = false }: PrivateRouteProps) {
  const location = useLocation();
  const authToken = localStorage.getItem('authToken');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!authToken) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect non-admin users to home page
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
}
