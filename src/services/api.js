import axios from 'axios';

// Configuration de base
export const API_BASE_URL = 'http://localhost:8000';

// Configuration Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas encore tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken
          });
          
          const newAccessToken = response.data.access;
          localStorage.setItem('access_token', newAccessToken);
          
          // Retenter la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, déconnecter l'utilisateur
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Fonctions utilitaires
export const getDefaultHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const handleApiError = (error) => {
  if (error.response) {
    // Erreur de réponse du serveur
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data?.message || 'Données invalides';
      case 401:
        return 'Non autorisé. Veuillez vous reconnecter.';
      case 403:
        return 'Accès refusé. Permissions insuffisantes.';
      case 404:
        return 'Ressource non trouvée';
      case 422:
        return data?.message || 'Données de validation invalides';
      case 500:
        return 'Erreur interne du serveur';
      default:
        return data?.message || `Erreur ${status}`;
    }
  } else if (error.request) {
    // Erreur de requête (pas de réponse)
    return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
  } else {
    // Erreur de configuration
    return 'Erreur de configuration de la requête';
  }
};

// Fonction générique pour les appels API
export const apiCall = async (method, url, data = null, config = {}) => {
  try {
    const response = await apiClient({
      method: method.toLowerCase(),
      url,
      data,
      ...config,
    });
    return response;
  } catch (error) {
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
};

// Export de apiClient
export { apiClient };

// Configuration exportée
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
};

// Export par défaut
export default {
  apiClient,
  API_BASE_URL,
  getDefaultHeaders,
  handleApiError,
  apiCall,
  API_CONFIG,
}; 