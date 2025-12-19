import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import consultationService from '../../../../services/consultationService';
import { createConsultationOffer, updateConsultationOffer, getConsultationOfferDetail } from '../../../../services/offersService';
import { handleApiError } from '../../../../services/api';

const ConsultationOffersCreate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  // États pour les données de référence
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);

  // États du formulaire - Alignés avec la doc API
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    country: '',
    region: '',
    documents: null,
    site_url: '',
    admin_company_logo: null
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentConsultation, setCurrentConsultation] = useState(null);

  // Vérifier l'authentification
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Vérifier si on est en mode édition via l'URL
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadConsultationForEdit(id);
    }
  }, [id]);

  // Charger les données de référence au montage
  useEffect(() => {
    loadReferenceData();
  }, []);

  // Charger les régions quand un pays est sélectionné
  useEffect(() => {
    if (formData.country) {
      loadRegions(formData.country);
    } else {
      setRegions([]);
    }
  }, [formData.country]);

  // Charger les pays et régions
  const loadReferenceData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await consultationService.getCountries();
      
      // Extraire les données correctement
      const countriesData = response?.data || response?.results || response;
      setCountries(Array.isArray(countriesData) ? countriesData : []);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      setError(error.message || 'Erreur lors du chargement des données de référence');
    } finally {
      setLoading(false);
    }
  };

  // Charger les régions d'un pays
  const loadRegions = async (countryId) => {
    try {
      const response = await consultationService.getRegionsByCountry(countryId);
      
      // Extraire les données correctement
      const regionsData = response?.data || response?.results || response;
      setRegions(Array.isArray(regionsData) ? regionsData : []);
    } catch (error) {
      console.error('Erreur chargement régions:', error);
      setRegions([]);
    }
  };

  // Charger une offre existante pour édition
  const loadConsultationForEdit = async (consultationId) => {
    try {
      setLoading(true);
      setError(null);

      const consultationData = await getConsultationOfferDetail(consultationId);
      setCurrentConsultation(consultationData);

      // Pré-remplir le formulaire avec les données existantes
      setFormData({
        title: consultationData.title || '',
        description: consultationData.description || '',
        country: consultationData.country?.id?.toString() || '',
        region: consultationData.region?.id?.toString() || '',
        documents: null,
        site_url: consultationData.site_url || '',
        admin_company_logo: null
      });

      // Charger les régions si un pays est sélectionné
      if (consultationData.country?.id) {
        loadRegions(consultationData.country.id);
      }

      setSuccessMessage(`Mode édition activé pour l'offre "${consultationData.title}"`);
    } catch (error) {
      setError(error.message || 'Erreur lors du chargement de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData((prev) => ({
        ...prev,
        [name]: files && files[0] ? files[0] : null
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Préparer les données pour l'API
      const dataToSend = new FormData();

      dataToSend.append('title', formData.title);
      dataToSend.append('description', formData.description);
      
      // Ajouter country_id et region_id (noms corrects pour l'API)
      if (formData.country) {
        dataToSend.append('country_id', formData.country);
      }
      
      if (formData.region) {
        dataToSend.append('region_id', formData.region);
      }

      // Ajouter les fichiers si fournis
      if (formData.documents) {
        dataToSend.append('documents', formData.documents);
      }

      if (formData.site_url) {
        dataToSend.append('site_url', formData.site_url);
      }

      if (formData.admin_company_logo) {
        dataToSend.append('admin_company_logo', formData.admin_company_logo);
      }

      if (isEditing && currentConsultation) {
        await updateConsultationOffer(currentConsultation.id, dataToSend);
        setSuccessMessage('Offre de consultation mise à jour avec succès !');
      } else {
        await createConsultationOffer(dataToSend);
        setSuccessMessage('Offre de consultation créée avec succès !');
      }

      // Rediriger après un délai
      setTimeout(() => {
        navigate('/offers/consultation-offers', { replace: true });
      }, 2000);
    } catch (error) {
      setError(handleApiError(error) || 'Erreur lors de la création de l\'offre');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !countries.length) {
    return (
      <div className="w-full flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/offers/consultation-offers')}
            className="text-fuchsia-600 hover:text-fuchsia-700 font-semibold flex items-center space-x-2 mb-4"
          >
            <i className="fas fa-chevron-left"></i>
            <span>Retour aux offres</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Modifier une offre de consultation' : 'Créer une nouvelle offre de consultation'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? 'Modifiez votre offre de consultation existante'
              : 'Remplissez le formulaire pour créer une offre de consultation'
            }
          </p>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            <i className="fas fa-check-circle mr-2"></i>
            {successMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Informations générales */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informations générales</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre de la consultation <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  maxLength="200"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Ex: Consultation Stratégie Marketing"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.title.length}/200 caractères</p>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                  Pays
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="">Sélectionner un pays</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id.toString()}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="region" className="block text-sm font-semibold text-gray-700 mb-2">
                  Région
                </label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  disabled={!formData.country}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 disabled:bg-gray-100"
                >
                  <option value="">
                    {formData.country ? 'Sélectionner une région' : 'Sélectionnez d\'abord un pays'}
                  </option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id.toString()}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Description</h2>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description détaillée <span className="text-red-600">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows="6"
                required
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="Décrivez en détail votre offre de consultation..."
              ></textarea>
            </div>
          </div>

          {/* Documents et Médias */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Documents et Médias</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="documents" className="block text-sm font-semibold text-gray-700 mb-2">
                  Document joint <span className="text-red-600">*</span>
                </label>
                <input
                  type="file"
                  id="documents"
                  name="documents"
                  required
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
                {formData.documents && (
                  <p className="text-sm text-gray-600 mt-2">
                    <i className="fas fa-check text-green-600 mr-1"></i>
                    Fichier: {formData.documents.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="admin_company_logo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Logo de l'entreprise <span className="text-red-600">*</span>
                </label>
                <input
                  type="file"
                  id="admin_company_logo"
                  name="admin_company_logo"
                  accept="image/*"
                  required
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
                {formData.admin_company_logo && (
                  <p className="text-sm text-gray-600 mt-2">
                    <i className="fas fa-check text-green-600 mr-1"></i>
                    Image: {formData.admin_company_logo.name}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Site Web */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Site Web</h2>

            <div>
              <label htmlFor="site_url" className="block text-sm font-semibold text-gray-700 mb-2">
                URL du site <span className="text-red-600">*</span>
              </label>
              <input
                type="url"
                id="site_url"
                name="site_url"
                required
                value={formData.site_url}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Actions du formulaire */}
          <div className="px-8 py-6 bg-gray-50">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/admin/offers/consultation-offers')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition duration-200 font-semibold"
              >
                <i className="fas fa-times mr-2"></i>
                Annuler
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-semibold disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    {isEditing ? 'Modification...' : 'Création...'}
                  </>
                ) : (
                  <>
                    <i className={`${isEditing ? 'fas fa-save' : 'fas fa-paper-plane'} mr-2`}></i>
                    {isEditing ? 'Mettre à jour' : 'Créer'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Info Note */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          <i className="fas fa-info-circle mr-1"></i>
          <strong>Statut initial:</strong> {user?.user_type === 'ADMIN' ? 'DRAFT (brouillon)' : 'PENDING_APPROVAL (en attente d\'approbation admin)'}
        </p>
      </div>
    </div>
  );
};

export default ConsultationOffersCreate;
