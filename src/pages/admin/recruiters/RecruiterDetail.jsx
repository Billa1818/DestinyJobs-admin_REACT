import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../../routers'
import { recruiterService } from '../../../services'
import ConfirmDialog from '../../../components/ConfirmDialog'

const RecruiterDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recruiter, setRecruiter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // États pour les dialogues de confirmation
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    variant: 'danger'
  })

  useEffect(() => {
    loadRecruiter()
  }, [id])

  const loadRecruiter = async () => {
    try {
      setLoading(true)
      const data = await recruiterService.getRecruiterProfile(id)
      setRecruiter(data)
    } catch (error) {
      setError('Erreur lors du chargement du recruteur')
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleValidateRecruiter = async (action) => {
    try {
      setActionLoading(true)
      await recruiterService.validateRecruiter(id, action)
      
      // Recharger les données
      await loadRecruiter()
      
      setConfirmDialog(prev => ({ ...prev, isOpen: false }))
    } catch (error) {
      setError(`Erreur lors de la ${action === 'approve' ? 'validation' : 'rejet'} du recruteur`)
      console.error('Erreur:', error)
    } finally {
      setActionLoading(false)
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
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.bg} ${config.text}`}>
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
      'SMALL': 'Petite (< 50 employés)',
      'MEDIUM': 'Moyenne (50-250 employés)',
      'LARGE': 'Grande (250+ employés)'
    }
    return sizes[size] || size
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      </div>
    )
  }

  if (error || !recruiter) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Erreur</h1>
          <p className="mt-2 text-gray-600">{error || 'Recruteur non trouvé'}</p>
          <Link
            to={ROUTES.ADMIN.RECRUITERS.LIST}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Retour à la liste
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Détails du Recruteur
            </h1>
            <p className="mt-2 text-gray-600">
              Profil complet de {recruiter.profile?.company_name || recruiter.username}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              to={ROUTES.ADMIN.RECRUITERS.LIST}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Retour
            </Link>
            <Link
              to={`${ROUTES.ADMIN.RECRUITERS.EDIT}/${id}`}
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-md text-sm font-medium hover:bg-fuchsia-700"
            >
              <i className="fas fa-edit mr-2"></i>
              Modifier
            </Link>
          </div>
        </div>
      </div>

      {/* Statut et actions */}
      <div className="mb-6 bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-fuchsia-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {recruiter.profile?.company_name?.charAt(0) || recruiter.username?.charAt(0) || '?'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {recruiter.profile?.company_name || 'Nom non spécifié'}
              </h2>
              <p className="text-gray-600">{recruiter.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Statut du compte</div>
              <div className="mt-1">{getStatusBadge(recruiter.profile?.account_status)}</div>
            </div>
            {recruiter.profile?.account_status === 'PENDING' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => showConfirmDialog(
                    'Approuver le recruteur',
                    `Êtes-vous sûr de vouloir approuver ${recruiter.profile.company_name} ?`,
                    () => handleValidateRecruiter('approve'),
                    'info'
                  )}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  <i className="fas fa-check mr-2"></i>
                  Approuver
                </button>
                <button
                  onClick={() => showConfirmDialog(
                    'Rejeter le recruteur',
                    `Êtes-vous sûr de vouloir rejeter ${recruiter.profile.company_name} ?`,
                    () => handleValidateRecruiter('reject'),
                    'danger'
                  )}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  <i className="fas fa-times mr-2"></i>
                  Rejeter
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Informations principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Informations de l'entreprise */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <i className="fas fa-building mr-2 text-fuchsia-600"></i>
            Informations de l'entreprise
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
              <p className="mt-1 text-sm text-gray-900">{recruiter.profile?.company_name || 'Non spécifié'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Secteur d'activité</label>
              <p className="mt-1 text-sm text-gray-900">{getSectorLabel(recruiter.profile?.sector)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Taille de l'entreprise</label>
              <p className="mt-1 text-sm text-gray-900">{getCompanySizeLabel(recruiter.profile?.company_size)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Site web</label>
              {recruiter.profile?.website ? (
                <a
                  href={recruiter.profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  {recruiter.profile.website}
                </a>
              ) : (
                <p className="mt-1 text-sm text-gray-500">Non spécifié</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-sm text-gray-900">
                {recruiter.profile?.description || 'Aucune description disponible'}
              </p>
            </div>
          </div>
        </div>

        {/* Informations de contact */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <i className="fas fa-address-book mr-2 text-fuchsia-600"></i>
            Informations de contact
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact principal</label>
              <p className="mt-1 text-sm text-gray-900">
                {recruiter.first_name} {recruiter.last_name}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email principal</label>
              <p className="mt-1 text-sm text-gray-900">{recruiter.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone principal</label>
              <p className="mt-1 text-sm text-gray-900">{recruiter.phone || 'Non spécifié'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email de contact</label>
              <p className="mt-1 text-sm text-gray-900">
                {recruiter.profile?.contact_email || 'Non spécifié'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Téléphone de contact</label>
              <p className="mt-1 text-sm text-gray-900">
                {recruiter.profile?.contact_phone || 'Non spécifié'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Localisation */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          <i className="fas fa-map-marker-alt mr-2 text-fuchsia-600"></i>
          Localisation
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Adresse</label>
            <p className="mt-1 text-sm text-gray-900">
              {recruiter.profile?.address || 'Non spécifiée'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Pays</label>
            <p className="mt-1 text-sm text-gray-900">
              {recruiter.profile?.country?.name || 'Non spécifié'}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Région</label>
            <p className="mt-1 text-sm text-gray-900">
              {recruiter.profile?.region?.name || 'Non spécifiée'}
            </p>
          </div>
        </div>
      </div>

      {/* Informations du compte */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          <i className="fas fa-user mr-2 text-fuchsia-600"></i>
          Informations du compte
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom d'utilisateur</label>
            <p className="mt-1 text-sm text-gray-900">{recruiter.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Type d'utilisateur</label>
            <p className="mt-1 text-sm text-gray-900">{recruiter.user_type_display || recruiter.user_type}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date de création</label>
            <p className="mt-1 text-sm text-gray-900">{formatDate(recruiter.created_at)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Dernière activité</label>
            <p className="mt-1 text-sm text-gray-900">
              {recruiter.last_activity ? formatDate(recruiter.last_activity) : 'Jamais'}
            </p>
          </div>
        </div>
      </div>

      {/* Documents et fichiers */}
      {recruiter.profile?.company_documents && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            <i className="fas fa-file-alt mr-2 text-fuchsia-600"></i>
            Documents de l'entreprise
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-700">Documents</label>
            <div className="mt-2">
              <a
                href={recruiter.profile.company_documents}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <i className="fas fa-download mr-2"></i>
                Voir les documents
              </a>
            </div>
          </div>
        </div>
      )}

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

export default RecruiterDetail 