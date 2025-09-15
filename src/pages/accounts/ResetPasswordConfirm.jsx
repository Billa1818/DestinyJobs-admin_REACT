import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import authService from '../../services/authService';

const ResetPasswordConfirm = () => {
  const { uid, token } = useParams();
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (!token || !uid) {
      setError('Lien de réinitialisation invalide');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await authService.resetPasswordConfirm({
        uid: uid,
        token: token,
        newPassword: formData.newPassword
      });
      
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!token || !uid) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="text-center text-white">
                <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-exclamation-triangle text-2xl"></i>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Lien invalide</h1>
                <p className="text-red-100 text-sm sm:text-base">
                  Le lien de réinitialisation est invalide
                </p>
              </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="max-w-md mx-auto text-center">
                <p className="text-gray-600 mb-6">
                  Le lien de réinitialisation ne contient pas les paramètres valides. 
                  Veuillez demander un nouveau lien de réinitialisation.
                </p>
                <Link
                  to="/reset-password"
                  className="inline-flex items-center px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Nouvelle demande de réinitialisation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="text-center text-white">
                <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-check text-2xl"></i>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mot de passe réinitialisé !</h1>
                <p className="text-green-100 text-sm sm:text-base">
                  Votre mot de passe a été modifié avec succès
                </p>
              </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              <div className="max-w-md mx-auto text-center">
                <p className="text-gray-600 mb-6">
                  Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 rounded-t-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="text-center text-white">
              <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-key text-2xl"></i>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Nouveau mot de passe</h1>
              <p className="text-fuchsia-100 text-sm sm:text-base">
                Choisissez votre nouveau mot de passe
              </p>
            </div>
          </div>
          
          {/* Reset Password Form */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="max-w-md mx-auto">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <div className="flex items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* New Password Field */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-lock mr-2 text-fuchsia-600"></i>
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    required
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
                    placeholder="Nouveau mot de passe"
                    minLength={8}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Le mot de passe doit contenir au moins 8 caractères
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-lock mr-2 text-fuchsia-600"></i>
                    Confirmer le mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
                        
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <span><i className="fas fa-spinner fa-spin mr-2"></i>Réinitialisation...</span>
                  ) : (
                    <span><i className="fas fa-check mr-2"></i>Réinitialiser le mot de passe</span>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="text-fuchsia-600 hover:text-fuchsia-700 text-sm font-medium"
                >
                  <i className="fas fa-arrow-left mr-1"></i>
                  Retour à la connexion
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm; 