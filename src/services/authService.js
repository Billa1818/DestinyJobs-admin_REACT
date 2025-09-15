import { apiClient, handleApiError } from './api';

const authService = {
  // Connexion de l'administrateur
  async login(credentials) {
    try {
      const response = await apiClient.post('/api/auth/login/', credentials);
      
      // Stocker les tokens
      if (response.access) {
        localStorage.setItem('access_token', response.access);
      }
      if (response.refresh) {
        localStorage.setItem('refresh_token', response.refresh);
      }
      if (response.session_id) {
        localStorage.setItem('session_id', response.session_id);
      }
      
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Déconnexion
  async logout() {
    try {
      const sessionId = localStorage.getItem('session_id');
      if (sessionId) {
        await apiClient.post(`/api/auth/sessions/${sessionId}/invalidate/`);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Nettoyer le stockage local
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('session_id');
      localStorage.removeItem('user');
    }
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  // Récupérer l'utilisateur actuel
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/api/auth/profile/');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Rafraîchir le token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('Aucun token de rafraîchissement disponible');
      }

      const response = await apiClient.post('/api/auth/token/refresh/', {
        refresh: refreshToken
      });

      if (response.access) {
        localStorage.setItem('access_token', response.access);
      }

      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Vérifier l'email
  async verifyEmail(email) {
    try {
      const response = await apiClient.post('/api/auth/verify-email/', { email });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Demander la vérification d'email
  async requestEmailVerification() {
    try {
      const response = await apiClient.post('/api/auth/request-email-verification/');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Demander la réinitialisation du mot de passe
  async requestPasswordReset(email) {
    try {
      const response = await apiClient.post('/api/auth/password/reset/', { email });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};

export default authService; 