import { createContext, useContext, useState } from 'react';
import api from '../api';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('staffsync_user')); } catch { return null; }
  });
  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('staffsync_token', data.token);
    localStorage.setItem('staffsync_user', JSON.stringify(data.user));
    setUser(data.user);
  }
  function logout() {
    localStorage.removeItem('staffsync_token');
    localStorage.removeItem('staffsync_user');
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
