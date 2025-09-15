import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import BaseLayout from '../layouts/BaseLayout';

// Pages publiques
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

// Pages admin
import Dashboard from '../pages/admin/Dashboard';
import Recruiters from '../pages/admin/Recruiters';
import Blog from '../pages/admin/Blog';

// Composants de pages admin
import RecruiterCreate from '../pages/admin/recruiters/RecruiterCreate';
import RecruiterEdit from '../pages/admin/recruiters/RecruiterEdit';
import RecruiterDetail from '../pages/admin/recruiters/RecruiterDetail';
import BlogCreate from '../pages/admin/blog/BlogCreate';
import BlogEdit from '../pages/admin/blog/BlogEdit';

// Pages de profil et paramètres
import Profile from '../pages/profile/Profile';
import Settings from '../pages/profile/Settings';
import ChangePassword from '../pages/profile/ChangePassword';
import Notifications from '../pages/notifications/Notifications';

// Composants utilitaires
import AccessDenied from '../components/AccessDenied';
import ConfirmDialog from '../components/ConfirmDialog';

// Composant de protection des routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    return <AccessDenied redirectPath="/login" countdown={2} />;
  }
  
  return children;
};

// Composant de routage principal
const AppRouter = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Routes protégées avec BaseLayout */}
      <Route path="/*" element={
        <ProtectedRoute>
          <BaseLayout>
            <Routes>
              {/* Routes protégées */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="recruiters" element={<Recruiters />} />
              <Route path="recruiters/create" element={<RecruiterCreate />} />
              <Route path="recruiters/:id/edit" element={<RecruiterEdit />} />
              <Route path="recruiters/:id" element={<RecruiterDetail />} />
              <Route path="blog" element={<Blog />} />
              <Route path="blog/create" element={<BlogCreate />} />
              <Route path="blog/edit/:slug" element={<BlogEdit />} />
              <Route path="profile" element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="notifications" element={<Notifications />} />
              
              {/* Redirection par défaut */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BaseLayout>
        </ProtectedRoute>
      } />

      {/* Redirection des routes non trouvées */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRouter 