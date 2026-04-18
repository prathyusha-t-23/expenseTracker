import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
        setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
  };

  const register = async (username, email, password) => {
    const res = await API.post('/auth/register', { username, email, password });
    setUser(res.data);
    localStorage.setItem('user', JSON.stringify(res.data));
  };

  const logout = async () => {
    try {
        await API.post('/auth/logout');
    } catch(err) {
        console.error(err);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
