import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../routers'
import { recruiterService } from '../../services'
import ConfirmDialog from '../../components/ConfirmDialog'

export default function Recruiters() {
  const [recruiters, setRecruiters] = useState([])
  const [pendingRecruiters, setPendingRecruiters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    account_status: '',
    country: '',
    sector: '',
    company_size: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0
  })

  // États pour le debug de l'API
  const [debugInfo, setDebugInfo] = useState({
    showDebug: false,
    apiCalls: [],
    lastResponse: null,
    lastError: null,
    requestParams: null
  })

  // États pour les dialogues de confirmation
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    variant: 'danger'
  })

  // Charger les données au montage
  useEffect(() => {
    loadRecruiters()
    loadPendingRecruiters()
  }, [pagination.page, filters])

  const loadRecruiters = async () => {
    try {
      setLoading(true)
      const params = {
        user_type: 'RECRUTEUR',
        page: pagination.page,
        page_size: pagination.page_size,
        ...filters
      }
      
      if (searchQuery) {
        params.search = searchQuery
      }

      // Debug: Enregistrer les paramètres de la requête
      const requestInfo = {
        timestamp: new Date().toISOString(),
        endpoint: '/api/auth/profiles/public/',
        method: 'GET',
        params: params,
        type: 'getRecruiterProfiles'
      }
      
      setDebugInfo(prev => ({
        ...prev,
        requestParams: params,
        apiCalls: [...prev.apiCalls, requestInfo]
      }))

      console.log('🚀 API Debug - Requête:', requestInfo)
      
      const data = await recruiterService.getRecruiterProfiles(params)
      
      // Debug: Enregistrer la réponse
      const responseInfo = {
        timestamp: new Date().toISOString(),
        success: true,
        data: data,
        type: 'getRecruiterProfiles'
      }
      
      setDebugInfo(prev => ({
        ...prev,
        lastResponse: responseInfo,
        apiCalls: [...prev.apiCalls, responseInfo]
      }))

      console.log('✅ API Debug - Réponse:', responseInfo)
      
      // Adapter le format des données selon la structure de l'API
      let formattedRecruiters = []
      if (data.recruiters && Array.isArray(data.recruiters)) {
        // Nouveau format avec "recruiters"
        formattedRecruiters = data.recruiters.map(recruiter => ({
          id: recruiter.id,
          username: recruiter.user?.username || '',
          email: recruiter.user?.email || '',
          first_name: recruiter.user?.first_name || '',
          last_name: recruiter.user?.last_name || '',
          phone: recruiter.user?.phone || '',
          created_at: recruiter.user?.created_at || recruiter.created_at,
          profile: {
            company_name: recruiter.company_name || '',
            sector: recruiter.sector || '',
            company_size: recruiter.company_size || '',
            website: recruiter.website || '',
            address: recruiter.address || '',
            country: recruiter.country || null,
            region: recruiter.region || null,
            contact_email: recruiter.contact_email || '',
            contact_phone: recruiter.contact_phone || '',
            account_status: recruiter.account_status || 'PENDING',
            logo: recruiter.logo || null,
            description: recruiter.description || ''
          }
        }))
      } else if (data.results && Array.isArray(data.results)) {
        // Si c'est le format avec profile séparé
        formattedRecruiters = data.results.map(recruiter => {
          if (recruiter.profile) {
            return {
              ...recruiter,
              profile: {
                ...recruiter.profile,
                // S'assurer que les champs sont correctement mappés
                company_name: recruiter.profile.company_name || '',
                sector: recruiter.profile.sector || '',
                company_size: recruiter.profile.company_size || '',
                website: recruiter.profile.website || '',
                address: recruiter.profile.address || '',
                country: recruiter.profile.country || null,
                contact_email: recruiter.profile.contact_email || '',
                contact_phone: recruiter.profile.contact_phone || '',
                account_status: recruiter.profile.account_status || 'PENDING'
              }
            }
          } else {
            // Si c'est le format direct (comme dans votre exemple)
            return {
              id: recruiter.id,
              username: recruiter.user?.username || '',
              email: recruiter.user?.email || '',
              first_name: recruiter.user?.first_name || '',
              last_name: recruiter.user?.last_name || '',
              phone: recruiter.user?.phone || '',
              created_at: recruiter.user?.created_at || recruiter.created_at,
              profile: {
                company_name: recruiter.company_name || '',
                sector: recruiter.sector || '',
                company_size: recruiter.company_size || '',
                website: recruiter.website || '',
                address: recruiter.address || '',
                country: recruiter.country || null,
                contact_email: recruiter.contact_email || '',
                contact_phone: recruiter.contact_phone || '',
                account_status: recruiter.account_status || 'PENDING'
              }
            }
          }
        })
      }
      
      setRecruiters(formattedRecruiters)
      setPagination(prev => ({
        ...prev,
        total: data.count || 0
      }))
    } catch (error) {
      // Debug: Enregistrer l'erreur
      const errorInfo = {
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message || error,
        stack: error.stack,
        type: 'getRecruiterProfiles'
      }
      
      setDebugInfo(prev => ({
        ...prev,
        lastError: errorInfo,
        apiCalls: [...prev.apiCalls, errorInfo]
      }))

      console.error('❌ API Debug - Erreur:', errorInfo)
      setError('Erreur lors du chargement des recruteurs')
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPendingRecruiters = async (params = {}) => {
    try {
      setLoading(true)
      
      // Debug: Enregistrer les paramètres de la requête
      const requestParams = {
        page: 1,
        page_size: 50, // Charger plus de recruteurs en attente
        sort_by: 'created_at',
        sort_order: 'desc',
        ...params // Inclure les paramètres de recherche/filtre
      }
      
      setDebugInfo(prev => ({
        ...prev,
        requestParams: {
          ...requestParams,
          type: 'getPendingRecruiters',
          timestamp: new Date().toISOString()
        }
      }))

      console.log('📤 API Debug - Requête:', requestParams)
      
      const data = await recruiterService.getPendingRecruiters(requestParams)
      
      // Debug: Enregistrer la réponse
      const responseInfo = {
        timestamp: new Date().toISOString(),
        success: true,
        data: data,
        type: 'getPendingRecruiters'
      }
      
      setDebugInfo(prev => ({
        ...prev,
        lastResponse: responseInfo,
        apiCalls: [...prev.apiCalls, responseInfo]
      }))

      console.log('✅ API Debug - Réponse:', responseInfo)
      
      // Adapter le format des données selon la structure de l'API
      let allRecruiters = []
      if (data.recruiters && Array.isArray(data.recruiters)) {
        allRecruiters = data.recruiters
      } else if (data.results && Array.isArray(data.results)) {
        allRecruiters = data.results
      } else if (data.pending_recruiters && Array.isArray(data.pending_recruiters)) {
        // Fallback pour l'ancien format
        allRecruiters = data.pending_recruiters
      }
      
      // Filtrer uniquement les recruteurs en attente (PENDING)
      const pendingRecruiters = allRecruiters.filter(recruiter => 
        recruiter.account_status === 'PENDING'
      )
      
      setPendingRecruiters(pendingRecruiters)
      
    } catch (error) {
      console.error('Erreur lors du chargement des recruteurs en attente:', error)
      
      // Debug: Enregistrer l'erreur
      const errorInfo = {
        timestamp: new Date().toISOString(),
        success: false,
        error: error.message,
        stack: error.stack,
        type: 'getPendingRecruiters'
      }
      
      setDebugInfo(prev => ({
        ...prev,
        lastError: errorInfo,
        apiCalls: [...prev.apiCalls, errorInfo]
      }))

      console.log('❌ API Debug - Erreur:', errorInfo)
      
      setError(`Erreur lors du chargement des recruteurs en attente: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleValidateRecruiter = async (recruiterId, action) => {
    try {
      await recruiterService.validateRecruiter(recruiterId, action)
      
      // Recharger les données
      await loadRecruiters()
      await loadPendingRecruiters()
      
      setConfirmDialog(prev => ({ ...prev, isOpen: false }))
    } catch (error) {
      setError(`Erreur lors de la ${action === 'approve' ? 'validation' : 'rejet'} du recruteur`)
      console.error('Erreur:', error)
    }
  }

  const showConfirmDialog = (title, message, onConfirm, variant = 'danger') => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant
    })
  }

  const closeConfirmDialog = () => {
    setConfirmDialog({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null,
      variant: 'danger'
    })
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PENDING': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'En attente' },
      'APPROVED': { bg: 'bg-green-100', text: 'text-green-800', label: 'Approuvé' },
      'REJECTED': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejeté' }
    }
    
    const config = statusConfig[status] || statusConfig['PENDING']
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getSectorLabel = (sector) => {
    const sectors = {
      'TECHNOLOGY': 'Technologie',
      'HEALTHCARE': 'Santé',
      'FINANCE': 'Finance',
      'EDUCATION': 'Éducation',
      'MANUFACTURING': 'Manufacture',
      'RETAIL': 'Commerce',
      'OTHER': 'Autre'
    }
    return sectors[sector] || sector
  }

  const getCompanySizeLabel = (size) => {
    const sizes = {
      'SMALL': 'Petite (< 50)',
      'MEDIUM': 'Moyenne (50-250)',
      'LARGE': 'Grande (250+)'
    }
    return sizes[size] || size
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  // Fonction pour obtenir les statistiques des recruteurs en attente
  const getPendingRecruitersStats = () => {
    const total = pendingRecruiters.length
    const withCompanyInfo = pendingRecruiters.filter(r => r.company_name && r.company_name.trim() !== '').length
    const withContactInfo = pendingRecruiters.filter(r => r.contact_email || r.contact_phone).length
    const withSectorInfo = pendingRecruiters.filter(r => r.sector && r.sector.trim() !== '').length
    
    return {
      total,
      withCompanyInfo,
      withContactInfo,
      withSectorInfo,
      incomplete: total - Math.min(withCompanyInfo, withContactInfo, withSectorInfo)
    }
  }



  if (loading && pagination.page === 1) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Recruteurs</h1>
        <p className="mt-2 text-gray-600">
          Gérez tous les recruteurs et entreprises partenaires
        </p>
      </div>


      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select
              value={filters.account_status}
              onChange={(e) => setFilters(prev => ({ ...prev, account_status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-Total Recruteurs rounded-md"
            >
              <option value="">Tous les statuts</option>
              <option value="PENDING">En attente</option>
              <option value="APPROVED">Approuvé</option>
              <option value="REJECTED">Rejeté</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
            <input
              type="text"
              placeholder="Pays..."
              value={filters.country}
              onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secteur</label>
            <select
              value={filters.sector}
              onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Tous les secteurs</option>
              <option value="TECHNOLOGY">Technologie</option>
              <option value="HEALTHCARE">Santé</option>
              <option value="FINANCE">Finance</option>
              <option value="EDUCATION">Éducation</option>
              <option value="MANUFACTURING">Manufacture</option>
              <option value="RETAIL">Commerce</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
            <select
              value={filters.company_size}
              onChange={(e) => setFilters(prev => ({ ...prev, company_size: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Toutes les tailles</option>
              <option value="SMALL">Petite</option>
              <option value="MEDIUM">Moyenne</option>
              <option value="LARGE">Grande</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <Link
          to={ROUTES.ADMIN.RECRUITERS.CREATE}
          className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors duration-200"
        >
          <i className="fas fa-plus mr-2"></i>
          Ajouter un recruteur
        </Link>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher un recruteur, entreprise ou contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && loadRecruiters()}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={loadRecruiters}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
        >
          <i className="fas fa-search mr-2"></i>
          Rechercher
        </button>
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recruiters en attente */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Recruteurs en attente de validation ({pendingRecruiters.length})
        </h2>
        
        {/* Filtres pour les recruteurs en attente */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filtres et recherche</h3>
            <button
              onClick={() => loadPendingRecruiters()}
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition-colors duration-200 flex items-center"
              disabled={loading}
            >
              <i className={`fas ${loading ? 'fa-spinner fa-spin' : 'fa-sync-alt'} mr-2`}></i>
              {loading ? 'Chargement...' : 'Actualiser'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
              <input
                type="text"
                placeholder="Nom, entreprise, email..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                onChange={(e) => {
                  const searchValue = e.target.value;
                  if (searchValue.length >= 2 || searchValue.length === 0) {
                    loadPendingRecruiters({ search: searchValue || undefined });
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secteur</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                onChange={(e) => {
                  const sector = e.target.value;
                  loadPendingRecruiters({ sector: sector || undefined });
                }}
              >
                <option value="">Tous les secteurs</option>
                <option value="TECHNOLOGY">Technologie</option>
                <option value="HEALTHCARE">Santé</option>
                <option value="FINANCE">Finance</option>
                <option value="EDUCATION">Éducation</option>
                <option value="MANUFACTURING">Manufacture</option>
                <option value="RETAIL">Commerce</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                onChange={(e) => {
                  const size = e.target.value;
                  loadPendingRecruiters({ company_size: size || undefined });
                }}
              >
                <option value="">Toutes les tailles</option>
                <option value="SMALL">Petite (1-50)</option>
                <option value="MEDIUM">Moyenne (51-200)</option>
                <option value="LARGE">Grande (201+)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tri</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                onChange={(e) => {
                  const sortBy = e.target.value;
                  if (sortBy) {
                    loadPendingRecruiters({ sort_by: sortBy, sort_order: 'desc' });
                  }
                }}
              >
                <option value="">Tri par défaut</option>
                <option value="created_at">Date de création</option>
                <option value="company_name">Nom de l'entreprise</option>
                <option value="user__first_name">Prénom</option>
                <option value="user__last_name">Nom</option>
              </select>
            </div>
          </div>
        </div>
        
        {pendingRecruiters.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <i className="fas fa-clock text-4xl text-gray-400 mb-4"></i>
            <p className="text-gray-500">Aucun recruteur en attente de validation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRecruiters.map((recruiter) => (
              <div key={recruiter.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-fuchsia-500 rounded-full flex items-center justify-center shadow-sm">
                      <i className="fas fa-user text-white text-lg"></i>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {recruiter.user?.first_name && recruiter.user?.last_name
                          ? `${recruiter.user.first_name} ${recruiter.user.last_name}`
                          : recruiter.user?.username || 'Nom non spécifié'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        <i className="fas fa-envelope mr-2 text-fuchsia-500"></i>
                        {recruiter.user?.email}
                      </p>
                      {recruiter.user?.phone && (
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-phone mr-2 text-fuchsia-500"></i>
                          {recruiter.user.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className="px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">
                      <i className="fas fa-clock mr-1"></i>
                      En attente
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {recruiter.id}
                    </span>
                  </div>
                </div>
                
                {/* Informations de l'entreprise */}
                {(recruiter.company_name || recruiter.sector || recruiter.company_size) && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 border-l-4 border-fuchsia-400">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <i className="fas fa-building mr-2 text-fuchsia-600"></i>
                      Informations de l'entreprise
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {recruiter.company_name && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Nom de l'entreprise</span>
                          <p className="text-sm font-semibold text-gray-900">{recruiter.company_name}</p>
                        </div>
                      )}
                      {recruiter.sector && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Secteur</span>
                          <p className="text-sm font-semibold text-gray-900">{recruiter.sector}</p>
                        </div>
                      )}
                      {recruiter.company_size && (
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Taille</span>
                          <p className="text-sm font-semibold text-gray-900">{recruiter.company_size}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Informations de contact et localisation */}
                {(recruiter.contact_email || recruiter.contact_phone || recruiter.address || recruiter.website) && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4 border-l-4 border-blue-400">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <i className="fas fa-address-book mr-2 text-blue-600"></i>
                      Contact & Localisation
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {recruiter.contact_email && (
                        <div className="flex items-center">
                          <i className="fas fa-envelope mr-2 text-blue-500 w-4"></i>
                          <span className="text-sm text-gray-700">{recruiter.contact_email}</span>
                        </div>
                      )}
                      {recruiter.contact_phone && (
                        <div className="flex items-center">
                          <i className="fas fa-phone mr-2 text-blue-500 w-4"></i>
                          <span className="text-sm text-gray-700">{recruiter.contact_phone}</span>
                        </div>
                      )}
                      {recruiter.address && (
                        <div className="flex items-start">
                          <i className="fas fa-map-marker-alt mr-2 text-blue-500 w-4 mt-0.5"></i>
                          <span className="text-sm text-gray-700">{recruiter.address}</span>
                        </div>
                      )}
                      {recruiter.website && (
                        <div className="flex items-center">
                          <i className="fas fa-globe mr-2 text-blue-500 w-4"></i>
                          <a 
                            href={recruiter.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {recruiter.website}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Date d'inscription */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      <i className="fas fa-calendar-alt mr-2 text-gray-500"></i>
                      Inscrit le {new Date(recruiter.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(recruiter.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => showConfirmDialog(
                      'Approuver le recruteur',
                      `Êtes-vous sûr de vouloir approuver ${recruiter.user?.username || 'ce recruteur'} ?`,
                      () => handleValidateRecruiter(recruiter.id, 'approve'),
                      'success'
                    )}
                    className="flex-1 px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                  >
                    <i className="fas fa-check mr-2"></i>
                    Approuver
                  </button>
                  <button
                    onClick={() => showConfirmDialog(
                      'Rejeter le recruteur',
                      `Êtes-vous sûr de vouloir rejeter ${recruiter.user?.username || 'ce recruteur'} ?`,
                      () => handleValidateRecruiter(recruiter.id, 'reject'),
                      'danger'
                    )}
                    className="flex-1 px-6 py-3 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    <i className="fas fa-times mr-2"></i>
                    Rejeter
                  </button>
                </div>
                
                {/* Bouton profil public */}
                <div className="mt-3">
                  <button
                    onClick={() => {
                      const profileUrl = `http://localhost:3000/recruteur/profil-public/${recruiter.user?.id}`;
                      window.open(profileUrl, '_blank');
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <i className="fas fa-external-link-alt mr-2"></i>
                    Voir le profil public
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>



      {/* Dialogue de confirmation */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmVariant={confirmDialog.variant}
        confirmText="Confirmer"
        cancelText="Annuler"
      />
    </div>
  )
} 