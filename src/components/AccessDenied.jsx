import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AccessDenied = ({ redirectPath = '/login', countdown = 2 }) => {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(countdown)

  useEffect(() => {
    if (timeLeft <= 0) {
      navigate(redirectPath, { replace: true })
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, navigate, redirectPath])

  const handleRedirectNow = () => {
    navigate(redirectPath, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Icône d'alerte */}
        <div className="mb-6">
          <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center">
            <i className="fas fa-exclamation-triangle text-red-600 text-4xl"></i>
          </div>
        </div>

        {/* Titre et message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Accès refusé
        </h1>
        <p className="text-gray-600 mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        {/* Compte à rebours */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center space-x-2">
            <i className="fas fa-clock text-blue-500"></i>
            <span className="text-blue-700 font-medium">
              Redirection automatique dans
            </span>
            <span className="text-2xl font-bold text-blue-600">
              {timeLeft}
            </span>
            <span className="text-blue-700 font-medium">
              seconde{timeLeft > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Barre de progression */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-linear"
            style={{ width: `${((countdown - timeLeft) / countdown) * 100}%` }}
          ></div>
        </div>

        {/* Bouton de redirection immédiate */}
        <button
          onClick={handleRedirectNow}
          className="w-full px-6 py-3 bg-fuchsia-600 text-white font-medium rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition-colors"
        >
          <i className="fas fa-sign-in-alt mr-2"></i>
          Se connecter maintenant
        </button>

        {/* Informations supplémentaires */}
        <div className="mt-6 text-sm text-gray-500">
          <p>Si vous pensez qu'il s'agit d'une erreur,</p>
          <p>contactez votre administrateur système.</p>
        </div>
      </div>
    </div>
  )
}

export default AccessDenied 