import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../../../../routers';
import Loader from '../../../../components/Loader';
import {
    getFundingOfferDetail,
    approveFundingOffer,
    rejectFundingOffer,
} from '../../../../services/offersService';
import { handleApiError } from '../../../../services/api';

const FundingOffersDetail = () => {
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
            const data = await getFundingOfferDetail(id);
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
            await approveFundingOffer(id);
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
            await rejectFundingOffer(id, reason);
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
        // Système de priorité pour les images
        // Si is_admin_only est true, utiliser admin_company_logo
        // Sinon utiliser company_logo ou company_details.logo
        if (offer.is_admin_only) {
            return offer.admin_company_logo || offer.company_logo || offer.company_details?.logo || null;
        } else {
            return offer.company_logo || offer.admin_company_logo || offer.company_details?.logo || null;
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
                        to={ROUTES.ADMIN.OFFERS.FUNDING_OFFERS.LIST}
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
                                        {offer.organization_name && (
                                            <p className="text-gray-600 mt-1">
                                                <i className="fas fa-building mr-2"></i>
                                                {offer.organization_name}
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

                        {/* Détails spécifiques aux offres de financement */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Détails du financement</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {offer.montant && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Montant</p>
                                        <p className="text-sm text-gray-900 mt-1 font-semibold text-green-600">
                                            {parseFloat(offer.montant).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA
                                        </p>
                                    </div>
                                )}
                                {offer.date_limite && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Date limite</p>
                                        <p className="text-sm text-gray-900 mt-1">{new Date(offer.date_limite).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                )}
                                {offer.project_duration && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Durée du projet</p>
                                        <p className="text-sm text-gray-900 mt-1">{offer.project_duration}</p>
                                    </div>
                                )}
                                {offer.countries_covered && (
                                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Pays couverts</p>
                                        <p className="text-sm text-gray-900 mt-1">{offer.countries_covered}</p>
                                    </div>
                                )}
                                {offer.is_external_application && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Type d'application</p>
                                        <p className="text-sm text-gray-900 mt-1">Application externe</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Localisation */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Localisation</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Pays</p>
                                    <p className="text-sm text-gray-900 mt-1">{offer.country?.name || 'Non spécifiée'}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Région</p>
                                    <p className="text-sm text-gray-900 mt-1">{offer.region?.name || 'Non spécifiée'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Objectif */}
                        {offer.objective && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Objectif</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {offer.objective}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Critères d'éligibilité */}
                        {offer.eligibility_criteria && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Critères d'éligibilité</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {offer.eligibility_criteria}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Informations de contact */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Informations de contact</h2>
                            <div className="grid grid-cols-2 gap-4">
                                {offer.contact_email && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Email</p>
                                        <p className="text-sm text-gray-900 mt-1 break-all">{offer.contact_email}</p>
                                    </div>
                                )}
                                {offer.contact_info && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Informations supplémentaires</p>
                                        <p className="text-sm text-gray-900 mt-1">{offer.contact_info}</p>
                                    </div>
                                )}
                                {offer.company_website_url && (
                                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Site web</p>
                                        <a
                                            href={offer.company_website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-fuchsia-600 hover:text-fuchsia-700 mt-1 break-all"
                                        >
                                            {offer.company_website_url}
                                        </a>
                                    </div>
                                )}
                                {offer.more_info_source && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Source d'information</p>
                                        <p className="text-sm text-gray-900 mt-1">{offer.more_info_source}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* URL d'application externe */}
                        {offer.is_external_application && offer.external_application_url && (
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Application externe</h2>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <a
                                        href={offer.external_application_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-fuchsia-600 hover:text-fuchsia-700 font-semibold"
                                    >
                                        <i className="fas fa-external-link-alt"></i>
                                        {offer.external_application_url}
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
                            onClick={() => navigate(ROUTES.ADMIN.OFFERS.FUNDING_OFFERS.LIST)}
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

export default FundingOffersDetail;
