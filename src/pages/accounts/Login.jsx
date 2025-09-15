import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../components/MessageManager';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    login: '', // Peut être email ou username
    password: '',
    remember: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login, socialLogin, isAuthenticated, user } = useAuth();
  const { error: showError, info, success } = useMessage();
  const navigate = useNavigate();
  const location = useLocation();

  // Vérifier si l'email a été vérifié
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('email_verified') === 'true') {
      success('Email vérifié !', 'Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.');
      // Nettoyer l'URL
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate, success]);

  // Supprimer le useEffect de redirection automatique pour éviter la double redirection
  // La redirection sera gérée par le composant ProtectedRoute

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    console.log('Login: handleInputChange - name:', name, 'value:', value, 'type:', type);
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      console.log('Login: handleInputChange - prev:', prev, 'newData:', newData);
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation améliorée côté client
    const loginValue = formData.login?.trim();
    const passwordValue = formData.password?.trim();
    
    console.log('Login: Validation - loginValue:', loginValue, 'passwordValue:', passwordValue);
    console.log('Login: Validation - loginValue.length:', loginValue?.length, 'passwordValue.length:', passwordValue?.length);
    
    if (!loginValue || loginValue.length === 0) {
      showError('Erreur de validation', 'Veuillez saisir votre email ou nom d\'utilisateur');
      return;
    }
    
    if (!passwordValue || passwordValue.length === 0) {
      showError('Erreur de validation', 'Veuillez saisir votre mot de passe');
      return;
    }
    
    if (passwordValue.length < 6) {
      showError('Erreur de validation', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    console.log('Login: Données du formulaire:', formData);
    console.log('Login: Données validées:', { login: loginValue, password: passwordValue });
    console.log('Login: URL de l\'API:', 'http://localhost:8000/api/auth/login/');
    
    setIsLoading(true);
    
    try {
      const credentials = {
        login: loginValue,  // Le backend Django attend 'login', pas 'email'
        password: passwordValue
      };
      
      console.log('Login: Envoi des credentials:', credentials);
      console.log('Login: Type des credentials:', typeof credentials.login, typeof credentials.password);
      
      const response = await login(credentials);
      // Redirection manuelle après connexion réussie
      success('Connexion réussie', 'Bienvenue sur Destiny Jobs !');
      
      // Rediriger selon le type d'utilisateur
      if (response.user.user_type === 'recruteur') {
        navigate('/recruteur/dashboard');
      } else if (response.user.user_type === 'prestataire') {
        navigate('/prestataire/home');
      } else if (response.user.user_type === 'candidat') {
        navigate('/candidat');
      } else {
        navigate('/home');
      }
    } catch (error) {
      console.error('Login: Erreur complète:', error);
      console.error('Login: Response data:', error.response?.data);
      console.error('Login: Status:', error.response?.status);
      console.error('Login: Headers:', error.response?.headers);
      
      // Extraire le message d'erreur spécifique du backend
      let errorMessage = 'Erreur de connexion';
      let errorTitle = 'Erreur de connexion';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Gérer les erreurs de validation Django
        if (errorData.login && Array.isArray(errorData.login)) {
          errorMessage = errorData.login[0];
          errorTitle = 'Erreur de validation';
        } else if (errorData.password && Array.isArray(errorData.password)) {
          errorMessage = errorData.password[0];
          errorTitle = 'Erreur de validation';
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          errorMessage = errorData.non_field_errors[0];
          errorTitle = 'Erreur d\'authentification';
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (typeof errorData === 'object') {
          // Extraire tous les messages d'erreur
          const allErrors = [];
          Object.keys(errorData).forEach(key => {
            if (Array.isArray(errorData[key])) {
              allErrors.push(...errorData[key]);
            }
          });
          if (allErrors.length > 0) {
            errorMessage = allErrors.join(', ');
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError(errorTitle, errorMessage);
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    try {
      // Cette fonction sera implémentée quand les providers sociaux seront configurés
      info('Fonctionnalité en développement', `Connexion ${provider} en cours de développement`);
      
      // Exemple d'utilisation future :
      // const socialData = await getSocialToken(provider);
      // await socialLogin(socialData);
    } catch (error) {
      console.error(`Erreur de connexion ${provider}:`, error);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center py-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
          {/* Main Content - Login Page */}
          <div className="w-full">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-fuchsia-600 to-fuchsia-700 rounded-t-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="text-center text-white">
                  <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-user text-2xl"></i>
                            </div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2">Connexion à votre compte</h1>
                  <p className="text-fuchsia-100 text-sm sm:text-base">Accédez à votre espace personnel Destiny Jobs</p>
                        </div>
                    </div>

              {/* Login Form */}
              <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="max-w-md mx-auto">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Login Field */}
                                <div>
                      <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-envelope mr-2 text-fuchsia-600"></i>
                                        Email ou nom d'utilisateur
                                    </label>
                      <input 
                        type="text" 
                        id="login" 
                        name="login" 
                        required
                        value={formData.login}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200 disabled:opacity-50"
                        placeholder="votre@email.com ou nom d'utilisateur"
                      />
                                </div>

                    {/* Password Field */}
                                <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-lock mr-2 text-fuchsia-600"></i>
                                        Mot de passe
                                    </label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"} 
                          id="password" 
                          name="password" 
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent transition duration-200 pr-12 disabled:opacity-50"
                          placeholder="••••••••"
                        />
                        <button 
                          type="button" 
                          onClick={togglePassword} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="remember" 
                          name="remember" 
                          checked={formData.remember}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-fuchsia-600 focus:ring-fuchsia-500 border-gray-300 rounded"
                        />
                        <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                            Se souvenir de moi
                                        </label>
                                    </div>
                      <Link to="/reset-password" className="text-sm text-fuchsia-600 hover:text-fuchsia-800 font-medium">
                                        Mot de passe oublié ?
                      </Link>
                                </div>



                    {/* Login Button */}
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-fuchsia-600 text-white py-3 px-4 rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
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

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                                    </div>
                                </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        type="button" 
                        onClick={() => handleSocialLogin('Google')}
                        disabled={isLoading}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fab fa-google mr-2 text-red-500"></i>
                                        Google
                                    </button>
                      <button 
                        type="button" 
                        onClick={() => handleSocialLogin('LinkedIn')}
                        disabled={isLoading}
                        className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fab fa-linkedin mr-2 text-fuchsia-600"></i>
                                        LinkedIn
                                    </button>
                                </div>
                            </form>

                  {/* Sign Up Link */}
                  <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600">
                                    Vous n'avez pas encore de compte ?
                      <Link to="/signup" className="font-medium text-fuchsia-600 hover:text-fuchsia-800 ml-1">
                                        Créer un compte
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

export default Login;
