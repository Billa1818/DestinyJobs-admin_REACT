import { apiClient, handleApiError } from './api';

const sessionService = {
  // Récupérer toutes les sessions actives
  async getSessions() {
    try {
      const response = await apiClient.get('/api/auth/sessions/');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Déconnecter toutes les sessions
  async logoutAllSessions() {
    try {
      const response = await apiClient.post('/api/auth/sessions/logout-all/', {
        confirm: true
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Invalider une session spécifique
  async invalidateSession(sessionId) {
    try {
      const response = await apiClient.post(`/api/auth/sessions/${sessionId}/invalidate/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Forcer la déconnexion de la session actuelle
  async forceLogout() {
    try {
      const response = await apiClient.post('/api/auth/sessions/force-logout/');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};

export default sessionService; 