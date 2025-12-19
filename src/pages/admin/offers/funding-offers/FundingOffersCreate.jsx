import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../routers';
import { createFundingOffer } from '../../../../services/offersService';
import { handleApiError } from '../../../../services/api';
import FundingOfferForm from './FundingOfferForm';

const FundingOffersCreate = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setError(null);

    try {
      setSubmitting(true);

      // Préparer les données pour l'API (FormData pour gérer les fichiers)
      const submitData = new FormData();

      // Ajouter les champs texte
      submitData.append('title', formData.title);
      submitData.append('objective', formData.objective);
      submitData.append('date_limite', formData.date_limite);
      submitData.append('eligibility_criteria', formData.eligibility_criteria);
      submitData.append('countries_covered', formData.countries_covered);
      submitData.append('project_duration', formData.project_duration);
      submitData.append('contact_email', formData.contact_email);
      submitData.append('organization_name', formData.organization_name);
      submitData.append('more_info_source', formData.more_info_source);
      submitData.append('montant', formData.montant ? parseFloat(formData.montant) : '');
      submitData.append('is_external_application', formData.is_external_application);
      submitData.append('external_application_url', formData.external_application_url);
      submitData.append('company_website_url', formData.company_website_url);
      submitData.append('contact_info', formData.contact_info);
      submitData.append('site_url', formData.site_url);

      // Ajouter le fichier image s'il existe
      if (formData.admin_company_logo) {
        submitData.append('admin_company_logo', formData.admin_company_logo);
      }

      const result = await createFundingOffer(submitData);

      // Afficher le message de succès et rediriger après 2 secondes
      setTimeout(() => {
        navigate(ROUTES.ADMIN.OFFERS.FUNDING_OFFERS.LIST);
      }, 2000);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FundingOfferForm
      mode="create"
      submitting={submitting}
      error={error}
      onSubmit={handleSubmit}
    />
  );
};

export default FundingOffersCreate;
