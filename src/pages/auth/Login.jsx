import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routers'
import { useAuth } from '../../contexts/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login, error: authError, clearError } = useAuth()
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    rememberMe: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    clearError()

    try {
      // Appel à l'API d'authentification
      await login(formData)
      
      // Rediriger vers le dashboard après connexion réussie
      navigate(ROUTES.ADMIN.DASHBOARD)
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 flex items-center justify-center">
            <img src="/vite.svg" alt="Destiny Jobs" className="h-20 w-20" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accédez à votre tableau de bord administrateur
          </p>
        </div>

        {/* Formulaire */}
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Login (Email ou Username) */}
            <div>
              <label htmlFor="login" className="block text-sm font-medium text-gray-700">
                Email ou nom d'utilisateur
              </label>
              <div className="mt-1">
                <input
                  id="login"
                  name="login"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.login}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:z-10 sm:text-sm"
                  placeholder="admin@destinyjobs.com ou admin_username"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 focus:z-10 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to={ROUTES.PUBLIC.FORGOT_PASSWORD}
                  className="font-medium text-fuchsia-600 hover:text-fuchsia-500"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Se connecter
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Liens supplémentaires */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Nouveau sur Destiny Jobs ?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to={ROUTES.PUBLIC.REGISTER}
                className="font-medium text-fuchsia-600 hover:text-fuchsia-500"
              >
                Créer un compte administrateur
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>&copy; 2024 Destiny Jobs. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  )
}

export default Login 