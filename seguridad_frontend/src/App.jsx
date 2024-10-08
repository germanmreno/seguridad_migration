import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import PrivateRoute from './routes/PrivateRoute';
import { EntriesPage } from './EntriesPage';
import { useState, useEffect, useCallback } from 'react';
import { NavBar } from './layout/NavBar';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log('Token in localStorage:', token);
    console.log('User in localStorage:', storedUser);
    setIsAuthenticated(!!token);
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  console.log('isAuthenticated:', isAuthenticated);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate replace to="/dashboard" /> : <LoginPage setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
        } />
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />}>
          <Route path="/dashboard" element={
            <>
              <NavBar handleLogout={handleLogout} user={user} />
              <EntriesPage user={user} />
            </>
          } />
        </Route>
        <Route path="*" element={<Navigate replace to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;


