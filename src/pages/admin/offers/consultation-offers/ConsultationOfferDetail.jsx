import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../../routers';
import Loader from '../../../../components/Loader';
import { getConsultationOfferDetail, approveConsultationOffer, rejectConsultationOffer } from '../../../../services/offersService';
import { handleApiError } from '../../../../services/api';

const ConsultationOfferDetail = () => {
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
      const data = await getConsultationOfferDetail(id);
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
      await approveConsultationOffer(id);
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
      await rejectConsultationOffer(id, reason);
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
    // Si is_admin_only est true, utiliser le logo de company_details
    // Sinon utiliser admin_company_logo
    if (offer.is_admin_only) {
      return offer.company_details?.logo || offer.admin_company_logo || null;
    } else {
      return offer.admin_company_logo || offer.company_details?.logo || null;
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
            to={ROUTES.ADMIN.OFFERS.CONSULTATION_OFFERS.LIST}
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
                    {offer.company_details?.company_name && (
                      <p className="text-gray-600 mt-1">
                        <i className="fas fa-building mr-2"></i>
                        {offer.company_details.company_name}
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

            {/* Détails de l'entreprise */}
            {offer.company_details && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Détails de l'entreprise</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {offer.company_details.company_name && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Nom</p>
                      <p className="text-sm text-gray-900 mt-1">{offer.company_details.company_name}</p>
                    </div>
                  )}
                  {offer.company_details.sector && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Secteur</p>
                      <p className="text-sm text-gray-900 mt-1">{offer.company_details.sector}</p>
                    </div>
                  )}
                  {offer.company_details.company_size && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Taille</p>
                      <p className="text-sm text-gray-900 mt-1">{offer.company_details.company_size}</p>
                    </div>
                  )}
                  {offer.company_details.contact_email && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Email</p>
                      <p className="text-sm text-gray-900 mt-1">{offer.company_details.contact_email}</p>
                    </div>
                  )}
                  {offer.company_details.contact_phone && offer.company_details.contact_phone !== 'Non disponible' && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Téléphone</p>
                      <p className="text-sm text-gray-900 mt-1">{offer.company_details.contact_phone}</p>
                    </div>
                  )}
                  {offer.company_details.description && (
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-3">
                      <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Description</p>
                      <p className="text-sm text-gray-900 mt-1">{offer.company_details.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Localisation */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Localisation</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Pays</p>
                  <p className="text-sm text-gray-900 mt-1">{offer.country?.name || offer.company_details?.country || 'Non spécifiée'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Région</p>
                  <p className="text-sm text-gray-900 mt-1">{offer.region?.name || offer.company_details?.region || 'Non spécifiée'}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {offer.description || 'Aucune description'}
                </p>
              </div>
            </div>

            {/* Documents */}
            {offer.documents && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Documents joints</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <a 
                    href={offer.documents.startsWith('http') ? offer.documents : `http://localhost:8000${offer.documents}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 font-semibold"
                  >
                    <i className="fas fa-file-pdf"></i>
                    Télécharger le document
                  </a>
                </div>
              </div>
            )}

            {/* Site URL */}
            {offer.site_url && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Site Web</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <a 
                    href={offer.site_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 font-semibold"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    {offer.site_url}
                  </a>
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
              onClick={() => navigate(ROUTES.ADMIN.OFFERS.CONSULTATION_OFFERS.LIST)}
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

export default ConsultationOfferDetail;
