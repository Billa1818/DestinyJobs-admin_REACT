import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const ChangePassword = () => {
  const { changePassword } = useAuth()
  const [formData, setFormData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    setSuccess('')

    // Validation
    if (formData.new_password !== formData.confirm_password) {
      setError('Les nouveaux mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (formData.new_password.length < 8) {
      setError('Le nouveau mot de passe doit contenir au moins 8 caractères')
      setLoading(false)
      return
    }

    try {
      const result = await changePassword({
        old_password: formData.old_password,
        new_password: formData.new_password
      })
      
      setSuccess(result.message || 'Mot de passe modifié avec succès')
      setFormData({
        old_password: '',
        new_password: '',
        confirm_password: ''
      })
    } catch (err) {
      setError(err.message || 'Erreur lors du changement de mot de passe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Changer le mot de passe</h1>
        <p className="mt-2 text-gray-600">Mettez à jour votre mot de passe pour sécuriser votre compte</p>
      </div>

      {/* Messages */}
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

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-check-circle text-green-400"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire */}
      <div className="bg-white shadow rounded-lg">
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Ancien mot de passe */}
          <div>
            <label htmlFor="old_password" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe actuel *
            </label>
            <input
              type="password"
              id="old_password"
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
              placeholder="••••••••"
            />
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe *
            </label>
            <input
              type="password"
              id="new_password"
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              required
              minLength={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
              placeholder="••••••••"
            />
            <p className="mt-1 text-sm text-gray-500">
              Le mot de passe doit contenir au moins 8 caractères
            </p>
          </div>

          {/* Confirmation du nouveau mot de passe */}
          <div>
            <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le nouveau mot de passe *
            </label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-fuchsia-500 focus:border-fuchsia-500"
              placeholder="••••••••"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Modification...
                </>
              ) : (
                <>
                  <i className="fas fa-key mr-2"></i>
                  Changer le mot de passe
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Conseils de sécurité */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-md p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          <i className="fas fa-shield-alt mr-2"></i>
          Conseils de sécurité
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Utilisez au moins 8 caractères</li>
          <li>• Combinez lettres, chiffres et symboles</li>
          <li>• Évitez les informations personnelles</li>
          <li>• Ne partagez jamais votre mot de passe</li>
        </ul>
      </div>
    </div>
  )
}

export default ChangePassword 