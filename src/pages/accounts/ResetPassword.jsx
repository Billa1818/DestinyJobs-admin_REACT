import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      await authService.resetPassword(email);
    setIsSubmitted(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-4xl">
          <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
            <div className="w-full">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-t-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <div className="text-center text-white">
                    <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                      <i className="fas fa-check text-2xl"></i>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Email envoyé !</h1>
                    <p className="text-green-100 text-sm sm:text-base">
                      Nous avons envoyé un lien de réinitialisation à votre adresse email
                    </p>
                                        </div>
                                    </div>
                <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <div className="max-w-md mx-auto text-center">
                    <p className="text-gray-600 mb-6">
                      Vérifiez votre boîte de réception et cliquez sur le lien pour réinitialiser votre mot de passe.
                    </p>
                    <Link
                      to="/login"
                      className="inline-flex items-center px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 transition duration-200 font-medium"
                    >
                      <i className="fas fa-arrow-left mr-2"></i>
                                            Retour à la connexion
                    </Link>
                                    </div>
                                </div>
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
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 rounded-t-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="text-center text-white">
                  <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-key text-2xl"></i>
                            </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Réinitialiser votre mot de passe</h1>
                  <p className="text-fuchsia-100 text-sm sm:text-base">
                    Entrez votre adresse email pour recevoir un lien de réinitialisation
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
                    {/* Email Field */}
                            <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-envelope mr-2 text-fuchsia-600"></i>
                        Adresse e-mail
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200"
                        placeholder="votre@email.com"
                      />
                        </div>
                        
                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50"
                    >
                      {loading ? (
                        <span><i className="fas fa-spinner fa-spin mr-2"></i>Envoi en cours...</span>
                      ) : (
                        <span><i className="fas fa-paper-plane mr-2"></i>Envoyer le lien de réinitialisation</span>
                      )}
                    </button>
                  </form>

                  {/* Back to Login */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                      Vous vous souvenez de votre mot de passe ?
                      <Link to="/login" className="font-medium text-fuchsia-600 hover:text-fuchsia-800 ml-1">
                        Se connecter
                      </Link>
                    </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
  );
};

export default ResetPassword;