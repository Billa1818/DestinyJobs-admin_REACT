import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../routers';
import {
  getFundingOfferDetail,
  updateFundingOffer,
} from '../../../../services/offersService';
import { handleApiError } from '../../../../services/api';
import FundingOfferForm from './FundingOfferForm';

const FundingOffersEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [offerData, setOfferData] = useState(null);

  useEffect(() => {
    loadOfferDetail();
  }, [id]);

  const loadOfferDetail = async () => {
    try {
      setLoading(true);
      const data = await getFundingOfferDetail(id);
      setOfferData(data);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setError(null);

    try {
      setSubmitting(true);

      // Si un nouveau fichier est sélectionné, utiliser FormData
      if (formData.admin_company_logo && formData.admin_company_logo instanceof File) {
        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('objective', formData.objective);
        submitData.append('date_limite', formData.date_limite);
        submitData.append('eligibility_criteria', formData.eligibility_criteria);
        submitData.append('countries_covered', formData.countries_covered);
        submitData.append('project_duration', formData.project_duration);
        submitData.append('contact_email', formData.contact_email);
        submitData.append('organization_name', formData.organization_name);
        submitData.append('more_info_source', formData.more_info_source);
        submitData.append('montant', formData.montant ? parseFloat(formData.montant) : null);
        submitData.append('is_external_application', formData.is_external_application);
        submitData.append('external_application_url', formData.external_application_url);
        submitData.append('company_website_url', formData.company_website_url);
        submitData.append('contact_info', formData.contact_info);
        submitData.append('site_url', formData.site_url);
        submitData.append('admin_company_logo', formData.admin_company_logo);

        await updateFundingOffer(id, submitData);
      } else {
        // Sinon, utiliser un objet JSON
        const submitData = {
          title: formData.title,
          objective: formData.objective,
          date_limite: formData.date_limite,
          eligibility_criteria: formData.eligibility_criteria,
          countries_covered: formData.countries_covered,
          project_duration: formData.project_duration,
          contact_email: formData.contact_email,
          organization_name: formData.organization_name,
          more_info_source: formData.more_info_source,
          montant: formData.montant ? parseFloat(formData.montant) : null,
          is_external_application: formData.is_external_application,
          external_application_url: formData.external_application_url,
          company_website_url: formData.company_website_url,
          contact_info: formData.contact_info,
          site_url: formData.site_url,
        };

        await updateFundingOffer(id, submitData);
      }

      navigate(ROUTES.ADMIN.OFFERS.FUNDING_OFFERS.DETAIL(id));
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FundingOfferForm
      mode="edit"
      offerId={id}
      initialData={offerData}
      loading={loading}
      submitting={submitting}
      error={error}
      onSubmit={handleSubmit}
    />
  );
};

export default FundingOffersEdit;
