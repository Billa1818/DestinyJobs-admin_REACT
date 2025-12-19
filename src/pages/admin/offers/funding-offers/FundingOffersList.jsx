import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../routers';
import Loader from '../../../../components/Loader';
import { getAdminFundingOffers, approveFundingOffer, rejectFundingOffer, deleteFundingOffer, approveOffersInBulk, rejectOffersInBulk } from '../../../../services/offersService';
import { handleApiError } from '../../../../services/api';

const FundingOffersList = () => {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOffers, setSelectedOffers] = useState(new Set());
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [filterAdminOnly, setFilterAdminOnly] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadOffers();
    }, [filterStatus, filterAdminOnly]);

    const loadOffers = async () => {
        try {
            setLoading(true);

            // Construire les paramètres de filtre
            const params = {};
            if (filterStatus !== 'ALL') {
                params.status = filterStatus;
            }

            // Ajouter le filtre admin_only
            if (filterAdminOnly) {
                params.is_admin_only = 'true';
            }

            // Récupérer les offres via l'endpoint admin
            const data = await getAdminFundingOffers(params);

            // Gérer la réponse structurée de l'API
            if (data.results && Array.isArray(data.results)) {
                setOffers(data.results);
                setStatistics(data.admin_statistics || null);
            } else if (Array.isArray(data)) {
                setOffers(data);
                setStatistics(null);
            } else {
                setOffers([]);
                setStatistics(null);
            }
            setError(null);
        } catch (err) {
            setError(handleApiError(err));
            setOffers([]);
            setStatistics(null);
        } finally {
            setLoading(false);
        }
    };

    const filteredOffers = offers.filter(offer => {
        const matchesSearch = offer.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            offer.organization_name?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const toggleSelection = (offerId) => {
        const newSelected = new Set(selectedOffers);
        if (newSelected.has(offerId)) {
            newSelected.delete(offerId);
        } else {
            newSelected.add(offerId);
        }
        setSelectedOffers(newSelected);
    };

    const toggleSelectAll = () => {
        if (selectedOffers.size === filteredOffers.length) {
            setSelectedOffers(new Set());
        } else {
            setSelectedOffers(new Set(filteredOffers.map(o => o.id)));
        }
    };

    const handleApprove = async (offerId) => {
        try {
            setActionLoading(true);
            await approveFundingOffer(offerId);
            await loadOffers();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async (offerId) => {
        const reason = prompt('Raison du rejet:');
        if (!reason) return;

        try {
            setActionLoading(true);
            await rejectFundingOffer(offerId, reason);
            await loadOffers();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (offerId) => {
        if (!window.confirm('Confirmer la suppression?')) return;

        try {
            setActionLoading(true);
            await deleteFundingOffer(offerId);
            await loadOffers();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkApprove = async () => {
        if (selectedOffers.size === 0) return;

        try {
            setActionLoading(true);
            await approveOffersInBulk(Array.from(selectedOffers));
            setSelectedOffers(new Set());
            await loadOffers();
        } catch (err) {
            setError(handleApiError(err));
        } finally {
            setActionLoading(false);
        }
    };

    const handleBulkReject = async () => {
        if (selectedOffers.size === 0) return;

        const reason = prompt('Raison du rejet:');
        if (!reason) return;

        try {
            setActionLoading(true);
            await rejectOffersInBulk(Array.from(selectedOffers), reason);
            setSelectedOffers(new Set());
            await loadOffers();
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
            'ACTIVE': 'bg-green-100 text-green-800',
            'REJECTED': 'bg-red-100 text-red-800',
            'EXPIRED': 'bg-orange-100 text-orange-800'
        };
        return colors[status] || colors['DRAFT'];
    };

    const getLogoUrl = (offer) => {
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

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Offres de Financement</h1>
                        <p className="text-gray-600 mt-1">Gérez vos offres de financement et subventions</p>
                    </div>
                    <Link
                        to={ROUTES.ADMIN.OFFERS.FUNDING_OFFERS.CREATE}
                        className="flex items-center space-x-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <i className="fas fa-plus"></i>
                        <span>Nouvelle offre</span>
                    </Link>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {error}
                    </div>
                )}

                <div className="space-y-4 mb-6">
                    <input
                        type="text"
                        placeholder="Rechercher une offre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                        >
                            <option value="ALL">Tous les statuts</option>
                            <option value="DRAFT">Brouillon</option>
                            <option value="PENDING_APPROVAL">En attente d'approbation</option>
                            <option value="APPROVED">Approuvée</option>
                            <option value="PUBLISHED">Publiée</option>
                            <option value="REJECTED">Rejetée</option>
                            <option value="EXPIRED">Expirée</option>
                            <option value="CLOSED">Fermée</option>
                        </select>
                        <label className="flex items-center space-x-3 px-4 py-2 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                            <input
                                type="checkbox"
                                checked={filterAdminOnly}
                                onChange={(e) => setFilterAdminOnly(e.target.checked)}
                                className="w-4 h-4 rounded"
                            />
                            <span className="text-sm font-semibold text-gray-700">
                                <i className="fas fa-lock mr-2"></i>
                                Offres admin uniquement
                            </span>
                        </label>
                    </div>
                </div>

                {selectedOffers.size > 0 && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                        <span className="text-blue-900">
                            {selectedOffers.size} offre(s) sélectionnée(s)
                        </span>
                        <div className="space-x-2">
                            <button
                                onClick={handleBulkApprove}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                            >
                                <i className="fas fa-check mr-1"></i> Approuver
                            </button>
                            <button
                                onClick={handleBulkReject}
                                disabled={actionLoading}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                            >
                                <i className="fas fa-times mr-1"></i> Rejeter
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedOffers.size === filteredOffers.length && filteredOffers.length > 0}
                                        onChange={toggleSelectAll}
                                        className="w-4 h-4 rounded"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Titre</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Recruteur</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Montant</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date limite</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Statut</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Vues</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOffers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                        <i className="fas fa-inbox text-4xl mb-4 block opacity-50"></i>
                                        Aucune offre trouvée
                                    </td>
                                </tr>
                            ) : (
                                filteredOffers.map((offer) => (
                                    <tr key={offer.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedOffers.has(offer.id)}
                                                onChange={() => toggleSelection(offer.id)}
                                                className="w-4 h-4 rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {getLogoUrl(offer) && (
                                                    <img
                                                        src={getLogoUrl(offer)}
                                                        alt={offer.organization_name}
                                                        className="h-10 w-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                                <div className="min-w-0">
                                                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                                                        {offer.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 line-clamp-1">
                                                        {offer.organization_name || 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            <div className="text-sm">
                                                <p className="font-medium">{offer.recruiter?.username || 'N/A'}</p>
                                                <p className="text-gray-500 text-xs">{offer.recruiter?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {offer.montant ? `${parseFloat(offer.montant).toLocaleString('fr-FR', { maximumFractionDigits: 0 })} FCFA` : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            {offer.date_limite ? new Date(offer.date_limite).toLocaleDateString('fr-FR') : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(offer.status)}`}>
                                                {offer.status?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900">
                                            <span className="inline-flex items-center space-x-1">
                                                <i className="fas fa-eye text-gray-400"></i>
                                                <span>{offer.views_count}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 space-x-2">
                                            <button
                                                onClick={() => navigate(ROUTES.ADMIN.OFFERS.FUNDING_OFFERS.DETAIL(offer.id))}
                                                title="Voir détails"
                                                className="text-blue-600 hover:text-blue-900 text-sm"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            {offer.status === 'PENDING_APPROVAL' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(offer.id)}
                                                        disabled={actionLoading}
                                                        title="Approuver"
                                                        className="text-green-600 hover:text-green-900 text-sm disabled:opacity-50"
                                                    >
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(offer.id)}
                                                        disabled={actionLoading}
                                                        title="Rejeter"
                                                        className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50"
                                                    >
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                </>
                                            )}
                                            {offer.is_admin_only && (
                                                <button
                                                    onClick={() => navigate(ROUTES.ADMIN.OFFERS.FUNDING_OFFERS.EDIT(offer.id))}
                                                    title="Éditer"
                                                    className="text-orange-600 hover:text-orange-900 text-sm"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(offer.id)}
                                                disabled={actionLoading}
                                                title="Supprimer"
                                                className="text-red-600 hover:text-red-900 text-sm disabled:opacity-50"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FundingOffersList;
