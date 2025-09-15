import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routers'
import { useAuth } from '../../contexts/AuthContext'

const ForgotPasswordAdmin = () => {
  const navigate = useNavigate()
  const { requestPasswordReset, loading: authLoading, error: authError, clearError } = useAuth()
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    recoveryMethod: 'email', // 'email' ou 'sms'
    phone: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    clearError()

    try {
      const resetData = {
        recovery_method: formData.recoveryMethod,
        ...(formData.recoveryMethod === 'email' ? { email: formData.email } : { phone: formData.phone }),
        username: formData.username
      }

      await requestPasswordReset(resetData)
      setSuccess(true)
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate(ROUTES.AUTH.LOGIN)
      }, 3000)
      
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la demande de récupération')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fas fa-check-circle text-green-600 text-3xl"></i>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Demande envoyée !
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Si un compte existe avec ces informations, vous recevrez un email ou SMS avec les instructions de récupération.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-info-circle text-blue-400"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  <strong>Note :</strong> La redirection vers la page de connexion se fera automatiquement dans quelques secondes.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="font-medium text-fuchsia-600 hover:text-fuchsia-500"
            >
              Retourner à la connexion maintenant
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-fuchsia-100 rounded-full flex items-center justify-center">
            <i className="fas fa-unlock-alt text-fuchsia-600 text-3xl"></i>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Récupération de mot de passe
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Administrateur - Configurez la récupération de votre mot de passe
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Message d'erreur */}
          {(error || authError) && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-red-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error || authError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Nom d'utilisateur */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Nom d'utilisateur
            </label>
            <div className="mt-1">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:z-10 sm:text-sm"
                placeholder="admin_username"
              />
            </div>
          </div>

          {/* Méthode de récupération */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Méthode de récupération
            </label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recoveryMethod"
                  value="email"
                  checked={formData.recoveryMethod === 'email'}
                  onChange={handleChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Email</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="recoveryMethod"
                  value="sms"
                  checked={formData.recoveryMethod === 'sms'}
                  onChange={handleChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">SMS</span>
              </label>
            </div>
          </div>

          {/* Email ou Téléphone selon la méthode choisie */}
          {formData.recoveryMethod === 'email' ? (
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:z-10 sm:text-sm"
                  placeholder="admin@destinyjobs.com"
                />
              </div>
            </div>
          ) : (
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Numéro de téléphone
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:z-10 sm:text-sm"
                  placeholder="+22912345678"
                />
              </div>
            </div>
          )}

          {/* Bouton de soumission */}
          <div>
            <button
              type="submit"
              disabled={loading || authLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || authLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Envoi en cours...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Envoyer la demande de récupération
                </>
              )}
            </button>
          </div>

          {/* Liens de navigation */}
          <div className="text-center space-y-2">
            <Link
              to={ROUTES.AUTH.LOGIN}
              className="font-medium text-fuchsia-600 hover:text-fuchsia-500"
            >
              Retour à la connexion
            </Link>
            <div className="text-sm text-gray-500">
              <span>Besoin d'aide ? </span>
              <a href="mailto:support@destinyjobs.bj" className="text-fuchsia-600 hover:text-fuchsia-500">
                Contactez le support
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ForgotPasswordAdmin 