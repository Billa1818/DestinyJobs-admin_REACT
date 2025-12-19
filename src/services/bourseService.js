import { apiCall, apiClient } from './api';

const SCHOLARSHIPS_BASE_URL = '/api/jobs';

class BourseService {
  // ===== MÉTADONNÉES =====

  // Récupérer les types de bourses
  async getScholarshipTypes() {
    try {
      const response = await apiCall('GET', `${SCHOLARSHIPS_BASE_URL}/scholarship-types/`);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des types de bourses');
    }
  }

  // Récupérer les domaines d'études
  async getStudyDomains() {
    try {
      const response = await apiCall('GET', `${SCHOLARSHIPS_BASE_URL}/study-domains/`);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des domaines d\'études');
    }
  }

  // Récupérer les types d'organisations
  async getOrganizationTypes() {
    try {
      const response = await apiCall('GET', `${SCHOLARSHIPS_BASE_URL}/organization-types/`);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des types d\'organisations');
    }
  }

  // ===== BOURSES - OPÉRATIONS CRUD =====

  // Récupérer la liste des bourses publiques
  async getPublicScholarships(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${SCHOLARSHIPS_BASE_URL}/scholarships/?${queryString}` : `${SCHOLARSHIPS_BASE_URL}/scholarships/`;
      const response = await apiCall('GET', url);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des bourses');
    }
  }

  // Créer une nouvelle bourse
  async createScholarship(scholarshipData) {
    try {
      const isFormData = scholarshipData instanceof FormData;
      const config = isFormData ? { 
        headers: { 'Content-Type': 'multipart/form-data' }, 
        transformRequest: (data) => data 
      } : {};
      
      const response = await apiClient.post(`${SCHOLARSHIPS_BASE_URL}/scholarships/`, scholarshipData, config);
      return response.data || response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la création de la bourse');
    }
  }

  // Récupérer les détails d'une bourse
  async getScholarshipDetail(id) {
    try {
      const response = await apiCall('GET', `${SCHOLARSHIPS_BASE_URL}/scholarships/${id}/`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des détails de la bourse');
    }
  }

  // Modifier une bourse
  async updateScholarship(id, scholarshipData) {
    try {
      const isFormData = scholarshipData instanceof FormData;
      const config = isFormData ? { 
        headers: { 'Content-Type': 'multipart/form-data' }, 
        transformRequest: (data) => data 
      } : {};
      
      const response = await apiClient.patch(`${SCHOLARSHIPS_BASE_URL}/scholarships/${id}/`, scholarshipData, config);
      return response.data || response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la modification de la bourse');
    }
  }

  // Supprimer une bourse
  async deleteScholarship(id) {
    try {
      const response = await apiCall('DELETE', `${SCHOLARSHIPS_BASE_URL}/scholarships/${id}/`);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la suppression de la bourse');
    }
  }

  // Récupérer mes bourses (recruteur connecté)
  async getMyScholarships() {
    try {
      const response = await apiCall('GET', `${SCHOLARSHIPS_BASE_URL}/my-scholarships/`);
      return Array.isArray(response) ? response : response.results || [];
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération de vos bourses');
    }
  }

  // Récupérer les détails d'une bourse publique
  async getPublicScholarshipDetail(id) {
    try {
      const response = await apiCall('GET', `${SCHOLARSHIPS_BASE_URL}/scholarships/public/${id}/`);
      return response;
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 404) {
        throw error;
      }
      throw this.handleError(error, 'Erreur lors de la récupération du détail de la bourse');
    }
  }

  // ===== RÉCUPÉRATION ADMIN =====

  // Récupérer TOUTES les bourses (endpoint admin)
  async getAdminScholarships(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${SCHOLARSHIPS_BASE_URL}/scholarships/admin/all/?${queryString}` : `${SCHOLARSHIPS_BASE_URL}/scholarships/admin/all/`;
      const response = await apiCall('GET', url);
      
      // Retourner l'objet complet avec results et admin_statistics
      if (response && typeof response === 'object' && response.results) {
        return response;
      }
      // Si c'est déjà un array, retourner un objet avec results
      if (Array.isArray(response)) {
        return { results: response };
      }
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de la récupération des bourses');
    }
  }

  // ===== FILTRES =====

  // Recherche de bourses par mot-clé
  async searchScholarships(query, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ query, page, page_size: pageSize });
  }

  // Filtrage par type de bourse
  async filterByScholarshipType(typeId, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ scholarship_type: typeId, page, page_size: pageSize });
  }

  // Filtrage par niveau requis
  async filterByRequiredLevel(level, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ required_level: level, page, page_size: pageSize });
  }

  // Filtrage par domaine d'études
  async filterByStudyDomain(domainId, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ study_domain: domainId, page, page_size: pageSize });
  }

  // Filtrage par montant
  async filterByAmount(minAmount, maxAmount = null, page = 1, pageSize = 20) {
    const filters = { amount_min: minAmount };
    if (maxAmount) filters.amount_max = maxAmount;
    return this.getPublicScholarships({ ...filters, page, page_size: pageSize });
  }

  // Filtrage par type de financement
  async filterByFunding(fullFunding = null, partialFunding = null, page = 1, pageSize = 20) {
    const filters = {};
    if (fullFunding !== null) filters.full_funding = fullFunding;
    if (partialFunding !== null) filters.partial_funding = partialFunding;
    return this.getPublicScholarships({ ...filters, page, page_size: pageSize });
  }

  // Filtrage par conditions
  async filterByConditions(accommodation = null, travelExpenses = null, page = 1, pageSize = 20) {
    const filters = {};
    if (accommodation !== null) filters.accommodation_included = accommodation;
    if (travelExpenses !== null) filters.travel_expenses_included = travelExpenses;
    return this.getPublicScholarships({ ...filters, page, page_size: pageSize });
  }

  // Filtrage par type d'organisation
  async filterByOrganizationType(orgTypeId, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ organization_type: orgTypeId, page, page_size: pageSize });
  }

  // Combinaison de filtres avancés
  async getFilteredScholarships(filters = {}, page = 1, pageSize = 20) {
    return this.getPublicScholarships({ ...filters, page, page_size: pageSize });
  }

  // ===== APPROBATION / REJET =====

  // Approuver une bourse
  async approveScholarship(scholarshipId) {
    try {
      const response = await apiCall('POST', `${SCHOLARSHIPS_BASE_URL}/admin/scholarship/${scholarshipId}/approve/`, {});
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de l\'approbation de la bourse');
    }
  }

  // Rejeter une bourse
  async rejectScholarship(scholarshipId, rejectionReason) {
    try {
      const response = await apiCall('POST', `${SCHOLARSHIPS_BASE_URL}/admin/scholarship/${scholarshipId}/reject/`, {
        rejection_reason: rejectionReason
      });
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors du rejet de la bourse');
    }
  }

  // ===== ACTIONS EN MASSE =====

  // Actions en masse sur les bourses
  async bulkActionsOnScholarships(action, scholarshipIds) {
    try {
      const payload = {
        action,
        scholarship_ids: scholarshipIds
      };
      const response = await apiCall('POST', `${SCHOLARSHIPS_BASE_URL}/admin/bulk-actions-scholarship/`, payload);
      return response;
    } catch (error) {
      throw this.handleError(error, 'Erreur lors de l\'action en masse');
    }
  }

  // Approuver plusieurs bourses
  async approveScholarshipsInBulk(scholarshipIds) {
    return this.bulkActionsOnScholarships('approve', scholarshipIds);
  }

  // Rejeter plusieurs bourses
  async rejectScholarshipsInBulk(scholarshipIds) {
    return this.bulkActionsOnScholarships('reject', scholarshipIds);
  }

  // Fermer plusieurs bourses
  async closeScholarshipsInBulk(scholarshipIds) {
    return this.bulkActionsOnScholarships('close', scholarshipIds);
  }

  // ===== GESTION DES ERREURS =====

  handleError(error, defaultMessage) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          if (data && typeof data === 'object') {
            const errorMessages = Object.entries(data)
              .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
              .join('; ');
            return new Error(`Données invalides: ${errorMessages}`);
          }
          return new Error(data?.message || 'Données invalides');
        
        case 401:
          return new Error('Authentification requise. Veuillez vous connecter.');
        
        case 403:
          return new Error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
        
        case 404:
          return new Error('Bourse non trouvée.');
        
        case 500:
          return new Error('Erreur interne du serveur. Veuillez réessayer plus tard.');
        
        default:
          return new Error(data?.message || defaultMessage);
      }
    } else if (error.request) {
      return new Error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
    } else {
      return new Error(error.message || defaultMessage);
    }
  }
}

export default new BourseService();
