import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../../routers';
import Loader from '../../../../components/Loader';
import jobOfferService from '../../../../services/jobOfferService';

const JobOfferCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Métadonnées
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [jobFunctions, setJobFunctions] = useState([]);
  const [activitySectors, setActivitySectors] = useState([]);
  const [countries, setCountries] = useState([]);
  const [regions, setRegions] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    position_name: '',
    department: '',
    category: '',
    contract_type: '',
    experience_required: '',
    location: '',
    work_mode: '',
    salary_type: '',
    salary_min: '',
    salary_max: '',
    description: '',
    profile_sought: '',
    additional_info: '',
    application_deadline: '',
    cv_required: false,
    motivation_letter_required: false,
    country: '',
    region: '',
    job_function: '',
    activity_sector: '',
    closing_date: '',
    site_url: '',
    company_website_url: '',
    is_admin_only: true, // Toujours true, non affiché
    admin_company_logo: null, // Obligatoire
  });

  // Fonction utilitaire pour extraire les données (array direct ou objet avec results)
  const extractData = (data) => {
    if (Array.isArray(data)) return data;
    return data?.results || [];
  };

  // Charger les métadonnées au montage
  useEffect(() => {
    loadMetadata();
  }, []);

  // Charger les catégories quand le département change
  useEffect(() => {
    if (formData.department) {
      loadCategories(formData.department);
    } else {
      setCategories([]);
      setFormData(prev => ({ ...prev, category: '' }));
    }
  }, [formData.department]);

  // Charger les régions quand le pays change
  useEffect(() => {
    if (formData.country) {
      loadRegions(formData.country);
    } else {
      setRegions([]);
      setFormData(prev => ({ ...prev, region: '' }));
    }
  }, [formData.country]);

  const loadMetadata = async () => {
    try {
      setLoading(true);
      const [deptData, jobFuncData, sectorsData, countriesData] = await Promise.all([
        jobOfferService.getDepartments(),
        jobOfferService.getJobFunctions(),
        jobOfferService.getActivitySectors(),
        jobOfferService.getCountries(),
      ]);

      setDepartments(extractData(deptData));
      setJobFunctions(extractData(jobFuncData));
      setActivitySectors(extractData(sectorsData));
      setCountries(extractData(countriesData));
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des données');
      console.error('Erreur chargement métadonnées:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (departmentId) => {
    try {
      const data = await jobOfferService.getCategories(departmentId);
      setCategories(extractData(data));
    } catch (err) {
      console.error('Erreur chargement catégories:', err);
      setCategories([]);
    }
  };

  const loadRegions = async (countryId) => {
    try {
      const data = await jobOfferService.getRegionsByCountry(countryId);
      setRegions(extractData(data));
    } catch (err) {
      console.error('Erreur chargement régions:', err);
      setRegions([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (value === '' ? null : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation des champs obligatoires
    const requiredFields = ['title', 'position_name', 'location', 'contract_type', 'experience_required', 'work_mode', 'salary_type', 'description', 'admin_company_logo'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Veuillez remplir les champs obligatoires: ${missingFields.join(', ')}`);
      return;
    }

    // Préparer les données pour l'envoi
    const formDataToSend = new FormData();
    
    // Ajouter les champs textes
    formDataToSend.append('title', formData.title);
    formDataToSend.append('position_name', formData.position_name);
    formDataToSend.append('department', formData.department ? parseInt(formData.department) : null);
    formDataToSend.append('category', formData.category ? parseInt(formData.category) : null);
    formDataToSend.append('contract_type', formData.contract_type);
    formDataToSend.append('experience_required', formData.experience_required);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('work_mode', formData.work_mode);
    formDataToSend.append('salary_type', formData.salary_type);
    formDataToSend.append('salary_min', formData.salary_min ? parseFloat(formData.salary_min) : null);
    formDataToSend.append('salary_max', formData.salary_max ? parseFloat(formData.salary_max) : null);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('profile_sought', formData.profile_sought || '');
    formDataToSend.append('additional_info', formData.additional_info || '');
    formDataToSend.append('application_deadline', formData.application_deadline || '');
    formDataToSend.append('cv_required', formData.cv_required);
    formDataToSend.append('motivation_letter_required', formData.motivation_letter_required);
    formDataToSend.append('country', formData.country ? parseInt(formData.country) : null);
    formDataToSend.append('region', formData.region ? parseInt(formData.region) : null);
    formDataToSend.append('job_function', formData.job_function ? parseInt(formData.job_function) : null);
    formDataToSend.append('activity_sector', formData.activity_sector ? parseInt(formData.activity_sector) : null);
    formDataToSend.append('closing_date', formData.closing_date || '');
    formDataToSend.append('site_url', formData.site_url || '');
    formDataToSend.append('company_website_url', formData.company_website_url || '');
    formDataToSend.append('is_admin_only', formData.is_admin_only);
    
    // Ajouter le fichier logo
    if (formData.admin_company_logo) {
      formDataToSend.append('admin_company_logo', formData.admin_company_logo);
    }

    try {
      setSubmitting(true);
      await jobOfferService.createJobOffer(formDataToSend);
      navigate(ROUTES.ADMIN.OFFERS.JOB_OFFERS.LIST);
    } catch (err) {
      setError(err.message || 'Erreur lors de la création de l\'offre');
      console.error('Erreur création offre:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to={ROUTES.ADMIN.OFFERS.JOB_OFFERS.LIST}
            className="text-fuchsia-600 hover:text-fuchsia-700 font-semibold flex items-center space-x-2 mb-4"
          >
            <i className="fas fa-chevron-left"></i>
            <span>Retour aux offres</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Créer une nouvelle offre d'emploi</h1>
          <p className="text-gray-600 mt-1">Remplissez le formulaire pour créer une offre d'emploi</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Basic Information */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informations de base *</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Titre de l'offre *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Ex: Développeur Senior"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Intitulé du poste *
                </label>
                <input
                  type="text"
                  name="position_name"
                  value={formData.position_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Ex: Dev Backend"
                  required
                />
              </div>
            </div>
          </div>

          {/* Department & Category */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Département & Catégorie</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Département
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="">Sélectionner un département</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  disabled={!formData.department}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location & Employment Details */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Détails d'emploi *</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Localisation *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Ex: Cotonou"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de contrat *
                </label>
                <select
                  name="contract_type"
                  value={formData.contract_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="STAGE">Stage</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="TEMPS_PARTIEL">Temps partiel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mode de travail *
                </label>
                <select
                  name="work_mode"
                  value={formData.work_mode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  required
                >
                  <option value="">Sélectionner un mode</option>
                  <option value="PRESENTIEL">Présentiel</option>
                  <option value="REMOTE">Télétravail</option>
                  <option value="HYBRIDE">Hybride</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expérience requise *
                </label>
                <select
                  name="experience_required"
                  value={formData.experience_required}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  required
                >
                  <option value="">Sélectionner un niveau</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="SENIOR">Senior</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Rémunération *</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type de salaire *
                </label>
                <select
                  name="salary_type"
                  value={formData.salary_type}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="NON_PRECISE">Non précisé</option>
                  <option value="FOURCHETTE">Fourchette</option>
                  <option value="FIXE">Fixe</option>
                  <option value="NEGOCIATION">À négociation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salaire minimum
                </label>
                <input
                  type="number"
                  name="salary_min"
                  value={formData.salary_min}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Salaire maximum
                </label>
                <input
                  type="number"
                  name="salary_max"
                  value={formData.salary_max}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Description *</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description du poste *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  rows="5"
                  placeholder="Décrivez le poste, les responsabilités..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Profil recherché
                </label>
                <textarea
                  name="profile_sought"
                  value={formData.profile_sought}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  rows="4"
                  placeholder="Compétences, qualifications recherchées..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Informations supplémentaires
                </label>
                <textarea
                  name="additional_info"
                  value={formData.additional_info}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  rows="3"
                  placeholder="Avantages, informations additionnelles..."
                />
              </div>
            </div>
          </div>

          {/* Location Metadata */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Localisation détaillée</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pays
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="">Sélectionner un pays</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.id}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Région
                </label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  disabled={!formData.country}
                >
                  <option value="">Sélectionner une région</option>
                  {regions.map(region => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Metadata */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Métadonnées d'emploi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fonction de poste
                </label>
                <select
                  name="job_function"
                  value={formData.job_function}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="">Sélectionner une fonction</option>
                  {jobFunctions.map(func => (
                    <option key={func.id} value={func.id}>
                      {func.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Secteur d'activité
                </label>
                <select
                  name="activity_sector"
                  value={formData.activity_sector}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                >
                  <option value="">Sélectionner un secteur</option>
                  {activitySectors.map(sector => (
                    <option key={sector.id} value={sector.id}>
                      {sector.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Deadlines & URLs */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Dates limites & URLs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date limite de candidature
                </label>
                <input
                  type="datetime-local"
                  name="application_deadline"
                  value={formData.application_deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de clôture
                </label>
                <input
                  type="datetime-local"
                  name="closing_date"
                  value={formData.closing_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL du site de l'entreprise
                </label>
                <input
                  type="url"
                  name="company_website_url"
                  value={formData.company_website_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL du site
                </label>
                <input
                  type="url"
                  name="site_url"
                  value={formData.site_url}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Exigences</h2>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="cv_required"
                  checked={formData.cv_required}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                <span className="font-semibold text-gray-700">CV requis</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  name="motivation_letter_required"
                  checked={formData.motivation_letter_required}
                  onChange={handleChange}
                  className="w-4 h-4 rounded"
                />
                <span className="font-semibold text-gray-700">Lettre de motivation requise</span>
              </label>
            </div>
          </div>

          {/* Company Logo */}
          <div className="px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Logo de l'entreprise *</h2>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Logo de l'entreprise *
              </label>
              <input
                type="file"
                name="admin_company_logo"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setFormData(prev => ({
                    ...prev,
                    admin_company_logo: file || null
                  }));
                }}
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                required
              />
              <p className="text-xs text-gray-500 mt-2">Formats acceptés: JPG, PNG, GIF, SVG, etc.</p>
              {formData.admin_company_logo && (
                <p className="text-xs text-green-600 mt-2">
                  <i className="fas fa-check mr-1"></i>
                  {formData.admin_company_logo.name}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex gap-3 justify-end">
            <Link
              to={ROUTES.ADMIN.OFFERS.JOB_OFFERS.LIST}
              className="px-6 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Annuler
            </Link>
            <button
              type="submit"
              className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              <i className="fas fa-check mr-2"></i>
              {submitting ? 'Création en cours...' : 'Créer l\'offre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobOfferCreate;
