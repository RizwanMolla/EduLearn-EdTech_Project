import { createContext, useState, useEffect } from 'react';

// Create the auth context
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage in this mock version)
  useEffect(() => {
    const checkLoggedIn = () => {
      const userData = localStorage.getItem('user');
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
      
      setLoading(false);
    };
    
    checkLoggedIn();
  }, []);

  // Real login function
  const login = async (email, password) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      // Save token and user
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return data.user;
    } catch (err) {
      throw err;
    }
  };

  // Real signup function
  const signup = async (email, password, fullName) => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Signup failed');
      // After signup, auto-login
      return await login(email, password);
    } catch (err) {
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Context value
  const authContextValue = {
    isAuthenticated,
    user,
    loading,
    login,
    signup,
    logout,
    setUser // Expose setUser for profile updates
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};