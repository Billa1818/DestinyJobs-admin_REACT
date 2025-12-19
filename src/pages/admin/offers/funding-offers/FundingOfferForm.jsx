import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../routers';
import Loader from '../../../../components/Loader';

const FundingOfferForm = ({ 
  mode = 'create', 
  offerId = null, 
  initialData = null,
  loading = false,
  submitting = false,
  error = null,
  onSubmit 
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    date_limite: '',
    eligibility_criteria: '',
    countries_covered: '',
    project_duration: '',
    contact_email: '',
    organization_name: '',
    more_info_source: '',
    montant: '',
    is_external_application: false,
    external_application_url: '',
    company_website_url: '',
    contact_info: '',
    site_url: '',
    admin_company_logo: null,
  });

  const [previewLogo, setPreviewLogo] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        objective: initialData.objective || '',
        date_limite: initialData.date_limite ? initialData.date_limite.split('T')[0] : '',
        eligibility_criteria: initialData.eligibility_criteria || '',
        countries_covered: initialData.countries_covered || '',
        project_duration: initialData.project_duration || '',
        contact_email: initialData.contact_email || '',
        organization_name: initialData.organization_name || '',
        more_info_source: initialData.more_info_source || '',
        montant: initialData.montant || '',
        is_external_application: initialData.is_external_application || false,
        external_application_url: initialData.external_application_url || '',
        company_website_url: initialData.company_website_url || '',
        contact_info: initialData.contact_info || '',
        site_url: initialData.site_url || '',
        admin_company_logo: null,
      });

      // Set preview if there's an existing logo
      if (initialData.admin_company_logo) {
        setPreviewLogo(initialData.admin_company_logo);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    }));

    // Handle file preview
    if (type === 'file' && files[0]) {
      setPreviewLogo(URL.createObjectURL(files[0]));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      alert('Le titre est obligatoire');
      return;
    }

    if (!formData.organization_name.trim()) {
      alert("Le nom de l'organisation est obligatoire");
      return;
    }

    if (!formData.contact_email.trim()) {
      alert('L\'email de contact est obligatoire');
      return;
    }

    if (!formData.objective.trim()) {
      alert('L\'objectif est obligatoire');
      return;
    }

    if (!formData.eligibility_criteria.trim()) {
      alert('Les critères d\'éligibilité sont obligatoires');
      return;
    }

    if (!formData.countries_covered.trim()) {
      alert('Les pays couverts sont obligatoires');
      return;
    }

    if (!formData.project_duration.trim()) {
      alert('La durée du projet est obligatoire');
      return;
    }

    if (!formData.contact_info.trim()) {
      alert('Les informations de contact sont obligatoires');
      return;
    }

    if (!formData.company_website_url.trim()) {
      alert('Le site web de l\'entreprise est obligatoire');
      return;
    }

    if (!formData.more_info_source.trim()) {
      alert('La source d\'information est obligatoire');
      return;
    }

    if (formData.is_external_application && !formData.external_application_url.trim()) {
      alert('L\'URL d\'application externe est obligatoire');
      return;
    }

    onSubmit(formData);
  };

  const getBackButtonRoute = () => {
    if (mode === 'edit' && offerId) {
      return ROUTES.ADMIN.OFFERS.FUNDING_OFFERS.DETAIL(offerId);
    }
    return ROUTES.ADMIN.OFFERS.FUNDING_OFFERS.LIST;
  };

  const getBackButtonLabel = () => {
    return mode === 'edit' ? 'Retour aux détails' : 'Retour à la liste';
  };

  const getSubmitButtonLabel = () => {
    return mode === 'edit' 
      ? submitting ? 'Enregistrement...' : 'Enregistrer'
      : submitting ? 'Création...' : 'Créer l\'offre';
  };

  const getTitle = () => {
    return mode === 'edit' 
      ? 'Éditer l\'offre de financement'
      : 'Créer une offre de financement';
  };

  const getSubtitle = () => {
    return mode === 'edit'
      ? 'Mettez à jour les informations de l\'offre'
      : 'Ajoutez une nouvelle offre de financement à la plateforme';
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(getBackButtonRoute())}
            className="text-fuchsia-600 hover:text-fuchsia-700 mb-4 flex items-center space-x-2"
          >
            <i className="fas fa-arrow-left"></i>
            <span>{getBackButtonLabel()}</span>
          </button>

          <h1 className="text-4xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-gray-600 mt-2">{getSubtitle()}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {mode === 'create' && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg hidden" id="successMessage">
            <i className="fas fa-check-circle mr-2"></i>
            <span>Offre de financement créée avec succès! Redirection en cours...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleFormSubmit} className="bg-white rounded-lg shadow">
          <div className="p-8 space-y-8">
            {/* Informations Principales */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations principales</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-gray-900 mb-2">
                    Titre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ex: Financement pour startup technologique"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="organization_name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Organisation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="organization_name"
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleChange}
                    placeholder="Ex: Nom de l'organisation"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="montant" className="block text-sm font-semibold text-gray-900 mb-2">
                    Montant (EUR)
                  </label>
                  <input
                    type="number"
                    id="montant"
                    name="montant"
                    value={formData.montant}
                    onChange={handleChange}
                    placeholder="Ex: 50000"
                    step="0.01"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="date_limite" className="block text-sm font-semibold text-gray-900 mb-2">
                    Date limite
                  </label>
                  <input
                    type="date"
                    id="date_limite"
                    name="date_limite"
                    value={formData.date_limite}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="project_duration" className="block text-sm font-semibold text-gray-900 mb-2">
                    Durée du projet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="project_duration"
                    name="project_duration"
                    value={formData.project_duration}
                    onChange={handleChange}
                    placeholder="Ex: 12 mois"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="countries_covered" className="block text-sm font-semibold text-gray-900 mb-2">
                    Pays couverts <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="countries_covered"
                    name="countries_covered"
                    value={formData.countries_covered}
                    onChange={handleChange}
                    placeholder="Ex: France,Belgique,Suisse"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Description</h2>

              <div className="space-y-6">
                <div>
                  <label htmlFor="objective" className="block text-sm font-semibold text-gray-900 mb-2">
                    Objectif <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="objective"
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    placeholder="Décrivez l'objectif du financement..."
                    rows="5"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="eligibility_criteria" className="block text-sm font-semibold text-gray-900 mb-2">
                    Critères d'éligibilité <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="eligibility_criteria"
                    name="eligibility_criteria"
                    value={formData.eligibility_criteria}
                    onChange={handleChange}
                    placeholder="Décrivez les critères d'éligibilité..."
                    rows="5"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Informations de Contact */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations de contact</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="contact_email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email de contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="contact_email"
                    name="contact_email"
                    value={formData.contact_email}
                    onChange={handleChange}
                    placeholder="contact@example.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="contact_info" className="block text-sm font-semibold text-gray-900 mb-2">
                    Informations supplémentaires <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="contact_info"
                    name="contact_info"
                    value={formData.contact_info}
                    onChange={handleChange}
                    placeholder="Informations supplémentaires de contact"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="company_website_url" className="block text-sm font-semibold text-gray-900 mb-2">
                    Site web de l'entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="company_website_url"
                    name="company_website_url"
                    value={formData.company_website_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="more_info_source" className="block text-sm font-semibold text-gray-900 mb-2">
                    Source d'information <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="more_info_source"
                    name="more_info_source"
                    value={formData.more_info_source}
                    onChange={handleChange}
                    placeholder="Ex: Site web, appel d'offres"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="site_url" className="block text-sm font-semibold text-gray-900 mb-2">
                    URL du site
                  </label>
                  <input
                    type="url"
                    id="site_url"
                    name="site_url"
                    value={formData.site_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Logo de l'entreprise */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Logo de l'entreprise</h2>

              <div>
                <label htmlFor="admin_company_logo" className="block text-sm font-semibold text-gray-900 mb-2">
                  Logo de l'entreprise (Image)
                </label>
                <div className="flex items-center justify-center px-6 py-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-fuchsia-400 transition-colors cursor-pointer">
                  <label htmlFor="admin_company_logo" className="w-full cursor-pointer text-center">
                    <div>
                      <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3 block"></i>
                      <p className="text-gray-600 font-semibold">
                        {formData.admin_company_logo
                          ? formData.admin_company_logo.name
                          : 'Cliquez pour ajouter une image ou glissez-déposez'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF (Max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      id="admin_company_logo"
                      name="admin_company_logo"
                      onChange={handleChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </label>
                </div>
                {previewLogo && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Aperçu:</p>
                    <img
                      src={previewLogo}
                      alt="Aperçu du logo"
                      className="h-32 w-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Application Externe */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Application externe</h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_external_application"
                    name="is_external_application"
                    checked={formData.is_external_application}
                    onChange={handleChange}
                    className="w-4 h-4 text-fuchsia-600 rounded focus:ring-2 focus:ring-fuchsia-500"
                  />
                  <label htmlFor="is_external_application" className="ml-3 text-gray-900">
                    Cette offre utilise une application externe
                  </label>
                </div>

                {formData.is_external_application && (
                  <div>
                    <label htmlFor="external_application_url" className="block text-sm font-semibold text-gray-900 mb-2">
                      URL d'application externe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      id="external_application_url"
                      name="external_application_url"
                      value={formData.external_application_url}
                      onChange={handleChange}
                      placeholder="https://example.com/apply"
                      required={formData.is_external_application}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="border-t border-gray-200 bg-gray-50 px-8 py-6 flex justify-end space-x-4 rounded-b-lg">
            <button
              type="button"
              onClick={() => navigate(getBackButtonRoute())}
              disabled={submitting}
              className="px-6 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <i className={`fas fa-${submitting ? 'spinner fa-spin' : 'save'}`}></i>
              <span>{getSubmitButtonLabel()}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FundingOfferForm;
