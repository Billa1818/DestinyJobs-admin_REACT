import { apiClient, handleApiError } from './api';

const profileService = {
  // Récupérer le profil de l'administrateur
  async getProfile() {
    try {
      const response = await apiClient.get('/api/auth/profile/');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Mettre à jour le profil de l'administrateur
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put('/api/auth/profile/', profileData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Changer le mot de passe
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post('/api/auth/password/change/', passwordData);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Récupérer les statistiques du profil
  async getProfileStats() {
    try {
      const response = await apiClient.get('/api/auth/profile/stats/');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Mettre à jour l'avatar
  async updateAvatar(imageFile) {
    try {
      const formData = new FormData();
      formData.append('avatar', imageFile);

      const response = await apiClient.patch('/api/auth/profile/avatar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};

export default profileService;