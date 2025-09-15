import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

const VerifyEmail = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        setStatus('verifying');
        setMessage('Vérification de votre email en cours...');

        // Appeler l'API pour vérifier l'email
        const response = await authService.verifyEmail(uid, token);
        
        setStatus('success');
        setMessage('Email vérifié avec succès ! Redirection en cours...');

        // Rediriger vers la page de connexion avec un message de succès
        setTimeout(() => {
          navigate('/login?email_verified=true');
        }, 2000);

      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('UID:', uid);
        console.error('Token:', token);
        
        setStatus('error');
        
        if (error.response?.status === 400) {
          setMessage('Lien de vérification invalide ou expiré. Veuillez demander un nouveau lien.');
        } else if (error.response?.status === 404) {
          setMessage('Lien de vérification introuvable. Veuillez vérifier votre email.');
        } else if (error.response?.status === 401) {
          setMessage('Session expirée. Veuillez vous reconnecter et réessayer.');
        } else if (error.response?.status === 403) {
          setMessage('Accès refusé. Veuillez vérifier vos permissions.');
        } else if (error.code === 'ERR_NETWORK') {
          setMessage('Erreur de connexion au serveur. Vérifiez votre connexion internet.');
        } else {
          setMessage(`Erreur lors de la vérification (${error.response?.status || 'inconnu'}). Veuillez réessayer ou contacter le support.`);
        }
      }
    };

    if (uid && token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Lien de vérification invalide. Paramètres manquants.');
    }
  }, [uid, token, navigate]);

  const handleRequestNewVerification = async () => {
    if (!isAuthenticated) {
      setMessage('Vous devez être connecté pour demander un nouveau lien de vérification.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      return;
    }

    try {
      setStatus('verifying');
      setMessage('Envoi d\'un nouveau lien de vérification...');
      
      await authService.requestEmailVerification();
      
      setStatus('success');
      setMessage('Nouveau lien de vérification envoyé ! Vérifiez votre boîte de réception.');
      
      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Erreur lors de la demande de nouveau lien:', error);
      setStatus('error');
      
      if (error.response?.status === 401) {
        setMessage('Session expirée. Veuillez vous reconnecter pour demander un nouveau lien.');
      } else if (error.response?.status === 429) {
        setMessage('Trop de demandes. Veuillez attendre quelques minutes avant de réessayer.');
      } else {
        setMessage('Erreur lors de l\'envoi du nouveau lien. Veuillez réessayer.');
      }
    }
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Vérification d'Email
          </h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Statut de vérification */}
          <div className="text-center">
            {status === 'verifying' && (
              <div className="mb-6">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Vérification en cours...
                </h3>
                <p className="text-gray-600">{message}</p>
              </div>
            )}

            {status === 'success' && (
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <i className="fas fa-check text-green-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-medium text-green-900 mb-2">
                  Email vérifié !
                </h3>
                <p className="text-green-600">{message}</p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
                </div>
                <h3 className="text-lg font-medium text-red-900 mb-2">
                  Échec de la vérification
                </h3>
                <p className="text-red-600">{message}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {status === 'success' && (
              <button
                onClick={handleGoToLogin}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition duration-200"
              >
                <i className="fas fa-sign-in-alt mr-2"></i>
                Aller à la connexion
              </button>
            )}

            {status === 'error' && (
              <>
                {isAuthenticated ? (
                  <button
                    onClick={handleRequestNewVerification}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
                  >
                    <i className="fas fa-envelope mr-2"></i>
                    Demander un nouveau lien
                  </button>
                ) : (
                  <div className="text-center mb-3">
                    <p className="text-sm text-gray-600 mb-2">
                      Vous devez être connecté pour demander un nouveau lien
                    </p>
                    <button
                      onClick={handleGoToLogin}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition duration-200"
                    >
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      Se connecter
                    </button>
                  </div>
                )}
                
                <button
                  onClick={handleGoToLogin}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 transition duration-200"
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  Retour à la connexion
                </button>
              </>
            )}
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Si vous rencontrez des problèmes, contactez notre support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 