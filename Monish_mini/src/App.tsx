import React from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import AppLayout from './components/layout/AppLayout';
import { AppProvider, useApp } from './context/AppContext';
import { QuestionProvider } from './context/QuestionContext';
import DashboardPage from './pages/DashboardPage';
import GeneratePage from './pages/GeneratePage';
import AdaptiveQuizPage from './pages/AdaptiveQuizPage';
import HistoryPage from './pages/HistoryPage';
import SavedPage from './pages/SavedPage';
import LoginPage from './pages/LoginPage';
import getTheme from './theme';

const ProtectedLayout: React.FC = () => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />;
};

const LoginRoute: React.FC = () => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />;
};

const AppRoutes: React.FC = () => {
  const { themeMode } = useApp();

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route element={<ProtectedLayout />}>
            <Route element={<Outlet />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/generate" element={<GeneratePage />} />
              <Route path="/quiz" element={<AdaptiveQuizPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/saved" element={<SavedPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <AppProvider>
    <QuestionProvider>
      <AppRoutes />
    </QuestionProvider>
  </AppProvider>
);

export default App;
