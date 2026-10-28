import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/auth.js';
import { setAccessToken } from '../api/http.js';

export const DEMO_USERS = {
  hr: {
    email: 'hr@staffsync.test',
    password: 'Passw0rd!23',
    role: 'hr',
    label: 'HR Admin',
    desc: 'Full administrative access across all workforce data',
  },
  manager: {
    email: 'manager@staffsync.test',
    password: 'Passw0rd!23',
    role: 'manager',
    label: 'People Manager',
    desc: 'Team attendance, leave approvals, and skill development',
  },
  employee: {
    email: 'employee1@staffsync.test',
    password: 'Passw0rd!23',
    role: 'employee',
    label: 'Employee',
    desc: 'Attendance clock, leave requests, and training programs',
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Perform login with given credentials
  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password });
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  // Quick switch role without typing credentials
  const quickSwitch = useCallback(async (roleKey) => {
    const target = DEMO_USERS[roleKey] || DEMO_USERS.hr;
    try {
      const loggedUser = await login(target.email, target.password);
      return loggedUser;
    } catch (err) {
      console.warn('Quick switch error:', err);
      return null;
    }
  }, [login]);

  // On mount: try existing session; if none, auto-login as HR Admin for zero-friction access
  useEffect(() => {
    (async () => {
      try {
        const { data: refreshData } = await authApi.refresh();
        setAccessToken(refreshData.data.accessToken);
        const { data: meData } = await authApi.me();
        setUser(meData.data);
      } catch {
        // Auto-authenticate as default HR admin so every page loads immediately
        try {
          const autoUser = await login(DEMO_USERS.hr.email, DEMO_USERS.hr.password);
          setUser(autoUser);
        } catch (autoErr) {
          console.warn('Auto-login fallback failed:', autoErr.message);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setAccessToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, quickSwitch, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
