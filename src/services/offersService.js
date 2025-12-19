import { apiCall, apiClient } from './api';

// Base URL pour les offres
const OFFERS_BASE_URL = '/api/jobs';

// ============================================
// SERVICES POUR CRÉER LES OFFRES
// ============================================

/**
 * Crée une nouvelle offre d'emploi
 */
export const createJobOffer = async (offerData) => {
  return apiCall('POST', `${OFFERS_BASE_URL}/job-offers/`, offerData);
};

/**
 * Crée une nouvelle offre de consultation
 * @param {Object} offerData - Les données de l'offre (FormData)
 *   - title (string, requis): Titre de la consultation (max 200)
 *   - description (text, requis): Description détaillée
 *   - country_id (integer, optionnel): ID du pays
 *   - region_id (integer, optionnel): ID de la région
 *   - documents (file, optionnel): Fichier document
 *   - site_url (string, optionnel): URL du site
 *   - admin_company_logo (file, optionnel): Logo de l'entreprise
 * 
 * Notes:
 * - Recruteur: Statut initial PENDING_APPROVAL
 * - Admin: Statut initial DRAFT
 */
export const createConsultationOffer = async (offerData) => {
  try {
    const isFormData = offerData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: (data) => data } : {};
    
    const response = await apiClient.post(`${OFFERS_BASE_URL}/consultation-offers/`, offerData, config);
    return response.data || response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'offre de consultation');
  }
};

/**
 * Crée une nouvelle offre de financement
 * @param {FormData|Object} offerData - Les données de l'offre
 */
export const createFundingOffer = async (offerData) => {
  try {
    const isFormData = offerData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: (data) => data } : {};
    
    const response = await apiClient.post(`${OFFERS_BASE_URL}/funding-offers/`, offerData, config);
    return response.data || response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création de l\'offre de financement');
  }
};

/**
 * Crée une nouvelle bourse d'étude
 */
export const createScholarship = async (scholarshipData) => {
  return apiCall('POST', `${OFFERS_BASE_URL}/scholarships/`, scholarshipData);
};

// ============================================
// SERVICES POUR RÉCUPÉRER LES OFFRES
// ============================================

/**
 * Récupère toutes les offres d'emploi (endpoint public)
 */
export const getJobOffers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${OFFERS_BASE_URL}/job-offers/?${queryString}` : `${OFFERS_BASE_URL}/job-offers/`;
  return apiCall('GET', url);
};

/**
 * Récupère TOUTES les offres d'emploi (endpoint admin)
 * Inclut tous les statuts, statistiques et filtres avancés
 * @param {Object} params - Paramètres de filtrage optionnels
 *   - status: DRAFT, PENDING_APPROVAL, APPROVED, PUBLISHED, REJECTED, EXPIRED, CLOSED
 *   - recruiter_id: ID du recruteur
 *   - is_admin_only: true/false
 *   - pending_approval: true/false
 *   - search: Terme de recherche
 *   - search_fields: Champs à rechercher (title, description)
 *   - ordering: Tri (-created_at, salary_min, etc.)
 *   - page: Numéro de page
 *   - page_size: Nombre d'éléments par page
 */
export const getAdminJobOffers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${OFFERS_BASE_URL}/job-offers/admin/all/?${queryString}` : `${OFFERS_BASE_URL}/job-offers/admin/all/`;
  return apiCall('GET', url);
};

/**
 * Récupère une offre d'emploi spécifique
 */
export const getJobOfferDetail = async (offerId) => {
  return apiCall('GET', `${OFFERS_BASE_URL}/job-offers/${offerId}/`);
};

/**
 * Récupère toutes les offres de consultation (endpoint public)
 */
export const getConsultationOffers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${OFFERS_BASE_URL}/consultation-offers/?${queryString}` : `${OFFERS_BASE_URL}/consultation-offers/`;
  return apiCall('GET', url);
};

/**
 * Récupère TOUTES les offres de consultation (endpoint admin)
 * Inclut tous les statuts, statistiques et filtres avancés
 * @param {Object} params - Paramètres de filtrage optionnels
 *   - status: DRAFT, PENDING_APPROVAL, PUBLISHED, REJECTED, CLOSED
 *   - recruiter_id: Filtrer par recruteur
 *   - is_admin_only: true/false
 *   - search: Recherche dans titre/description
 *   - ordering: Tri (-created_at, status, etc.)
 *   - page: Numéro de page
 */
export const getAdminConsultationOffers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${OFFERS_BASE_URL}/consultation-offers/admin/all/?${queryString}` : `${OFFERS_BASE_URL}/consultation-offers/admin/all/`;
  return apiCall('GET', url);
};

/**
 * Récupère une offre de consultation spécifique
 */
export const getConsultationOfferDetail = async (offerId) => {
  return apiCall('GET', `${OFFERS_BASE_URL}/consultation-offers/${offerId}/`);
};

/**
 * Récupère toutes les offres de financement (endpoint public)
 */
export const getFundingOffers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${OFFERS_BASE_URL}/funding-offers/?${queryString}` : `${OFFERS_BASE_URL}/funding-offers/`;
  return apiCall('GET', url);
};

/**
 * Récupère TOUTES les offres de financement (endpoint admin)
 * Inclut tous les statuts, statistiques et filtres avancés
 * @param {Object} params - Paramètres de filtrage optionnels
 */
export const getAdminFundingOffers = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${OFFERS_BASE_URL}/funding-offers/admin/all/?${queryString}` : `${OFFERS_BASE_URL}/funding-offers/admin/all/`;
  return apiCall('GET', url);
};

/**
 * Récupère une offre de financement spécifique
 */
export const getFundingOfferDetail = async (offerId) => {
  return apiCall('GET', `${OFFERS_BASE_URL}/funding-offers/${offerId}/`);
};

/**
 * Récupère toutes les bourses d'étude (endpoint public)
 */
export const getScholarships = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${OFFERS_BASE_URL}/scholarships/?${queryString}` : `${OFFERS_BASE_URL}/scholarships/`;
  return apiCall('GET', url);
};

/**
 * Récupère TOUTES les bourses d'étude (endpoint admin)
 * Inclut tous les statuts, statistiques et filtres avancés
 * @param {Object} params - Paramètres de filtrage optionnels
 */
export const getAdminScholarships = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${OFFERS_BASE_URL}/scholarships/admin/all/?${queryString}` : `${OFFERS_BASE_URL}/scholarships/admin/all/`;
  return apiCall('GET', url);
};

/**
 * Récupère une bourse d'étude spécifique
 */
export const getScholarshipDetail = async (offerId) => {
  return apiCall('GET', `${OFFERS_BASE_URL}/scholarships/${offerId}/`);
};

// ============================================
// SERVICES POUR MODIFIER LES OFFRES
// ============================================

/**
 * Modifie une offre d'emploi
 */
export const updateJobOffer = async (offerId, offerData) => {
  return apiCall('PATCH', `${OFFERS_BASE_URL}/job-offers/${offerId}/`, offerData);
};

/**
 * Modifie une offre de consultation
 * @param {string} offerId - UUID de l'offre
 * @param {Object} offerData - Les données à mettre à jour
 */
export const updateConsultationOffer = async (offerId, offerData) => {
  try {
    const isFormData = offerData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: (data) => data } : {};
    
    const response = await apiClient.patch(`${OFFERS_BASE_URL}/consultation-offers/${offerId}/`, offerData, config);
    return response.data || response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la modification de l\'offre de consultation');
  }
};

/**
 * Modifie une offre de financement
 * @param {string} offerId - UUID de l'offre
 * @param {Object|FormData} offerData - Les données à mettre à jour
 */
export const updateFundingOffer = async (offerId, offerData) => {
  try {
    const isFormData = offerData instanceof FormData;
    const config = isFormData ? { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: (data) => data } : {};
    
    const response = await apiClient.patch(`${OFFERS_BASE_URL}/funding-offers/${offerId}/`, offerData, config);
    return response.data || response;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la modification de l\'offre de financement');
  }
};

/**
 * Modifie une bourse d'étude
 */
export const updateScholarship = async (offerId, scholarshipData) => {
  return apiCall('PATCH', `${OFFERS_BASE_URL}/scholarships/${offerId}/`, scholarshipData);
};

// ============================================
// SERVICES POUR SUPPRIMER LES OFFRES
// ============================================

/**
 * Supprime une offre d'emploi
 */
export const deleteJobOffer = async (offerId) => {
  return apiCall('DELETE', `${OFFERS_BASE_URL}/job-offers/${offerId}/`);
};

/**
 * Supprime une offre de consultation
 */
export const deleteConsultationOffer = async (offerId) => {
  return apiCall('DELETE', `${OFFERS_BASE_URL}/consultation-offers/${offerId}/`);
};

/**
 * Supprime une offre de financement
 */
export const deleteFundingOffer = async (offerId) => {
  return apiCall('DELETE', `${OFFERS_BASE_URL}/funding-offers/${offerId}/`);
};

/**
 * Supprime une bourse d'étude
 */
export const deleteScholarship = async (offerId) => {
  return apiCall('DELETE', `${OFFERS_BASE_URL}/scholarships/${offerId}/`);
};

// ============================================
// SERVICES POUR APPROUVER / REJETER LES OFFRES
// ============================================

/**
 * Approuve une offre de consultation
 * @param {string} offerId - UUID de l'offre
 * Endpoint: POST /api/jobs/admin/consultation-offer/{offer_id}/approve/
 */
export const approveConsultationOffer = async (offerId) => {
  return apiCall('POST', `${OFFERS_BASE_URL}/admin/consultation-offer/${offerId}/approve/`, {});
};

/**
 * Rejette une offre de consultation
 * @param {string} offerId - UUID de l'offre
 * @param {string} rejectionReason - Raison du rejet
 * Endpoint: POST /api/jobs/admin/consultation-offer/{offer_id}/reject/
 */
export const rejectConsultationOffer = async (offerId, rejectionReason) => {
  return apiCall('POST', `${OFFERS_BASE_URL}/admin/consultation-offer/${offerId}/reject/`, {
    rejection_reason: rejectionReason
  });
};

/**
 * Approuve une offre générique (ancienne fonction)
 * @deprecated Utiliser approveConsultationOffer() pour les consultations
 */
export const approveOffer = async (offerId) => {
  return apiCall('POST', `${OFFERS_BASE_URL}/admin/offer/${offerId}/approve/`, {});
};

/**
 * Rejette une offre générique (ancienne fonction)
 * @deprecated Utiliser rejectConsultationOffer() pour les consultations
 */
export const rejectOffer = async (offerId, rejectionReason) => {
  return apiCall('POST', `${OFFERS_BASE_URL}/admin/offer/${offerId}/reject/`, {
    rejection_reason: rejectionReason
  });
};

/**
 * Approuve une offre de financement
 * @param {string} offerId - UUID de l'offre
 * Endpoint: POST /api/jobs/admin/funding-offer/{offer_id}/approve/
 */
export const approveFundingOffer = async (offerId) => {
  return apiCall('POST', `${OFFERS_BASE_URL}/admin/funding-offer/${offerId}/approve/`, {});
};

/**
 * Rejette une offre de financement
 * @param {string} offerId - UUID de l'offre
 * @param {string} rejectionReason - Raison du rejet
 * Endpoint: POST /api/jobs/admin/funding-offer/{offer_id}/reject/
 */
export const rejectFundingOffer = async (offerId, rejectionReason) => {
  return apiCall('POST', `${OFFERS_BASE_URL}/admin/funding-offer/${offerId}/reject/`, {
    rejection_reason: rejectionReason
  });
};

/**
 * Approuve une bourse d'étude
 * @param {string} scholarshipId - UUID de la bourse
 * Endpoint: POST /api/jobs/admin/scholarship/{scholarship_id}/approve/
 */
export const approveScholarship = async (scholarshipId) => {
  return apiCall('POST', `${OFFERS_BASE_URL}/admin/scholarship/${scholarshipId}/approve/`, {});
};

/**
 * Rejette une bourse d'étude
 * @param {string} scholarshipId - UUID de la bourse
 * @param {string} rejectionReason - Raison du rejet
 * Endpoint: POST /api/jobs/admin/scholarship/{scholarship_id}/reject/
 */
export const rejectScholarship = async (scholarshipId, rejectionReason) => {
  return apiCall('POST', `${OFFERS_BASE_URL}/admin/scholarship/${scholarshipId}/reject/`, {
    rejection_reason: rejectionReason
  });
};

// ============================================
// SERVICES POUR ACTIONS EN MASSE
// ============================================

/**
 * Effectue des actions en masse sur les offres de consultation
 * Endpoint: POST /api/jobs/admin/bulk-actions-consultation/
 * @param {string} action - L'action à effectuer: approve, reject, close, mark_admin_only
 * @param {array} offerIds - Les IDs des offres (UUIDs)
 */
export const bulkActionsOnConsultationOffers = async (action, offerIds) => {
  const payload = {
    action,
    offer_ids: offerIds
  };

  return apiCall('POST', `${OFFERS_BASE_URL}/admin/bulk-actions-consultation/`, payload);
};

/**
 * Effectue des actions en masse sur les bourses d'étude
 * Endpoint: POST /api/jobs/admin/bulk-actions-scholarships/
 * @param {string} action - L'action à effectuer: approve, reject, close, mark_admin_only
 * @param {array} scholarshipIds - Les IDs des bourses (UUIDs)
 */
export const bulkActionsOnScholarships = async (action, scholarshipIds) => {
  const payload = {
    action,
    scholarship_ids: scholarshipIds
  };

  return apiCall('POST', `${OFFERS_BASE_URL}/admin/bulk-actions-scholarships/`, payload);
};

/**
 * Approuve plusieurs offres de consultation
 */
export const approveConsultationOffersInBulk = async (offerIds) => {
  return bulkActionsOnConsultationOffers('approve', offerIds);
};

/**
 * Rejette plusieurs offres de consultation
 */
export const rejectConsultationOffersInBulk = async (offerIds) => {
  return bulkActionsOnConsultationOffers('reject', offerIds);
};

/**
 * Ferme plusieurs offres de consultation
 */
export const closeConsultationOffersInBulk = async (offerIds) => {
  return bulkActionsOnConsultationOffers('close', offerIds);
};

/**
 * Marque plusieurs offres de consultation comme admin uniquement
 */
export const markConsultationOffersAdminOnlyInBulk = async (offerIds) => {
  return bulkActionsOnConsultationOffers('mark_admin_only', offerIds);
};

/**
 * Effectue des actions en masse sur les offres (générique - ancienne fonction)
 * @deprecated Utiliser bulkActionsOnConsultationOffers() pour les consultations
 */
export const bulkActionsOnOffers = async (action, offerIds, rejectionReason = null) => {
  const payload = {
    action,
    offer_ids: offerIds
  };

  if (rejectionReason && action === 'reject') {
    payload.rejection_reason = rejectionReason;
  }

  return apiCall('POST', `${OFFERS_BASE_URL}/admin/bulk-actions/`, payload);
};

/**
 * Approuve plusieurs offres (générique - ancienne fonction)
 * @deprecated Utiliser approveConsultationOffersInBulk() pour les consultations
 */
export const approveOffersInBulk = async (offerIds) => {
  return bulkActionsOnOffers('approve', offerIds);
};

/**
 * Rejette plusieurs offres (générique - ancienne fonction)
 * @deprecated Utiliser rejectConsultationOffersInBulk() pour les consultations
 */
export const rejectOffersInBulk = async (offerIds, rejectionReason) => {
  return bulkActionsOnOffers('reject', offerIds, rejectionReason);
};

/**
 * Prolonge la date limite de plusieurs offres
 */
export const extendDeadlineInBulk = async (offerIds) => {
  return bulkActionsOnOffers('extend_deadline', offerIds);
};

/**
 * Marque plusieurs offres comme urgentes
 */
export const markUrgentInBulk = async (offerIds) => {
  return bulkActionsOnOffers('mark_urgent', offerIds);
};

/**
 * Marque plusieurs offres comme sponsorisées
 */
export const markSponsoredInBulk = async (offerIds) => {
  return bulkActionsOnOffers('mark_sponsored', offerIds);
};

/**
 * Approuve plusieurs bourses d'étude
 */
export const approveScholarshipsInBulk = async (scholarshipIds) => {
  return bulkActionsOnScholarships('approve', scholarshipIds);
};

/**
 * Rejette plusieurs bourses d'étude
 */
export const rejectScholarshipsInBulk = async (scholarshipIds) => {
  return bulkActionsOnScholarships('reject', scholarshipIds);
};

/**
 * Ferme plusieurs bourses d'étude
 */
export const closeScholarshipsInBulk = async (scholarshipIds) => {
  return bulkActionsOnScholarships('close', scholarshipIds);
};

// ============================================
// EXPORTS PAR DÉFAUT
// ============================================

export default {
  // Créer
  createJobOffer,
  createConsultationOffer,
  createFundingOffer,
  createScholarship,

  // Récupérer
  getJobOffers,
  getAdminJobOffers,
  getJobOfferDetail,
  getConsultationOffers,
  getAdminConsultationOffers,
  getConsultationOfferDetail,
  getFundingOffers,
  getAdminFundingOffers,
  getFundingOfferDetail,
  getScholarships,
  getAdminScholarships,
  getScholarshipDetail,

  // Modifier
  updateJobOffer,
  updateConsultationOffer,
  updateFundingOffer,
  updateScholarship,

  // Supprimer
  deleteJobOffer,
  deleteConsultationOffer,
  deleteFundingOffer,
  deleteScholarship,

  // Approuver / Rejeter - Offres de Consultation (NOUVELLES)
  approveConsultationOffer,
  rejectConsultationOffer,

  // Approuver / Rejeter - Offres de Financement (NOUVELLES)
  approveFundingOffer,
  rejectFundingOffer,

  // Approuver / Rejeter - Bourses d'Étude (NOUVELLES)
  approveScholarship,
  rejectScholarship,

  // Approuver / Rejeter - Offres (anciennes fonctions génériques)
  approveOffer,
  rejectOffer,

  // Actions en masse - Offres de Consultation (NOUVELLES)
  bulkActionsOnConsultationOffers,
  approveConsultationOffersInBulk,
  rejectConsultationOffersInBulk,
  closeConsultationOffersInBulk,
  markConsultationOffersAdminOnlyInBulk,

  // Actions en masse - Bourses d'Étude
  bulkActionsOnScholarships,
  approveScholarshipsInBulk,
  rejectScholarshipsInBulk,
  closeScholarshipsInBulk,

  // Actions en masse - Offres (anciennes fonctions génériques)
  bulkActionsOnOffers,
  approveOffersInBulk,
  rejectOffersInBulk,
  extendDeadlineInBulk,
  markUrgentInBulk,
  markSponsoredInBulk
};
