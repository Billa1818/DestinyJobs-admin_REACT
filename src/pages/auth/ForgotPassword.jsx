import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../routers'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Implémenter la logique de récupération
      console.log('Récupération mot de passe pour:', email)
      
      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
    } catch (err) {
      setError('Erreur lors de l\'envoi de l\'email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-20 w-20 flex items-center justify-center">
              <i className="fas fa-check-circle text-green-500 text-6xl"></i>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Email envoyé !
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Vérifiez votre boîte de réception pour réinitialiser votre mot de passe.
            </p>
          </div>
          <div className="text-center">
            <Link
              to={ROUTES.PUBLIC.LOGIN}
              className="font-medium text-fuchsia-600 hover:text-fuchsia-500"
            >
              Retour à la connexion
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
          <div className="mx-auto h-20 w-20 flex items-center justify-center">
            <img src="/vite.svg" alt="Destiny Jobs" className="h-20 w-20" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Mot de passe oublié ?
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500 sm:text-sm"
                placeholder="admin@destinyjobs.com"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to={ROUTES.PUBLIC.LOGIN}
                className="font-medium text-fuchsia-600 hover:text-fuchsia-500"
              >
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword 