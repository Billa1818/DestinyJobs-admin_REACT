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

// Pages pour la gestion des offres
import OffersIndex from '../pages/admin/offers/OffersIndex';
import JobOffersList from '../pages/admin/offers/job-offers/JobOffersList';
import JobOfferCreate from '../pages/admin/offers/job-offers/JobOfferCreate';
import JobOfferDetail from '../pages/admin/offers/job-offers/JobOfferDetail';
import ConsultationOffersList from '../pages/admin/offers/consultation-offers/ConsultationOffersList';
import ConsultationOffersCreate from '../pages/admin/offers/consultation-offers/ConsultationOffersCreate';
import ConsultationOfferDetail from '../pages/admin/offers/consultation-offers/ConsultationOfferDetail';
import FundingOffersList from '../pages/admin/offers/funding-offers/FundingOffersList';
import FundingOffersCreate from '../pages/admin/offers/funding-offers/FundingOffersCreate';
import FundingOffersDetail from '../pages/admin/offers/funding-offers/FundingOffersDetail';
import FundingOffersEdit from '../pages/admin/offers/funding-offers/FundingOffersEdit';
import ScholarshipsList from '../pages/admin/offers/scholarships/ScholarshipsList';
import ScholarshipsCreate from '../pages/admin/offers/scholarships/ScholarshipsCreate';
import ScholarshipsEdit from '../pages/admin/offers/scholarships/ScholarshipsEdit';
import ScholarshipsDetail from '../pages/admin/offers/scholarships/ScholarshipsDetail';

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
              
              {/* Routes pour la gestion des offres */}
              <Route path="offers" element={<OffersIndex />} />
              <Route path="offers/job-offers" element={<JobOffersList />} />
              <Route path="offers/job-offers/create" element={<JobOfferCreate />} />
              <Route path="offers/job-offers/:id" element={<JobOfferDetail />} />
              <Route path="offers/consultation-offers" element={<ConsultationOffersList />} />
              <Route path="offers/consultation-offers/create" element={<ConsultationOffersCreate />} />
              <Route path="offers/consultation-offers/:id/edit" element={<ConsultationOffersCreate />} />
              <Route path="offers/consultation-offers/:id" element={<ConsultationOfferDetail />} />
              <Route path="offers/funding-offers" element={<FundingOffersList />} />
              <Route path="offers/funding-offers/create" element={<FundingOffersCreate />} />
              <Route path="offers/funding-offers/:id" element={<FundingOffersDetail />} />
              <Route path="offers/funding-offers/:id/edit" element={<FundingOffersEdit />} />
              <Route path="offers/scholarships" element={<ScholarshipsList />} />
              <Route path="offers/scholarships/create" element={<ScholarshipsCreate />} />
              <Route path="offers/scholarships/:id" element={<ScholarshipsDetail />} />
              <Route path="offers/scholarships/:id/edit" element={<ScholarshipsEdit />} />
              
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