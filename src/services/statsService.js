import { apiClient, handleApiError } from './api';

const statsService = {
  // Core Admin - Statistiques Système
  async getSystemStats() {
    try {
      return await apiClient.get('/api/core-admin/stats/system/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getUserStats() {
    try {
      return await apiClient.get('/api/core-admin/stats/users/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getContentStats() {
    try {
      return await apiClient.get('/api/core-admin/stats/content/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Analytics - Statistiques Avancées
  async getSiteStats() {
    try {
      return await apiClient.get('/api/analytics/site-stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getAnalyticsSummary() {
    try {
      return await apiClient.get('/api/analytics/summary/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getActivityStats() {
    try {
      return await apiClient.get('/api/analytics/activity-stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getOfferPerformance() {
    try {
      return await apiClient.get('/api/analytics/offer-performance/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getDashboardStats() {
    try {
      return await apiClient.get('/api/analytics/dashboard/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getRealTimeStats() {
    try {
      return await apiClient.get('/api/analytics/real-time/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Common - Statistiques Système
  async getCommonSystemStats() {
    try {
      return await apiClient.get('/api/common/stats/system/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getFileUploadStats() {
    try {
      return await apiClient.get('/api/common/stats/file-upload/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getContactMessageStats() {
    try {
      return await apiClient.get('/api/common/stats/contact-messages/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getFaqStats() {
    try {
      return await apiClient.get('/api/common/stats/faq/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getHrStats() {
    try {
      return await apiClient.get('/api/common/hr/stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getBoostStats() {
    try {
      return await apiClient.get('/api/common/boost/stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Blog - Statistiques du Blog
  async getBlogStats() {
    try {
      return await apiClient.get('/api/blog/stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Jobs - Statistiques des Offres
  async getJobDiffusionStats() {
    try {
      return await apiClient.get('/api/jobs/diffusion-stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Applications - Statistiques des Candidatures
  async getApplicationStats() {
    try {
      return await apiClient.get('/api/applications/stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Notifications - Statistiques des Notifications
  async getNotificationStats() {
    try {
      return await apiClient.get('/api/notifications/stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getNotificationAnalytics() {
    try {
      return await apiClient.get('/api/notifications/analytics/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Subscriptions - Statistiques des Abonnements
  async getSubscriptionStats() {
    try {
      return await apiClient.get('/api/subscriptions/stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getPaymentStats() {
    try {
      return await apiClient.get('/api/subscriptions/payment-stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getAiServicesStats() {
    try {
      return await apiClient.get('/api/subscriptions/ai-services/stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Accounts - Statistiques des Comptes
  async getProfileVisibilityStats() {
    try {
      return await apiClient.get('/api/auth/profile/visibility/stats/');
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Statistiques Publiques
  async getPublicStats() {
    try {
      return await apiClient.get('/api/common/stats/public/');
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

export default statsService; 