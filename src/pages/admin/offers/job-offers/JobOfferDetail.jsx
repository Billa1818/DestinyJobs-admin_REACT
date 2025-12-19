import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../../routers';
import Loader from '../../../../components/Loader';
import { getJobOfferDetail, approveOffer, rejectOffer } from '../../../../services/offersService';
import { handleApiError } from '../../../../services/api';

const JobOfferDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Charger les détails de l'offre
  useEffect(() => {
    loadOfferDetail();
  }, [id]);

  const loadOfferDetail = async () => {
    try {
      setLoading(true);
      const data = await getJobOfferDetail(id);
      setOffer(data);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir approuver cette offre ?')) return;

    try {
      setActionLoading(true);
      await approveOffer(id);
      await loadOfferDetail();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    try {
      setActionLoading(true);
      await rejectOffer(id, reason);
      await loadOfferDetail();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'PENDING_APPROVAL': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-blue-100 text-blue-800',
      'PUBLISHED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'EXPIRED': 'bg-orange-100 text-orange-800',
      'CLOSED': 'bg-gray-500 text-white'
    };
    return colors[status] || colors['DRAFT'];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getLogoUrl = () => {
    // Système de priorité pour les images
    // Si is_admin_only est true, utiliser le logo admin
    // Sinon utiliser le logo du recruteur
    if (offer.is_admin_only) {
      return offer.admin_company_logo || offer.recruiter?.logo || null;
    } else {
      return offer.recruiter?.logo || offer.admin_company_logo || null;
    }
  };

  if (loading) return <Loader />;

  if (!offer) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">Offre non trouvée</p>
          </div>
        </div>
      </div>
    );
  }

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
        </div>

        {/* Messages d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-fuchsia-50 to-transparent">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  {getLogoUrl() && (
                    <img 
                      src={getLogoUrl()} 
                      alt="Logo"
                      className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{offer.title}</h1>
                    {offer.recruiter?.company_name && (
                      <p className="text-gray-600 mt-1">
                        <i className="fas fa-building mr-2"></i>
                        {offer.recruiter.company_name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(offer.status)}`}>
                    {offer.status?.replace(/_/g, ' ')}
                  </span>
                  {offer.is_admin_only && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                      Admin uniquement
                    </span>
                  )}
                  {offer.is_urgent && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                      <i className="fas fa-fire mr-1"></i>Urgent
                    </span>
                  )}
                  {offer.is_sponsored && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                      <i className="fas fa-star mr-1"></i>Sponsorisée
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {offer.status === 'PENDING_APPROVAL' && (
                <div className="flex gap-2">
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-check"></i>
                    Approuver
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-times"></i>
                    Rejeter
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-6 space-y-8">
            {/* Informations générales */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations générales</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Créée par</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {offer.recruiter?.username || 'N/A'} ({offer.recruiter?.email || 'N/A'})
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Vues</p>
                  <p className="text-sm text-gray-900 mt-1">
                    <i className="fas fa-eye mr-1"></i>
                    {offer.views_count || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Date de création</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(offer.created_at)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Dernière mise à jour</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(offer.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Détails spécifiques aux offres d'emploi */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Détails du poste</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {offer.position_name && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Intitulé</p>
                    <p className="text-sm text-gray-900 mt-1 font-semibold">{offer.position_name}</p>
                  </div>
                )}
                {offer.contract_type && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Type de contrat</p>
                    <p className="text-sm text-gray-900 mt-1">{offer.contract_type}</p>
                  </div>
                )}
                {offer.work_mode && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Mode de travail</p>
                    <p className="text-sm text-gray-900 mt-1">{offer.work_mode}</p>
                  </div>
                )}
                {offer.experience_required && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Expérience requise</p>
                    <p className="text-sm text-gray-900 mt-1">{offer.experience_required}</p>
                  </div>
                )}
                {offer.category?.name && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Catégorie</p>
                    <p className="text-sm text-gray-900 mt-1">{offer.category.name}</p>
                  </div>
                )}
                {offer.department?.name && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Département</p>
                    <p className="text-sm text-gray-900 mt-1">{offer.department.name}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Salaire et localisation */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Salaire et localisation</h2>
              <div className="grid grid-cols-2 gap-4">
                {offer.salary_range && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Salaire</p>
                    <p className="text-sm text-gray-900 mt-1 font-semibold text-green-600">{offer.salary_range}</p>
                    {offer.salary_type === 'FOURCHETTE' && (
                      <div className="text-xs text-gray-600 mt-2 space-y-1">
                        {offer.salary_min && <p>Min: <span className="font-semibold">{offer.salary_min} FCFA</span></p>}
                        {offer.salary_max && <p>Max: <span className="font-semibold">{offer.salary_max} FCFA</span></p>}
                      </div>
                    )}
                  </div>
                )}
                {offer.location && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Localisation</p>
                    <p className="text-sm text-gray-900 mt-1">{offer.location}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Localisation détaillée */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Localisation détaillée</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Pays</p>
                  <p className="text-sm text-gray-900 mt-1">{offer.country?.name || 'Non spécifié'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Région</p>
                  <p className="text-sm text-gray-900 mt-1">{offer.region?.name || 'Non spécifiée'}</p>
                </div>
              </div>
            </div>

            {/* Description du poste */}
            {offer.description && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description du poste</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {offer.description}
                  </p>
                </div>
              </div>
            )}

            {/* Profil recherché */}
            {offer.profile_sought && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Profil recherché</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {offer.profile_sought}
                  </p>
                </div>
              </div>
            )}

            {/* Informations supplémentaires */}
            {offer.additional_info && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informations supplémentaires</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {offer.additional_info}
                  </p>
                </div>
              </div>
            )}

            {/* Exigences et dates clés */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Exigences et dates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-3">Exigences</p>
                  <div className="space-y-2">
                    {offer.cv_required && (
                      <div className="flex items-center gap-2 text-sm">
                        <i className="fas fa-check text-green-600"></i>
                        <span>CV requis</span>
                      </div>
                    )}
                    {offer.motivation_letter_required && (
                      <div className="flex items-center gap-2 text-sm">
                        <i className="fas fa-check text-green-600"></i>
                        <span>Lettre de motivation requise</span>
                      </div>
                    )}
                    {!offer.cv_required && !offer.motivation_letter_required && (
                      <p className="text-sm text-gray-500">Aucune exigence supplémentaire</p>
                    )}
                  </div>
                </div>
                {offer.application_deadline && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Date limite de candidature</p>
                    <p className="text-sm text-gray-900 mt-1 font-semibold">{new Date(offer.application_deadline).toLocaleDateString('fr-FR')}</p>
                    {offer.is_expired && (
                      <p className="text-xs text-red-600 mt-2">
                        <i className="fas fa-exclamation-circle mr-1"></i>Expirée
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Recruteur */}
            {offer.recruiter && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Informations du recruteur</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {offer.recruiter.company_name && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Entreprise</p>
                      <p className="text-sm text-gray-900 mt-1">{offer.recruiter.company_name}</p>
                    </div>
                  )}
                  {offer.recruiter.sector && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Secteur</p>
                      <p className="text-sm text-gray-900 mt-1">{offer.recruiter.sector}</p>
                    </div>
                  )}
                  {offer.recruiter.company_size && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Taille</p>
                      <p className="text-sm text-gray-900 mt-1">{offer.recruiter.company_size}</p>
                    </div>
                  )}
                  {offer.recruiter.email && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Email</p>
                      <p className="text-sm text-gray-900 mt-1 break-all">{offer.recruiter.email}</p>
                    </div>
                  )}
                  {offer.recruiter.website && (
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Site web</p>
                      <a 
                        href={offer.recruiter.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-fuchsia-600 hover:text-fuchsia-700 mt-1 break-all"
                      >
                        {offer.recruiter.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rejection Reason */}
            {offer.rejection_reason && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Raison du rejet</h2>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-700">{offer.rejection_reason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex gap-4">
            <button
              onClick={() => navigate(ROUTES.ADMIN.OFFERS.JOB_OFFERS.LIST)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Retour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobOfferDetail;
