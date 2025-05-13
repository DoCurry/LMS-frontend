import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface PublicOnlyRouteProps {
  element: React.ReactElement;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show nothing while checking authentication status
  if (isLoading) {
    return null;
  }
  // If user is authenticated, redirect to home page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the public element
  return element;
};
