import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('admin_authenticated') === 'true';
  });

  const [adminId, setAdminId] = useState(() => {
    return localStorage.getItem('admin_id') || 'ADMIN-HOROLOGUE';
  });

  const login = (id, password) => {
    // Simple state-based auth
    if (id && password) {
      setIsAuthenticated(true);
      setAdminId(id);
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_id', id);
      return { success: true };
    }
    return { success: false, error: 'Please enter valid Admin ID and password.' };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_id');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, adminId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
