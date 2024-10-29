import { Navigate, Outlet } from 'react-router-dom';
import { useEffect } from 'react';

const PrivateRoute = ({ isAuthenticated, setIsAuthenticated }) => {
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      console.log('Token in PrivateRoute:', token); // Add this line
      if (token) {
        try {
          // Replace this with your actual API call to verify the token
          const response = await fetch('http://localhost:3001/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });

          console.log('Token verification response:', response.status); // Add this line

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          setIsAuthenticated(false);
          localStorage.removeItem('token');
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
  }, [setIsAuthenticated]);

  console.log('PrivateRoute isAuthenticated:', isAuthenticated); // Add this line

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;