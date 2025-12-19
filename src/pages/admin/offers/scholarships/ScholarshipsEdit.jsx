import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';
import bourseService from '../../../../services/bourseService';
import Loader from '../../../../components/Loader';
import { ROUTES } from '../../../../routers';

const ScholarshipsEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  
  // Données de référence
  const [scholarshipTypes, setScholarshipTypes] = useState([]);
  const [studyDomains, setStudyDomains] = useState([]);
  const [organizationTypes, setOrganizationTypes] = useState([]);
  
  // État du formulaire
  const [formData, setFormData] = useState({
    title: '',
    scholarship_type: '',
    required_level: '',
    study_domain: '',
    scholarship_amount: '',
    duration: '',
    application_deadline: '',
    start_date: '',
    beneficiary_count: '',
    country_region: '',
    full_funding: false,
    partial_funding: false,
    accommodation_included: false,
    travel_expenses_included: false,
    description: '',
    benefits_coverage: '',
    eligibility_criteria: '',
    application_process: '',
    organization_name: '',
    organization_type: '',
    contact_info: '',
    official_website: '',
    external_application_url: '',
    external_platform_name: '',
    is_external_application: true,
    site_url: '',
    admin_company_logo: null
  });

  const [logoPreview, setLogoPreview] = useState(null);

  // Charger les données de référence au montage du composant
  useEffect(() => {
    loadReferenceData();
    loadScholarshipForEdit();
  }, [id]);

  const loadReferenceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [types, domains, orgTypes] = await Promise.all([
        bourseService.getScholarshipTypes(),
        bourseService.getStudyDomains(),
        bourseService.getOrganizationTypes()
      ]);
      
      setScholarshipTypes(types);
      setStudyDomains(domains);
      setOrganizationTypes(orgTypes);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadScholarshipForEdit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const scholarshipData = await bourseService.getScholarshipDetail(id);
      
      // Pré-remplir le formulaire avec les données existantes
      setFormData({
        title: scholarshipData.title || '',
        scholarship_type: scholarshipData.scholarship_type?.id || '',
        required_level: scholarshipData.required_level || '',
        study_domain: scholarshipData.study_domain?.id || '',
        scholarship_amount: scholarshipData.scholarship_amount || '',
        duration: scholarshipData.duration || '',
        application_deadline: scholarshipData.application_deadline ? scholarshipData.application_deadline.split('T')[0] : '',
        start_date: scholarshipData.start_date ? scholarshipData.start_date.split('T')[0] : '',
        beneficiary_count: scholarshipData.beneficiary_count || '',
        country_region: scholarshipData.country_region || '',
        full_funding: scholarshipData.full_funding || false,
        partial_funding: scholarshipData.partial_funding || false,
        accommodation_included: scholarshipData.accommodation_included || false,
        travel_expenses_included: scholarshipData.travel_expenses_included || false,
        description: scholarshipData.description || '',
        benefits_coverage: scholarshipData.benefits_coverage || '',
        eligibility_criteria: scholarshipData.eligibility_criteria || '',
        application_process: scholarshipData.application_process || '',
        organization_name: scholarshipData.organization_name || '',
        organization_type: scholarshipData.organization_type?.id || '',
        contact_info: scholarshipData.contact_info || '',
        official_website: scholarshipData.official_website || '',
        external_application_url: scholarshipData.external_application_url || '',
        external_platform_name: scholarshipData.external_platform_name || '',
        is_external_application: true,
        site_url: scholarshipData.site_url || '',
        admin_company_logo: null
      });

      // Afficher l'aperçu du logo existant
      if (scholarshipData.admin_company_logo) {
        setLogoPreview(scholarshipData.admin_company_logo);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        admin_company_logo: file
      }));
      
      // Prévisualiser l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Préparer les données pour l'API
      const apiData = new FormData();
      
      // Ajouter les champs de texte
      apiData.append('title', formData.title);
      apiData.append('scholarship_type', parseInt(formData.scholarship_type));
      apiData.append('required_level', formData.required_level);
      apiData.append('study_domain', parseInt(formData.study_domain));
      apiData.append('scholarship_amount', formData.scholarship_amount ? parseFloat(formData.scholarship_amount) : null);
      apiData.append('duration', formData.duration);
      apiData.append('application_deadline', formData.application_deadline);
      apiData.append('start_date', formData.start_date);
      apiData.append('beneficiary_count', parseInt(formData.beneficiary_count));
      apiData.append('country_region', formData.country_region);
      apiData.append('full_funding', formData.full_funding);
      apiData.append('partial_funding', formData.partial_funding);
      apiData.append('accommodation_included', formData.accommodation_included);
      apiData.append('travel_expenses_included', formData.travel_expenses_included);
      apiData.append('description', formData.description);
      apiData.append('benefits_coverage', formData.benefits_coverage);
      apiData.append('eligibility_criteria', formData.eligibility_criteria);
      apiData.append('application_process', formData.application_process);
      apiData.append('organization_name', formData.organization_name);
      apiData.append('organization_type', parseInt(formData.organization_type));
      apiData.append('contact_info', formData.contact_info);
      apiData.append('official_website', formData.official_website);
      apiData.append('external_application_url', formData.external_application_url);
      apiData.append('external_platform_name', formData.external_platform_name);
      apiData.append('is_external_application', true);
      apiData.append('site_url', formData.site_url);
      
      // Ajouter le fichier logo s'il existe
      if (formData.admin_company_logo) {
        apiData.append('admin_company_logo', formData.admin_company_logo);
      }
      
      await bourseService.updateScholarship(id, apiData);
      setNotification({
        type: 'success',
        message: 'Bourse modifiée avec succès !'
      });
      
      // Rediriger vers la gestion des bourses après un délai
      setTimeout(() => {
        navigate(ROUTES.ADMIN.OFFERS.SCHOLARSHIPS.DETAIL(id));
      }, 2000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN.OFFERS.SCHOLARSHIPS.DETAIL(id));
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modifier la bourse</h1>
          <p className="mt-2 text-gray-600">
            Modifiez les informations de votre bourse d'études
          </p>
        </div>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${notification.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
            {notification.message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-8">
          {/* Informations générales */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Informations générales
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de la bourse <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                  id="title"
                  name="title"
                required
                  value={formData.title}
                onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Ex: Bourse d'Excellence en Informatique"
              />
                    </div>
                    
                    <div>
                <label htmlFor="scholarship_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type de bourse <span className="text-red-500">*</span>
                        </label>
              <select 
                  id="scholarship_type"
                  name="scholarship_type"
                  required
                  value={formData.scholarship_type}
                onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                  <option value="">Sélectionnez un type</option>
                  {scholarshipTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                        </select>
                    </div>
                    
                    <div>
                <label htmlFor="required_level" className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau requis <span className="text-red-500">*</span>
                        </label>
              <select 
                  id="required_level"
                  name="required_level"
                  required
                  value={formData.required_level}
                onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                  <option value="">Sélectionnez un niveau</option>
                  <option value="LICENCE">Licence</option>
                  <option value="MASTER">Master</option>
                  <option value="DOCTORAT">Doctorat</option>
                  <option value="POST_DOC">Post-doctorat</option>
                        </select>
                    </div>
                    
                    <div>
                <label htmlFor="study_domain" className="block text-sm font-medium text-gray-700 mb-2">
                Domaine d'études <span className="text-red-500">*</span>
                        </label>
              <select 
                  id="study_domain"
                  name="study_domain"
                  required
                  value={formData.study_domain}
                onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
              >
                  <option value="">Sélectionnez un domaine</option>
                  {studyDomains.map(domain => (
                    <option key={domain.id} value={domain.id}>
                      {domain.name}
                    </option>
                  ))}
                        </select>
                    </div>

              <div>
                <label htmlFor="scholarship_amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Montant de la bourse (FCFA) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="scholarship_amount"
                  name="scholarship_amount"
                  required
                  min="0"
                  step="1000"
                  value={formData.scholarship_amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="5000000"
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Durée <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  required
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Ex: 2 ans, 18 mois"
                />
              </div>

              <div>
                <label htmlFor="application_deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Date limite de candidature <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="application_deadline"
                  name="application_deadline"
                  required
                  value={formData.application_deadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de début <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="start_date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
              </div>

              <div>
                <label htmlFor="beneficiary_count" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre de bénéficiaires <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="beneficiary_count"
                  name="beneficiary_count"
                  required
                  min="1"
                  value={formData.beneficiary_count}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="10"
                />
              </div>

              <div>
                <label htmlFor="country_region" className="block text-sm font-medium text-gray-700 mb-2">
                  Pays/Région
                </label>
                <input
                  type="text"
                  id="country_region"
                  name="country_region"
                  value={formData.country_region}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Ex: Sénégal, Dakar"
                />
              </div>
            </div>
          </div>

          {/* Options de financement */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Options de financement
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="full_funding"
                  name="full_funding"
                  checked={formData.full_funding}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="full_funding" className="ml-2 block text-sm text-gray-900">
                  Financement complet
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="partial_funding"
                  name="partial_funding"
                  checked={formData.partial_funding}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="partial_funding" className="ml-2 block text-sm text-gray-900">
                  Financement partiel
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="accommodation_included"
                  name="accommodation_included"
                  checked={formData.accommodation_included}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="accommodation_included" className="ml-2 block text-sm text-gray-900">
                  Logement inclus
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="travel_expenses_included"
                  name="travel_expenses_included"
                  checked={formData.travel_expenses_included}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="travel_expenses_included" className="ml-2 block text-sm text-gray-900">
                  Frais de voyage inclus
                </label>
                </div>
            </div>
          </div>

          {/* Description et détails */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Description et détails
            </h2>
            
            <div className="space-y-6">
                    <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description détaillée <span className="text-red-500">*</span>
                        </label>
              <textarea 
                  id="description"
                name="description"
                  required
                  rows={4}
                value={formData.description}
                onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Décrivez en détail la bourse, ses objectifs et ses avantages..."
                />
              </div>

              <div>
                <label htmlFor="benefits_coverage" className="block text-sm font-medium text-gray-700 mb-2">
                  Couverture des avantages <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="benefits_coverage"
                  name="benefits_coverage"
                required
                  rows={3}
                  value={formData.benefits_coverage}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Ex: Frais de scolarité, logement, transport, matériel..."
              />
                    </div>
                    
                    <div>
                <label htmlFor="eligibility_criteria" className="block text-sm font-medium text-gray-700 mb-2">
                Critères d'éligibilité <span className="text-red-500">*</span>
                        </label>
              <textarea 
                  id="eligibility_criteria"
                  name="eligibility_criteria"
                  required
                  rows={3}
                  value={formData.eligibility_criteria}
                onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Ex: Moyenne ≥ 16/20, projet innovant, motivation..."
              />
            </div>

                    <div>
                <label htmlFor="application_process" className="block text-sm font-medium text-gray-700 mb-2">
                  Processus de candidature <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="application_process"
                  name="application_process"
                  required
                  rows={3}
                  value={formData.application_process}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Ex: Dossier complet, entretien, test technique..."
                />
              </div>
            </div>
          </div>

          {/* Informations de l'organisation */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Informations de l'organisation
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="organization_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'organisation <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="organization_name"
                  name="organization_name"
                  required
                  value={formData.organization_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Ex: Université de Dakar"
                />
              </div>

              <div>
                <label htmlFor="organization_type" className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'organisation <span className="text-red-500">*</span>
                </label>
                <select
                  id="organization_type"
                  name="organization_type"
                  required
                  value={formData.organization_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                >
                  <option value="">Sélectionnez un type</option>
                  {organizationTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700 mb-2">
                  Informations de contact <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="contact_info"
                  name="contact_info"
                  required
                  rows={3}
                  value={formData.contact_info}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Email, téléphone, adresse..."
                />
              </div>

              <div>
                <label htmlFor="official_website" className="block text-sm font-medium text-gray-700 mb-2">
                  Site web officiel
                </label>
                <input
                  type="url"
                  id="official_website"
                  name="official_website"
                  value={formData.official_website}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="https://exemple.com"
                />
              </div>

              <div>
                <label htmlFor="site_url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL du site
                </label>
                <input
                  type="url"
                  id="site_url"
                  name="site_url"
                  value={formData.site_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="https://exemple.com"
                />
              </div>

              <div>
                <label htmlFor="admin_company_logo" className="block text-sm font-medium text-gray-700 mb-2">
                  Logo de l'organisation
                </label>
                <input
                  type="file"
                  id="admin_company_logo"
                  name="admin_company_logo"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                />
                {logoPreview && (
                  <div className="mt-3 flex items-center space-x-4">
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="h-20 w-20 object-cover rounded-md border border-gray-300"
                    />
                    <span className="text-sm text-gray-600">Aperçu du logo</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Liens et informations de contact */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Liens et informations de contact
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="external_application_url" className="block text-sm font-medium text-gray-700 mb-2">
                  URL de candidature <span className="text-red-500">*</span>
                        </label>
              <input 
                  type="url"
                  id="external_application_url"
                  name="external_application_url"
                  required
                  value={formData.external_application_url}
                onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="https://exemple.com/candidature"
                />
              </div>

              <div>
                <label htmlFor="external_platform_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de la plateforme <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="external_platform_name"
                  name="external_platform_name"
                required
                  value={formData.external_platform_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                  placeholder="Ex: Plateforme officielle de l'université"
              />
                    </div>
                </div>
            </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition duration-200"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Modification...
                </span>
              ) : (
                'Modifier la bourse'
              )}
                    </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default ScholarshipsEdit;
