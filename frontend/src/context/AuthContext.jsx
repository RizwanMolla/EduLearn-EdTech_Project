import { useCallback, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './contexts';
import { api } from '../lib/api';
import { readJSON, readString, removeKey, writeJSON, writeString } from '../lib/storage';

// A local-only account so visitors can explore every feature without signing up
const DEMO_USER = {
  id: 'demo',
  name: 'Alex Morgan',
  email: 'demo@edulearn.app',
  image: '',
  headline: 'Learning frontend engineering, one project at a time',
  createdAt: '2026-03-02T09:00:00.000Z',
  demo: true,
};

const normalizeUser = (raw) =>
  raw && {
    id: raw.id || raw._id,
    name: raw.name,
    email: raw.email,
    image: raw.image || '',
    headline: raw.headline || '',
    createdAt: raw.createdAt,
    demo: Boolean(raw.demo),
  };

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(() => normalizeUser(readJSON('user', null)));

  const setUser = useCallback((updater) => {
    setUserState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next) writeJSON('user', next);
      else removeKey('user');
      return next;
    });
  }, []);

  // Refresh the profile from the API so name/avatar edits made elsewhere show up
  useEffect(() => {
    if (!user || user.demo || !readString('token')) return undefined;
    const controller = new AbortController();
    api('/api/profile', { auth: true, signal: controller.signal })
      .then((profile) => setUser((prev) => (prev ? { ...prev, ...normalizeUser(profile) } : prev)))
      .catch((err) => {
        if (err.status === 401) {
          removeKey('token');
          setUser(null);
        }
      });
    return () => controller.abort();
    // Only on first mount / account switch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const login = useCallback(async (email, password) => {
    const data = await api('/api/auth/login', { method: 'POST', body: { email, password } });
    writeString('token', data.token);
    const next = normalizeUser(data.user);
    setUser(next);
    return next;
  }, [setUser]);

  const signup = useCallback(async (email, password, fullName) => {
    await api('/api/auth/signup', { method: 'POST', body: { name: fullName, email, password } });
    return login(email, password);
  }, [login]);

  const loginDemo = useCallback(() => {
    removeKey('token');
    setUser(DEMO_USER);
    return DEMO_USER;
  }, [setUser]);

  const logout = useCallback(() => {
    removeKey('token');
    setUser(null);
  }, [setUser]);

  const updateProfile = useCallback(async ({ name, headline }) => {
    if (user?.demo) {
      setUser((prev) => ({ ...prev, name, headline }));
      return;
    }
    const profile = await api('/api/profile', { method: 'PUT', auth: true, body: { name, headline } });
    setUser((prev) => ({ ...prev, ...normalizeUser(profile) }));
  }, [user?.demo, setUser]);

  const updateAvatar = useCallback(async (dataUrl) => {
    if (user?.demo) {
      setUser((prev) => ({ ...prev, image: dataUrl }));
      return;
    }
    const profile = await api('/api/profile/image', { method: 'PUT', auth: true, body: { imageBase64: dataUrl } });
    setUser((prev) => ({ ...prev, ...normalizeUser(profile) }));
  }, [user?.demo, setUser]);

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    if (user?.demo) {
      throw new Error('The demo account password cannot be changed. Create an account to try this.');
    }
    return api('/api/profile/password', { method: 'PUT', auth: true, body: { oldPassword, newPassword } });
  }, [user?.demo]);

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isDemo: Boolean(user?.demo),
    loading: false,
    login,
    signup,
    loginDemo,
    logout,
    updateProfile,
    updateAvatar,
    changePassword,
    setUser,
  }), [user, login, signup, loginDemo, logout, updateProfile, updateAvatar, changePassword, setUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
