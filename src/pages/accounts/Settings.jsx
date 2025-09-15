import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Settings = () => {
  const [selectedType, setSelectedType] = useState('');
  const navigate = useNavigate();

  const userTypes = [
    {
      id: 'candidat',
      name: 'Candidat',
      icon: 'fas fa-user-tie',
      description: 'Gérez votre profil candidat, CV et préférences',
      color: 'fuchsia',
      path: '/settings/candidats'
    },
    {
      id: 'recruteur',
      name: 'Recruteur',
      icon: 'fas fa-building',
      description: 'Gérez votre entreprise et vos offres d\'emploi',
      color: 'green',
      path: '/settings/recruteur'
    },
    {
      id: 'prestataire',
      name: 'Prestataire',
      icon: 'fas fa-tools',
      description: 'Gérez vos services et votre tarification',
      color: 'purple',
      path: '/settings/prestataire'
    }
  ];

  const handleTypeSelect = (type) => {
    setSelectedType(type.id);
    navigate(type.path);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">Choisissez votre type de compte pour accéder aux paramètres spécifiques</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userTypes.map((type) => (
            <div
              key={type.id}
              onClick={() => handleTypeSelect(type)}
              className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedType === type.id
                  ? `border-${type.color}-500 bg-${type.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${type.color}-100 mb-4`}>
                  <i className={`${type.icon} text-2xl text-${type.color}-600`}></i>
                </div>
                <h3 className={`text-xl font-semibold text-${type.color}-600 mb-2`}>
                  {type.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {type.description}
                </p>
                <button
                  className={`w-full bg-${type.color}-600 text-white px-4 py-2 rounded-md hover:bg-${type.color}-700 transition duration-200`}
                >
                  Accéder aux paramètres
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            <i className="fas fa-info-circle text-blue-600 mr-2"></i>
            Informations importantes
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              • Chaque type de compte a ses propres paramètres et fonctionnalités spécifiques
            </p>
            <p>
              • Vous pouvez modifier vos paramètres à tout moment en revenant sur cette page
            </p>
            <p>
              • Certains paramètres peuvent nécessiter une vérification de votre compte
            </p>
          </div>
        </div>

        {/* Liens rapides */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            to="/home"
            className="text-fuchsia-600 hover:text-fuchsia-800 font-medium text-sm transition duration-200"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Retour à l'accueil
          </Link>
          <Link
            to="/support"
            className="text-gray-600 hover:text-gray-800 font-medium text-sm transition duration-200"
          >
            <i className="fas fa-question-circle mr-2"></i>
            Besoin d'aide ?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
