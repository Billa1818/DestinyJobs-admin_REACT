import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../routers'
import { useAuth } from '../../contexts/AuthContext'

const Profile = () => {
  const { user, updateProfile, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    user_type: '',
    email_verified: false
  })

  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)

  // Charger les données du profil depuis le contexte
  useEffect(() => {
    if (user) {
      setProfile({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        user_type: user.user_type || '',
        email_verified: user.email_verified || false
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Préparer les données pour l'API
      const profileData = {
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone
      }
      
      // Ne pas inclure l'email s'il n'est pas vérifié
      if (profile.email_verified) {
        profileData.email = profile.email
      }
      
      await updateProfile(profileData)
      setEditing(false)
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du profil')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestEmailVerification = async () => {
    try {
      setEmailVerificationLoading(true)
      setError('')
      
      // Utiliser le service d'authentification
      const { authService } = await import('../../services')
      await authService.requestEmailVerification()
      
      setEmailVerificationSent(true)
      
      // Réinitialiser le message après 5 secondes
      setTimeout(() => setEmailVerificationSent(false), 5000)
      
    } catch (err) {
      setError(err.message || 'Erreur lors de la demande de vérification d\'email')
    } finally {
      setEmailVerificationLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Accès non autorisé</h1>
          <p className="mt-2 text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
        <p className="mt-2 text-gray-600">Gérez vos informations personnelles</p>
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

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Informations personnelles</h3>
          </div>

        <div className="p-6 space-y-6">
          {/* Avatar */}
          <div className="flex items-center space-x-6">
            <div className="h-24 w-24 rounded-full bg-fuchsia-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {profile.first_name[0]}{profile.last_name[0]}
              </span>
            </div>
            <div>
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Changer l'avatar
              </button>
            </div>
          </div>

          {/* Information sur la vérification d'email */}
          {!profile.email_verified && (
            <div className="col-span-full bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Vérification d'email requise
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Votre adresse email n'est pas encore vérifiée. Vous devez la vérifier avant de pouvoir la modifier.
                      Utilisez le bouton "Demander la vérification" ci-dessous pour recevoir un email de confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom
              </label>
              <input
                type="text"
                value={profile.first_name}
                onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                disabled={!editing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={profile.last_name}
                onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                disabled={!editing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
                {profile.email_verified ? (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <i className="fas fa-check-circle mr-1"></i>
                    Vérifié
                  </span>
                ) : (
                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    Non vérifié
                  </span>
                )}
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                disabled={!editing || !profile.email_verified}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
                  !editing || !profile.email_verified ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                title={!profile.email_verified ? 'L\'email doit être vérifié avant de pouvoir être modifié' : ''}
              />
              {!profile.email_verified && (
                <div className="mt-2">
                  <button
                    onClick={handleRequestEmailVerification}
                    disabled={emailVerificationLoading || emailVerificationSent}
                    className="inline-flex items-center px-3 py-1 border border-orange-300 rounded-md text-xs font-medium text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
                  >
                    {emailVerificationLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-1"></i>
                        Envoi...
                      </>
                    ) : emailVerificationSent ? (
                      <>
                        <i className="fas fa-check mr-1"></i>
                        Email envoyé !
                      </>
                    ) : (
                      <>
                        <i className="fas fa-envelope mr-1"></i>
                        Demander la vérification
                      </>
                    )}
                  </button>
                  <p className="mt-1 text-xs text-gray-500">
                    Vérifiez votre boîte de réception pour confirmer votre email
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rôle
              </label>
              <input
                type="text"
                value={profile.user_type}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <Link
                to={ROUTES.ADMIN.FORGOT_PASSWORD}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500"
              >
                <i className="fas fa-unlock-alt mr-2"></i>
                Récupération de mot de passe
              </Link>
            </div>
            
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-fuchsia-600 text-white rounded-md text-sm font-medium hover:bg-fuchsia-700 disabled:opacity-50"
                >
                  {loading ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-fuchsia-600 text-white rounded-md text-sm font-medium hover:bg-fuchsia-700"
              >
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 