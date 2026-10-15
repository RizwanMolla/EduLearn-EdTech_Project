import { createContext } from 'react';

// Context objects live apart from their providers so provider files only export components
export const AuthContext = createContext(null);
export const LearningContext = createContext(null);
export const ThemeContext = createContext(null);
export const ToastContext = createContext(null);
