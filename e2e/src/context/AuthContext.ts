import { createContext, useEffect, useState, type ReactNode } from 'react';
import { TOKEN_KEY } from '../services/api';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import type { User } from '../types/user';
import type { LoginPayload, RegisterPayload } from '../types/errorManagers';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    userService
      .getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  async function login(payload: LoginPayload): Promise<User> {
    const token = await authService.login(payload);
    localStorage.setItem(TOKEN_KEY, token);
    const me = await userService.getMe();
    setUser(me);
    return me;
  }

  async function register(payload: RegisterPayload): Promise<User> {
    const token = await authService.register(payload);
    localStorage.setItem(TOKEN_KEY, token);
    const me = await userService.getMe();
    setUser(me);
    return me;
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    window.location.href = '/login';
  }

  async function refreshUser(): Promise<User | null> {
    try {
      const me = await userService.getMe();
      setUser(me);
      return me;
    } catch {
      return null;
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}