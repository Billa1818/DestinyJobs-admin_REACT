import { apiClient, handleApiError } from './api';

const recruiterService = {
  // Récupérer les recruteurs en attente de validation
  async getPendingRecruiters(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Ajouter les filtres disponibles
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.sector) queryParams.append('sector', filters.sector);
      if (filters.company_size) queryParams.append('company_size', filters.company_size);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.page_size) queryParams.append('page_size', filters.page_size);
      
      const url = `/api/auth/recruiter-validation/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Valider ou rejeter un recruteur
  async validateRecruiter(recruiterId, action) {
    try {
      const response = await apiClient.post(`/api/auth/recruiter-validation/${recruiterId}/`, {
        action: action // 'approve' ou 'reject'
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Récupérer tous les profils de recruteurs
  async getRecruiterProfiles(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Ajouter les filtres disponibles
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.sector) queryParams.append('sector', filters.sector);
      if (filters.company_size) queryParams.append('company_size', filters.company_size);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.page_size) queryParams.append('page_size', filters.page_size);
      if (filters.ordering) queryParams.append('ordering', filters.ordering);
      
      const url = `/api/auth/profiles/public/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Recherche avancée de recruteurs
  async searchRecruitersAdvanced(searchParams) {
    try {
      const response = await apiClient.post('/api/auth/profiles/search/advanced/', searchParams);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Récupérer le profil détaillé d'un recruteur
  async getRecruiterProfile(recruiterId) {
    try {
      const response = await apiClient.get(`/api/auth/profiles/public/${recruiterId}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Mettre à jour le statut d'un recruteur
  async updateRecruiterStatus(recruiterId, status) {
    try {
      const response = await apiClient.patch(`/api/auth/profiles/public/${recruiterId}/`, {
        account_status: status
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Récupérer les statistiques des recruteurs
  async getRecruiterStats() {
    try {
      const response = await apiClient.get('/api/auth/recruiter-validation/stats/');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};

export default recruiterService; 