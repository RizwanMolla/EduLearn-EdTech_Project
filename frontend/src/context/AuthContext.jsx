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

  // Mock login function
  const login = async (email, password) => {
    // In a real app, this would make an API request
    // For now, we'll just simulate authentication
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation for demo purposes
        if (email && password.length >= 6) {
          const userData = {
            id: 1,
            name: email.split('@')[0], // Extract username from email
            email,
            // Add other user data as needed
          };
          
          // Save to localStorage for persistence
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Update state
          setUser(userData);
          setIsAuthenticated(true);
          
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000); // Simulate network delay
    });
  };

  // Mock signup function
  const signup = async (email, password, fullName) => {
    // In a real app, this would make an API request
    // For now, we'll just simulate registration
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple validation for demo purposes
        if (email && password.length >= 6) {
          const userData = {
            id: Date.now(), // Generate random ID
            name: fullName || email.split('@')[0],
            email,
            // Add other user data as needed
          };
          
          // Save to localStorage for persistence
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Update state
          setUser(userData);
          setIsAuthenticated(true);
          
          resolve(userData);
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, 1000); // Simulate network delay
    });
  };

  // Logout function
  const logout = () => {
    // Remove from localStorage
    localStorage.removeItem('user');
    
    // Update state
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
    logout
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};