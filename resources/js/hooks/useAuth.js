// hooks/useAuth.js
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      // Try getting user data from localStorage first
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
          return; // Skip API call if we have data in localStorage
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          // Fall back to API call if localStorage parsing fails
        }
      }
      
      // Fall back to API call
      try {
        // First try the user-session endpoint
        const sessionResponse = await fetch('/api/user-session');
        
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          
          // If we have a user ID, try to get complete user details
          if (sessionData && sessionData.id) {
            try {
              const userResponse = await fetch(`/api/users/${sessionData.id}`);
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                setUser(userData);
                setIsAuthenticated(true);
                localStorage.setItem('user', JSON.stringify(userData));
                setLoading(false);
                return;
              }
            } catch (error) {
              console.error('Error fetching detailed user data:', error);
              // Fall back to session data if detailed fetch fails
              setUser(sessionData);
              setIsAuthenticated(true);
              localStorage.setItem('user', JSON.stringify(sessionData));
            }
          } else {
            // Use session data if it doesn't contain a user ID
            setUser(sessionData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(sessionData));
          }
        } else {
          // Try alternative current user endpoint if first one fails
          const currentUserResponse = await fetch('/user/current');
          
          if (currentUserResponse.ok) {
            const userData = await currentUserResponse.json();
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };
    
    fetchUserData();
  }, []);
  
  const logout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('user');
    
    // Reset authentication state
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return { user, isAuthenticated, loading, logout };
};