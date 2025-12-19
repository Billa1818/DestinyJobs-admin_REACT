import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../../routers';
import Loader from '../../../../components/Loader';
import { getAdminConsultationOffers, approveConsultationOffer, rejectConsultationOffer, deleteConsultationOffer, approveConsultationOffersInBulk, rejectConsultationOffersInBulk } from '../../../../services/offersService';
import { handleApiError } from '../../../../services/api';

const ConsultationOffersList = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
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
      
      // Ajouter le filtre de statut si ce n'est pas 'ALL'
      if (filterStatus !== 'ALL') {
        params.status = filterStatus;
      }
      
      // Ajouter le filtre admin_only
      if (filterAdminOnly) {
        params.is_admin_only = 'true';
      }
      
      // Récupérer les offres via l'endpoint admin
      const data = await getAdminConsultationOffers(params);
      setOffers(Array.isArray(data) ? data : data.results || []);
      setError(null);
    } catch (err) {
      setError(handleApiError(err));
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title?.toLowerCase().includes(searchTerm.toLowerCase());
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
      await approveConsultationOffer(offerId);
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
      await rejectConsultationOffer(offerId, reason);
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
      await deleteConsultationOffer(offerId);
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
      await approveConsultationOffersInBulk(Array.from(selectedOffers));
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
      await rejectConsultationOffersInBulk(Array.from(selectedOffers), reason);
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
      'PUBLISHED': 'bg-gray-100 text-gray-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'CLOSED': 'bg-gray-500 text-white'
    };
    return colors[status] || colors['DRAFT'];
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `http://localhost:8000${path}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Offres de Consultation</h1>
            <p className="text-gray-600 mt-1">Gérez vos offres de consultation</p>
          </div>
          <Link
            to={ROUTES.ADMIN.OFFERS.CONSULTATION_OFFERS.CREATE}
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

        <div className="space-y-3 mb-6">
          {/* Barre de recherche */}
          <input
            type="text"
            placeholder="Rechercher une offre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
          
          {/* Filtres en bas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="DRAFT">Brouillon</option>
              <option value="PENDING_APPROVAL">En attente d'approbation</option>
              <option value="PUBLISHED">Publiée</option>
              <option value="REJECTED">Rejetée</option>
              <option value="CLOSED">Fermée</option>
            </select>
            
            <div className="flex items-center px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-fuchsia-400 transition-colors">
              <input
                type="checkbox"
                id="filterAdminOnly"
                checked={filterAdminOnly}
                onChange={(e) => setFilterAdminOnly(e.target.checked)}
                className="w-5 h-5 rounded cursor-pointer accent-fuchsia-600"
              />
              <i className="fas fa-crown ml-3 text-fuchsia-600"></i>
              <label htmlFor="filterAdminOnly" className="ml-2 cursor-pointer font-semibold text-gray-700">
                Admin uniquement
              </label>
            </div>
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

        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
          {/* Header Row */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 font-semibold text-gray-700">
            <div className="col-span-1 flex items-center">
              <input
                type="checkbox"
                checked={selectedOffers.size === filteredOffers.length && filteredOffers.length > 0}
                onChange={toggleSelectAll}
                className="w-5 h-5 rounded cursor-pointer"
              />
            </div>
            <div className="col-span-3">Titre & Entreprise</div>
            <div className="col-span-2">Localisation</div>
            <div className="col-span-2">Statut & Vues</div>
            <div className="col-span-2">Détails</div>
            <div className="col-span-2">Actions</div>
          </div>

          {/* List Items */}
          {filteredOffers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <i className="fas fa-inbox text-6xl mb-4 block opacity-20 text-gray-400"></i>
              <p className="text-gray-500 text-lg">Aucune offre trouvée</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                >
                  {/* Checkbox */}
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedOffers.has(offer.id)}
                      onChange={() => toggleSelection(offer.id)}
                      className="w-5 h-5 rounded cursor-pointer"
                    />
                  </div>

                  {/* Titre & Entreprise */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      {offer.company_details?.logo && (
                        <img
                          src={getImageUrl(offer.company_details.logo)}
                          alt={offer.company_details.company_name}
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
                          {offer.company_details?.company_name || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Localisation */}
                  <div className="col-span-2">
                    <div className="text-xs text-gray-600">
                      {offer.country ? (
                        <>
                          <div className="font-semibold">{offer.country.name}</div>
                          <div>{offer.region?.name || 'N/A'}</div>
                        </>
                      ) : (
                        <div className="text-gray-400">Non spécifiée</div>
                      )}
                    </div>
                  </div>

                  {/* Statut & Vues */}
                  <div className="col-span-2 space-y-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(offer.status)}`}>
                      {offer.status?.replace(/_/g, ' ')}
                    </span>
                    <div className="text-xs text-gray-600">
                      <i className="fas fa-eye mr-1 text-gray-400"></i>
                      {offer.views_count} vues
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="col-span-2 text-xs text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold">Créé:</span> {formatDate(offer.created_at)}
                    </p>
                    {offer.documents && (
                      <p>
                        <i className="fas fa-file-pdf mr-1 text-red-500"></i>
                        <span className="font-semibold">Document joint</span>
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex gap-2 justify-end">
                    <button
                      onClick={() => navigate(ROUTES.ADMIN.OFFERS.CONSULTATION_OFFERS.DETAIL(offer.id))}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-900 text-sm font-semibold px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                      title="Voir les détails"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    {offer.status === 'PENDING_APPROVAL' && (
                      <>
                        <button
                          onClick={() => handleApprove(offer.id)}
                          disabled={actionLoading}
                          className="flex items-center text-green-600 hover:text-green-900 text-sm font-semibold px-2 py-1 rounded hover:bg-green-50 transition-colors disabled:opacity-50"
                          title="Approuver"
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          onClick={() => handleReject(offer.id)}
                          disabled={actionLoading}
                          className="flex items-center text-red-600 hover:text-red-900 text-sm font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                          title="Rejeter"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    )}
                    {offer.is_admin_only && (
                      <button
                        onClick={() => navigate(ROUTES.ADMIN.OFFERS.CONSULTATION_OFFERS.EDIT(offer.id))}
                        className="flex items-center text-orange-600 hover:text-orange-900 text-sm font-semibold px-2 py-1 rounded hover:bg-orange-50 transition-colors"
                        title="Modifier"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(offer.id)}
                      disabled={actionLoading}
                      className="flex items-center text-red-600 hover:text-red-900 text-sm font-semibold px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50"
                      title="Supprimer"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsultationOffersList;
