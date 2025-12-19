import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../../routers';
import Loader from '../../../../components/Loader';
import bourseService from '../../../../services/bourseService';

const ScholarshipsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadScholarshipDetail();
  }, [id]);

  const loadScholarshipDetail = async () => {
    try {
      setLoading(true);
      const data = await bourseService.getScholarshipDetail(id);
      setScholarship(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des détails');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir approuver cette bourse ?')) return;

    try {
      setActionLoading(true);
      await bourseService.approveScholarship(id);
      await loadScholarshipDetail();
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'approbation');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    const reason = prompt('Raison du rejet:');
    if (!reason) return;

    try {
      setActionLoading(true);
      await bourseService.rejectScholarship(id, reason);
      await loadScholarshipDetail();
    } catch (err) {
      setError(err.message || 'Erreur lors du rejet');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Confirmer la suppression?')) return;

    try {
      await bourseService.deleteScholarship(id);
      navigate(ROUTES.ADMIN.OFFERS.SCHOLARSHIPS.LIST);
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'PENDING_APPROVAL': 'bg-yellow-100 text-yellow-800',
      'APPROVED': 'bg-blue-100 text-blue-800',
      'ACTIVE': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'EXPIRED': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || colors['DRAFT'];
  };

  const getLogoUrl = () => {
    if (scholarship.is_admin_only) {
      return scholarship.admin_company_logo || scholarship.company_logo || null;
    }
    return scholarship.company_logo || scholarship.admin_company_logo || null;
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

  const formatAmount = (amount) => {
    if (!amount) return 'N/A';
    return parseFloat(amount).toLocaleString('fr-FR', { maximumFractionDigits: 0 });
  };

  if (loading) return <Loader />;

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">Bourse non trouvée</p>
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
            to={ROUTES.ADMIN.OFFERS.SCHOLARSHIPS.LIST}
            className="text-fuchsia-600 hover:text-fuchsia-700 font-semibold flex items-center space-x-2 mb-4"
          >
            <i className="fas fa-chevron-left"></i>
            <span>Retour aux bourses</span>
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
                      src={getLogoUrl().startsWith('http') ? getLogoUrl() : `http://localhost:8000${getLogoUrl()}`}
                      alt="Logo"
                      className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{scholarship.title}</h1>
                    {scholarship.organization_name && (
                      <p className="text-gray-600 mt-1">
                        <i className="fas fa-building mr-2"></i>
                        {scholarship.organization_name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(scholarship.status)}`}>
                    {scholarship.status?.replace(/_/g, ' ')}
                  </span>
                  {scholarship.is_admin_only && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800">
                      Admin uniquement
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              {scholarship.status === 'PENDING_APPROVAL' && (
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
                    {scholarship.recruiter?.username || 'N/A'} ({scholarship.recruiter?.email || 'N/A'})
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Vues</p>
                  <p className="text-sm text-gray-900 mt-1">
                    <i className="fas fa-eye mr-1"></i>
                    {scholarship.views_count || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Date de création</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(scholarship.created_at)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Dernière mise à jour</p>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(scholarship.updated_at)}</p>
                </div>
              </div>
            </div>

            {/* Détails spécifiques aux bourses */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Détails de la bourse</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {scholarship.scholarship_type && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Type</p>
                    <p className="text-sm text-gray-900 mt-1">{scholarship.scholarship_type.name}</p>
                  </div>
                )}
                {scholarship.required_level && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Niveau requis</p>
                    <p className="text-sm text-gray-900 mt-1">{scholarship.required_level}</p>
                  </div>
                )}
                {scholarship.study_domain && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Domaine</p>
                    <p className="text-sm text-gray-900 mt-1">{scholarship.study_domain.name}</p>
                  </div>
                )}
                {scholarship.scholarship_amount && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Montant</p>
                    <p className="text-sm text-gray-900 mt-1 font-semibold text-green-600">
                      {formatAmount(scholarship.scholarship_amount)} FCFA
                    </p>
                  </div>
                )}
                {scholarship.duration && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Durée</p>
                    <p className="text-sm text-gray-900 mt-1">{scholarship.duration}</p>
                  </div>
                )}
                {scholarship.beneficiary_count && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Bénéficiaires</p>
                    <p className="text-sm text-gray-900 mt-1">{scholarship.beneficiary_count}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Financement */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Type de financement</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Financement complet</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {scholarship.full_funding ? 'Oui' : 'Non'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Financement partiel</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {scholarship.partial_funding ? 'Oui' : 'Non'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Hébergement inclus</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {scholarship.accommodation_included ? 'Oui' : 'Non'}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Frais de voyage inclus</p>
                  <p className="text-sm text-gray-900 mt-1">
                    {scholarship.travel_expenses_included ? 'Oui' : 'Non'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            {scholarship.description && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {scholarship.description}
                  </p>
                </div>
              </div>
            )}

            {/* Avantages */}
            {scholarship.benefits_coverage && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Couverture des avantages</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {scholarship.benefits_coverage}
                  </p>
                </div>
              </div>
            )}

            {/* Critères d'éligibilité */}
            {scholarship.eligibility_criteria && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Critères d'éligibilité</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {scholarship.eligibility_criteria}
                  </p>
                </div>
              </div>
            )}

            {/* Processus de candidature */}
            {scholarship.application_process && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Processus de candidature</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {scholarship.application_process}
                  </p>
                </div>
              </div>
            )}

            {/* Dates importantes */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Dates importantes</h2>
              <div className="grid grid-cols-2 gap-4">
                {scholarship.application_deadline && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Date limite de candidature</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(scholarship.application_deadline).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
                {scholarship.start_date && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Date de début</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(scholarship.start_date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Informations de contact */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h2>
              <div className="grid grid-cols-2 gap-4">
                {scholarship.contact_info && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Informations supplémentaires</p>
                    <p className="text-sm text-gray-900 mt-1">{scholarship.contact_info}</p>
                  </div>
                )}
                {scholarship.official_website && (
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Site officiel</p>
                    <a
                      href={scholarship.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-fuchsia-600 hover:text-fuchsia-700 mt-1 break-all"
                    >
                      {scholarship.official_website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* URL d'application externe */}
            {scholarship.is_external_application && scholarship.external_application_url && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Application externe</h2>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <a
                    href={scholarship.external_application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 font-semibold"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    {scholarship.external_application_url}
                  </a>
                </div>
              </div>
            )}

            {/* Raison du rejet */}
            {scholarship.rejection_reason && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Raison du rejet</h2>
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <p className="text-red-700">{scholarship.rejection_reason}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex gap-4">
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScholarshipsDetail;
