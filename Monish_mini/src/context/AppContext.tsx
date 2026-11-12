import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { User } from '../types';

// ─── State ────────────────────────────────────────────────────────────────────

interface AppState {
  user: User | null;
  themeMode: 'dark' | 'light';
  sidebarOpen: boolean;
  isAuthenticated: boolean;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean };

const getInitialState = (): AppState => {
  const savedUser = localStorage.getItem('aqg_user');
  const savedTheme = localStorage.getItem('aqg_theme') as 'dark' | 'light';

  let user: User | null = null;
  if (savedUser) {
    try {
      user = JSON.parse(savedUser);
    } catch {}
  } else {
    // Default logged in demo user for immediate seamless exploration
    user = {
      id: 'user-default',
      name: 'Alex Rivera',
      email: 'alex.rivera@edu.ai',
      avatar: 'A',
      role: 'Senior Learner',
      streakDays: 8,
      joinedAt: new Date().toISOString(),
    };
  }

  return {
    user,
    themeMode: savedTheme || 'dark',
    sidebarOpen: true,
    isAuthenticated: Boolean(user),
  };
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('aqg_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      localStorage.removeItem('aqg_user');
      return { ...state, user: null, isAuthenticated: false };
    case 'TOGGLE_THEME': {
      const nextTheme = state.themeMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('aqg_theme', nextTheme);
      return { ...state, themeMode: nextTheme };
    }
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarOpen: !state.sidebarOpen };
    case 'SET_SIDEBAR':
      return { ...state, sidebarOpen: action.payload };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue extends AppState {
  login: (email: string, name: string) => void;
  logout: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const createUser = (email: string, name: string): User => ({
  id: `user-${Date.now()}`,
  name,
  email,
  avatar: name.charAt(0).toUpperCase(),
  role: 'Senior Learner',
  streakDays: 8,
  joinedAt: new Date().toISOString(),
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  const login = useCallback((email: string, name: string) => {
    dispatch({ type: 'LOGIN', payload: createUser(email, name) });
  }, []);

  const logout = useCallback(() => dispatch({ type: 'LOGOUT' }), []);
  const toggleTheme = useCallback(() => dispatch({ type: 'TOGGLE_THEME' }), []);
  const toggleSidebar = useCallback(() => dispatch({ type: 'TOGGLE_SIDEBAR' }), []);
  const setSidebar = useCallback((open: boolean) => dispatch({ type: 'SET_SIDEBAR', payload: open }), []);

  return (
    <AppContext.Provider value={{ ...state, login, logout, toggleTheme, toggleSidebar, setSidebar }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
