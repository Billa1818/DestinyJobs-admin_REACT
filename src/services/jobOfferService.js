import { apiClient } from './api';

class JobOfferService {
  /**
   * Récupération des pays
   * @returns {Promise} - Promesse contenant la liste des pays
   */
  async getCountries() {
    try {
      const response = await apiClient.get('/api/auth/countries/');
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des pays');
    }
  }

  /**
   * Récupération des régions d'un pays
   * @param {number} countryId - ID du pays
   * @returns {Promise} - Promesse contenant la liste des régions
   */
  async getRegionsByCountry(countryId) {
    try {
      const response = await apiClient.get(`/api/auth/countries/${countryId}/regions/`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des régions');
    }
  }

  /**
   * Récupération des départements
   * @returns {Promise} - Promesse contenant la liste des départements
   */
  async getDepartments() {
    try {
      const response = await apiClient.get('/api/jobs/departments/');
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des départements');
    }
  }

  /**
   * Récupération des catégories
   * @param {number} departmentId - ID du département (optionnel)
   * @returns {Promise} - Promesse contenant la liste des catégories
   */
  async getCategories(departmentId = null) {
    try {
      const params = departmentId ? { department: departmentId } : {};
      const response = await apiClient.get('/api/jobs/categories/', { params });
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des catégories');
    }
  }

  /**
   * Récupération des fonctions de poste
   * @returns {Promise} - Promesse contenant la liste des fonctions
   */
  async getJobFunctions() {
    try {
      const response = await apiClient.get('/api/jobs/job-functions/');
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des fonctions de poste');
    }
  }

  /**
   * Récupération des secteurs d'activité
   * @returns {Promise} - Promesse contenant la liste des secteurs
   */
  async getActivitySectors() {
    try {
      const response = await apiClient.get('/api/jobs/activity-sectors/');
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des secteurs d\'activité');
    }
  }

  /**
   * Création d'une offre d'emploi
   * @param {Object|FormData} jobOfferData - Données de l'offre d'emploi (FormData si fichier)
   * @returns {Promise} - Promesse contenant l'offre créée
   */
  async createJobOffer(jobOfferData) {
    try {
      // Vérifie si c'est un FormData (pour supporter les fichiers)
      const isFormData = jobOfferData instanceof FormData;
      const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: (data) => data } : {};
      
      const response = await apiClient.post('/api/jobs/job-offers/', jobOfferData, config);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la création de l\'offre d\'emploi');
    }
  }

  /**
   * Récupération de toutes les offres d'emploi
   * @param {Object} params - Paramètres de filtrage et pagination
   * @returns {Promise} - Promesse contenant la liste des offres
   */
  async getJobOffers(params = {}) {
    try {
      const response = await apiClient.get('/api/jobs/job-offers/', { params });
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des offres d\'emploi');
    }
  }

  /**
   * Récupération du détail d'une offre d'emploi
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse contenant le détail de l'offre
   */
  async getJobOfferDetail(offerId) {
    try {
      const response = await apiClient.get(`/api/jobs/job-offers/${offerId}/`);
      return response;
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 404) {
        throw error;
      }
      throw this.handleError(error, 'Erreur lors de la récupération du détail de l\'offre');
    }
  }

  /**
   * Modification d'une offre d'emploi
   * @param {string} offerId - ID de l'offre
   * @param {Object} updateData - Données à modifier
   * @returns {Promise} - Promesse contenant l'offre modifiée
   */
  async updateJobOffer(offerId, updateData) {
    try {
      const response = await apiClient.patch(`/api/jobs/job-offers/${offerId}/`, updateData);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la modification de l\'offre');
    }
  }

  /**
   * Suppression d'une offre d'emploi
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse de suppression
   */
  async deleteJobOffer(offerId) {
    try {
      const response = await apiClient.delete(`/api/jobs/job-offers/${offerId}/`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la suppression de l\'offre');
    }
  }

  /**
   * Approbation d'une offre d'emploi
   * @param {string} offerId - ID de l'offre
   * @returns {Promise} - Promesse d'approbation
   */
  async approveJobOffer(offerId) {
    try {
      const response = await apiClient.post(`/api/jobs/admin/offer/${offerId}/approve/`, {});
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de l\'approbation de l\'offre');
    }
  }

  /**
   * Rejet d'une offre d'emploi
   * @param {string} offerId - ID de l'offre
   * @param {string} rejectionReason - Raison du rejet
   * @returns {Promise} - Promesse de rejet
   */
  async rejectJobOffer(offerId, rejectionReason) {
    try {
      const response = await apiClient.post(`/api/jobs/admin/offer/${offerId}/reject/`, {
        rejection_reason: rejectionReason
      });
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors du rejet de l\'offre');
    }
  }

  /**
   * Actions en masse sur les offres d'emploi
   * @param {Object} payload - Payload contenant l'action et les offres
   * @returns {Promise} - Promesse d'exécution
   */
  async bulkActions(payload) {
    try {
      const response = await apiClient.post('/api/jobs/admin/bulk-actions/', payload);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de l\'exécution des actions en masse');
    }
  }

  /**
   * Recherche avancée d'offres d'emploi
   * @param {Object} searchParams - Paramètres de recherche
   * @returns {Promise} - Promesse contenant les résultats
   */
  async searchJobOffers(searchParams) {
    try {
      const response = await apiClient.get('/api/jobs/job-offers/', { params: searchParams });
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la recherche d\'offres');
    }
  }

  /**
   * Gestion des erreurs génériques
   * @param {Object} error - Objet erreur
   * @param {string} defaultMessage - Message d'erreur par défaut
   * @returns {Error} - Erreur avec message formaté
   */
  handleError(error, defaultMessage) {
    let message = defaultMessage;

    if (error.response?.data) {
      const errorData = error.response.data;

      if (errorData.error) {
        message = errorData.error;
      } else if (errorData.details) {
        const fieldErrors = Object.values(errorData.details).flat();
        message = fieldErrors.join(', ');
      } else if (typeof errorData === 'string') {
        message = errorData;
      } else if (typeof errorData === 'object') {
        const allErrors = [];
        Object.keys(errorData).forEach(key => {
          if (Array.isArray(errorData[key])) {
            allErrors.push(`${key}: ${errorData[key].join(', ')}`);
          } else if (typeof errorData[key] === 'string') {
            allErrors.push(`${key}: ${errorData[key]}`);
          }
        });
        if (allErrors.length > 0) {
          message = allErrors.join(' | ');
        }
      }
    } else if (error.message) {
      message = error.message;
    }

    console.error('API Error:', error);
    return new Error(message);
  }
}

const jobOfferService = new JobOfferService();

export default jobOfferService;
