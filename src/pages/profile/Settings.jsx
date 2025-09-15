import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../routers'
import { useAuth } from '../../contexts/AuthContext'
import ConfirmDialog from '../../components/ConfirmDialog'

const Settings = () => {
  const { getSessions, logoutAllSessions, invalidateSession, forceLogout } = useAuth()
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    language: 'fr',
    timezone: 'Africa/Lagos'
  })

  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // États pour les dialogues de confirmation
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    variant: 'danger'
  })

  // Charger les sessions au montage du composant
  useEffect(() => {
    loadSessions()
  }, [])

  const loadSessions = async () => {
    try {
      setSessionsLoading(true)
      const sessionsData = await getSessions()
      setSessions(sessionsData.sessions || [])
    } catch (error) {
      console.error('Erreur lors du chargement des sessions:', error)
    } finally {
      setSessionsLoading(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    // TODO: Implémenter la sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
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

  const handleLogoutAllSessions = async () => {
    showConfirmDialog(
      'Déconnecter toutes les sessions',
      'Êtes-vous sûr de vouloir déconnecter toutes vos sessions ? Cette action vous déconnectera de tous vos appareils.',
      async () => {
        try {
          const result = await logoutAllSessions()
          console.log('Résultat de la déconnexion:', result)
          
          // Si la session actuelle est invalidée, rediriger vers la connexion
          if (result.force_logout) {
            window.location.href = '/login'
            return
          }
          
          // Recharger les sessions après la déconnexion
          await loadSessions()
          closeConfirmDialog()
        } catch (error) {
          console.error('Erreur lors de la déconnexion de toutes les sessions:', error)
        }
      },
      'danger'
    )
  }

  const handleInvalidateSession = async (sessionId) => {
    showConfirmDialog(
      'Invalider la session',
      'Êtes-vous sûr de vouloir invalider cette session ?',
      async () => {
        try {
          const result = await invalidateSession(sessionId)
          console.log('Résultat de l\'invalidation:', result)
          
          // Si c'est la session actuelle, rediriger vers la connexion
          if (result.force_logout) {
            window.location.href = '/login'
            return
          }
          
          // Recharger les sessions après l'invalidation
          await loadSessions()
          closeConfirmDialog()
        } catch (error) {
          console.error('Erreur lors de l\'invalidation de la session:', error)
        }
      },
      'warning'
    )
  }

  const handleForceLogout = async () => {
    showConfirmDialog(
      'Forcer la déconnexion',
      'Êtes-vous sûr de vouloir forcer la déconnexion de votre session actuelle ? Vous devrez vous reconnecter.',
      async () => {
        try {
          const result = await forceLogout()
          console.log('Résultat de la déconnexion forcée:', result)
          
          // Rediriger vers la connexion après la déconnexion forcée
          if (result.force_logout) {
            window.location.href = '/login'
            return
          }
          
          closeConfirmDialog()
        } catch (error) {
          console.error('Erreur lors de la déconnexion forcée:', error)
        }
      },
      'warning'
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'desktop':
        return 'fas fa-desktop'
      case 'mobile':
        return 'fas fa-mobile-alt'
      case 'tablet':
        return 'fas fa-tablet-alt'
      default:
        return 'fas fa-question-circle'
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-2 text-gray-600">Configurez vos préférences</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notifications par email</h4>
              <p className="text-sm text-gray-500">Recevoir les notifications par email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
              className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notifications push</h4>
              <p className="text-sm text-gray-500">Recevoir les notifications push</p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
              className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Préférences</h3>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({...settings, language: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuseau horaire
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings({...settings, timezone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Africa/Lagos">Afrique de l'Ouest (UTC+1)</option>
              <option value="Europe/Paris">Europe (UTC+1/+2)</option>
              <option value="America/New_York">Amérique (UTC-5/-4)</option>
            </select>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Sécurité</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Changer le mot de passe</h4>
              <p className="text-sm text-gray-500">Modifiez votre mot de passe actuel</p>
            </div>
            <Link
              to={ROUTES.ADMIN.CHANGE_PASSWORD}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
            >
              <i className="fas fa-key mr-2"></i>
              Modifier
            </Link>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Récupération de mot de passe</h4>
              <p className="text-sm text-gray-500">Configurez les options de récupération de mot de passe</p>
            </div>
            <Link
              to={ROUTES.ADMIN.FORGOT_PASSWORD}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
            >
              <i className="fas fa-unlock-alt mr-2"></i>
              Configurer
            </Link>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Gestion des Sessions</h3>
        </div>
        <div className="p-6 space-y-4">


          {/* Actions sur les sessions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={handleLogoutAllSessions}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Déconnecter toutes les sessions
            </button>
            <button
              onClick={handleForceLogout}
              className="inline-flex items-center px-4 py-2 border border-orange-300 rounded-md shadow-sm text-sm font-medium text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <i className="fas fa-exclamation-triangle mr-2"></i>
              Forcer la déconnexion actuelle
            </button>
            <button
              onClick={loadSessions}
              disabled={sessionsLoading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              {sessionsLoading ? 'Actualisation...' : 'Actualiser'}
            </button>
          </div>

          {/* Liste des sessions */}
          {sessionsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-600"></div>
              <span className="ml-2 text-gray-600">Chargement des sessions...</span>
            </div>
          ) : sessions.length > 0 ? (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.session_id}
                  className={`p-4 border rounded-lg ${
                    session.is_active && !session.is_expired
                      ? 'border-fuchsia-200 bg-fuchsia-50' 
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        session.is_active && !session.is_expired
                          ? 'bg-fuchsia-100 text-fuchsia-600' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <i className={`${getDeviceIcon(session.device_info?.device_type)} text-lg`}></i>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">
                            {session.device_info?.browser || 'Navigateur inconnu'}
                          </span>
                          {session.is_active && !session.is_expired && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-fuchsia-100 text-fuchsia-800">
                              Session active
                            </span>
                          )}
                          {session.is_expired && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Expirée
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.device_info?.os || 'OS inconnu'} • {session.ip_address}
                        </div>
                        <div className="text-xs text-gray-400 space-y-1">
                          <div>Dernière activité: {formatDate(session.last_activity)}</div>
                          <div>Créée le: {formatDate(session.created_at)}</div>
                          <div>Expire le: {formatDate(session.expires_at)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      {session.is_active && !session.is_expired && (
                        <button
                          onClick={() => handleInvalidateSession(session.session_id)}
                          className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                          <i className="fas fa-times mr-1"></i>
                          Invalider
                        </button>
                      )}
                      <div className="text-xs text-gray-400 text-right">
                        ID: {session.session_id}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-info-circle text-2xl mb-2"></i>
              <p>Aucune session active trouvée</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 bg-fuchsia-600 text-white rounded-md text-sm font-medium hover:bg-fuchsia-700 disabled:opacity-50"
            >
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
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

export default Settings 