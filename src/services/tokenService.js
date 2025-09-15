import { authService } from './index';

const tokenService = {
  // Vérifier si un token est expiré
  isTokenExpired(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp <= currentTime;
    } catch (error) {
      return true;
    }
  },

  // Extraire les informations du token
  getTokenPayload(token) {
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  },

  // Vérifier si le token doit être rafraîchi
  shouldRefreshToken(token) {
    if (!token) return true;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - currentTime;
      
      // Rafraîchir si le token expire dans moins de 5 minutes
      return timeUntilExpiry < 300;
    } catch (error) {
      return true;
    }
  },

  // Rafraîchir le token si nécessaire
  async refreshTokenIfNeeded() {
    const token = localStorage.getItem('access_token');
    
    if (this.shouldRefreshToken(token)) {
      try {
        await authService.refreshToken();
        return true;
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        return false;
      }
    }
    
    return true;
  },

  // Configurer le rafraîchissement automatique
  setupAutoRefresh() {
    // Vérifier le token toutes les 4 minutes
    setInterval(async () => {
      await this.refreshTokenIfNeeded();
    }, 4 * 60 * 1000);
  },

  // Nettoyer tous les tokens
  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('session_id');
  }
};

export default tokenService; 