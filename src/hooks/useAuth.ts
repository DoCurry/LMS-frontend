import { useEffect, useState } from 'react';
import { userAPI } from '@/api/api';
import { UserDto } from '@/models';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserDto>();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    // If no token, user is not authenticated
    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    // Verify token by checking user session
    const checkAuth = async () => {
      try {
        var user = await userAPI.getMe();
        setUser(user.data);
        setIsAuthenticated(true);
      } catch (error) {
        // If token is invalid, clear it
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    isLoading,
    user
  };
}
