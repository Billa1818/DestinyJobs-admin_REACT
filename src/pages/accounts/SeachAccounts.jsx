import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SeachAccounts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    // Simuler une recherche
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          name: 'Jean Dupont',
          email: 'jean.dupont@example.com',
          type: 'candidat',
          avatar: 'https://via.placeholder.com/40',
          lastSeen: 'Il y a 2 jours'
        },
        {
          id: 2,
          name: 'Marie Martin',
          email: 'marie.martin@example.com',
          type: 'recruteur',
          avatar: 'https://via.placeholder.com/40',
          lastSeen: 'Il y a 1 semaine'
        },
        {
          id: 3,
          name: 'Pierre Durand',
          email: 'pierre.durand@example.com',
          type: 'prestataire',
          avatar: 'https://via.placeholder.com/40',
          lastSeen: 'Il y a 3 jours'
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1000);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'candidat':
        return 'fuchsia';
      case 'recruteur':
        return 'green';
      case 'prestataire':
        return 'purple';
      default:
        return 'gray';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'candidat':
        return 'fas fa-user';
      case 'recruteur':
        return 'fas fa-building';
      case 'prestataire':
        return 'fas fa-handshake';
      default:
        return 'fas fa-user';
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 lg:gap-6">
        {/* Main Content */}
        <div className="xl:w-2/3">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900">Rechercher des comptes</h1>
              <p className="text-gray-600 mt-1">Trouvez des utilisateurs sur Destiny Jobs</p>
            </div>

            {/* Search Form */}
            <div className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    <i className="fas fa-search mr-2 text-fuchsia-600"></i>
                    Rechercher par nom, email ou type d'utilisateur
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
                      placeholder="Entrez un nom, email ou type d'utilisateur..."
                    />
                    <button
                      type="submit"
                      disabled={isSearching}
                      className="px-6 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50"
                    >
                      {isSearching ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Recherche...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-search mr-2"></i>
                          Rechercher
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Résultats de recherche ({searchResults.length})
                  </h2>
                  <div className="space-y-4">
                    {searchResults.map((user) => (
                      <div
                        key={user.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition duration-200"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{user.name}</h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-${getTypeColor(user.type)}-100 text-${getTypeColor(user.type)}-800`}>
                                <i className={`${getTypeIcon(user.type)} mr-1`}></i>
                                {user.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <p className="text-xs text-gray-500">Dernière connexion : {user.lastSeen}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 text-sm text-fuchsia-600 hover:text-fuchsia-800 font-medium">
                              <i className="fas fa-eye mr-1"></i>
                              Voir profil
                            </button>
                            <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800">
                              <i className="fas fa-envelope mr-1"></i>
                              Contacter
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchTerm && searchResults.length === 0 && !isSearching && (
                <div className="mt-8 text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-search text-gray-400 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat trouvé</h3>
                  <p className="text-gray-600">
                    Aucun utilisateur ne correspond à votre recherche "{searchTerm}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:w-1/3">
          <div className="space-y-6">
            {/* Search Tips */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-lightbulb mr-2 text-yellow-600"></i>
                Conseils de recherche
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-fuchsia-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-user text-fuchsia-600 text-xs"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Recherche par nom</h4>
                    <p className="text-xs text-gray-600">Entrez le nom complet ou partiel de l'utilisateur</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-envelope text-green-600 text-xs"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Recherche par email</h4>
                    <p className="text-xs text-gray-600">Utilisez l'adresse email complète ou partielle</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-tags text-purple-600 text-xs"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Recherche par type</h4>
                    <p className="text-xs text-gray-600">Filtrez par candidat, recruteur ou prestataire</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Searches */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-history mr-2 text-gray-600"></i>
                Recherches récentes
              </h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition duration-200">
                  <i className="fas fa-search mr-2 text-gray-400"></i>
                  Jean Dupont
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition duration-200">
                  <i className="fas fa-search mr-2 text-gray-400"></i>
                  recruteur
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition duration-200">
                  <i className="fas fa-search mr-2 text-gray-400"></i>
                  marie@example.com
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="fas fa-bolt mr-2 text-blue-600"></i>
                Actions rapides
              </h3>
              <div className="space-y-3">
                <Link
                  to="/signup"
                  className="flex items-center px-4 py-2 text-sm text-fuchsia-600 hover:bg-fuchsia-50 rounded-md transition duration-200"
                >
                  <i className="fas fa-user-plus mr-3"></i>
                  Créer un nouveau compte
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-md transition duration-200"
                >
                  <i className="fas fa-headset mr-3"></i>
                  Besoin d'aide ?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeachAccounts;
