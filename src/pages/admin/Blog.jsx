import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../../services';

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    author: '',
    is_featured: '',
    search: '',
    ordering: '-created_at'
  });
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);

  // Charger les articles et données initiales
  useEffect(() => {
    loadBlogData();
  }, [filters]);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les articles avec les filtres
      const postsData = await blogService.getBlogPosts(filters);
      setPosts(postsData);

      // Charger les catégories
      const categoriesData = await blogService.getCategories();
      setCategories(categoriesData);

      // Charger les statistiques
      const statsData = await blogService.getBlogStats();
      setStats(statsData);

    } catch (err) {
      console.error('Erreur lors du chargement des données du blog:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Gérer les changements de filtres
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Réinitialiser les filtres
  const resetFilters = () => {
    setFilters({
      status: '',
      category: '',
      author: '',
      is_featured: '',
      search: '',
      ordering: '-created_at'
    });
  };

  // Obtenir le badge de statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      'DRAFT': { color: 'bg-gray-100 text-gray-800', label: 'Brouillon' },
      'PENDING': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      'PUBLISHED': { color: 'bg-green-100 text-green-800', label: 'Publié' },
      'ARCHIVED': { color: 'bg-red-100 text-red-800', label: 'Archivé' }
    };

    const config = statusConfig[status] || statusConfig['DRAFT'];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Obtenir le nom de l'auteur
  const getAuthorName = (author) => {
    if (!author) return 'Inconnu';
    if (author.first_name && author.last_name) {
      return `${author.first_name} ${author.last_name}`;
    }
    return author.username || 'Inconnu';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion du Blog</h1>
              <p className="mt-2 text-gray-600">Gérez tous les articles et contenus du blog</p>
            </div>
            <Link
              to="/blog/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i className="fas fa-plus mr-2"></i>
              Nouvel Article
            </Link>
          </div>

          {/* Statistiques */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-newspaper text-2xl text-blue-600"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Articles</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.total_posts || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <i className="fas fa-eye text-2xl text-green-600"></i>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Vues</dt>
                        <dd className="text-lg font-medium text-gray-900">{stats.total_views || 0}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filtres */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Filtres et Recherche</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* Recherche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Tous</option>
                  <option value="DRAFT">Brouillon</option>
                  <option value="PENDING">En attente</option>
                  <option value="PUBLISHED">Publié</option>
                  <option value="ARCHIVED">Archivé</option>
                </select>
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Toutes</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* En vedette */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">En vedette</label>
                <select
                  value={filters.is_featured}
                  onChange={(e) => handleFilterChange('is_featured', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Tous</option>
                  <option value="true">En vedette</option>
                  <option value="false">Non vedette</option>
                </select>
              </div>

              {/* Tri */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tri</label>
                <select
                  value={filters.ordering}
                  onChange={(e) => handleFilterChange('ordering', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="-created_at">Plus récent</option>
                  <option value="created_at">Plus ancien</option>
                  <option value="-publish_date">Date publication ↓</option>
                  <option value="publish_date">Date publication ↑</option>
                  <option value="-views_count">Plus vus</option>
                </select>
              </div>

              {/* Bouton réinitialiser */}
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-undo mr-2"></i>
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des articles */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Articles ({posts.length})
            </h3>
          </div>

          {error && (
            <div className="px-6 py-4 bg-red-50 border-l-4 border-red-400">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fas fa-exclamation-circle text-red-400"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <i className="fas fa-newspaper text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun article trouvé</h3>
              <p className="text-gray-500">
                {filters.status || filters.search ? 'Essayez de modifier vos filtres' : 'Commencez par créer votre premier article'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {posts.map((post) => (
                <li key={post.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        {/* Image d'en-tête */}
                        {post.featured_image && (
                          <div className="flex-shrink-0 h-16 w-16">
                            <img
                              className="h-16 w-16 rounded-lg object-cover"
                              src={post.featured_image}
                              alt={post.title}
                            />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          {/* Titre et statut */}
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-medium text-gray-900 truncate">
                              {post.title}
                            </h4>
                            {getStatusBadge(post.status)}
                            {post.is_featured && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <i className="fas fa-star mr-1"></i>
                                Vedette
                              </span>
                            )}
                          </div>

                          {/* Extrait */}
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {post.excerpt || 'Aucun extrait disponible'}
                          </p>

                          {/* Métadonnées */}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>
                              <i className="fas fa-user mr-1"></i>
                              {getAuthorName(post.author)}
                            </span>
                            {post.category && (
                              <span>
                                <i className="fas fa-tag mr-1"></i>
                                {post.category.name}
                              </span>
                            )}
                            <span>
                              <i className="fas fa-calendar mr-1"></i>
                              {formatDate(post.created_at)}
                            </span>
                            {post.publish_date && (
                              <span>
                                <i className="fas fa-globe mr-1"></i>
                                Publié: {formatDate(post.publish_date)}
                              </span>
                            )}
                          </div>

                          {/* Statistiques */}
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>
                              <i className="fas fa-eye mr-1"></i>
                              {post.views_count || 0} vues
                            </span>
                          </div>

                          {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {/* Voir l'aperçu public */}
                      <a
                        href={`http://localhost:3000/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <i className="fas fa-external-link-alt mr-1"></i>
                        Voir aperçu
                      </a>

                      {/* Modifier l'article */}
                      <Link
                        to={`/blog/edit/${post.slug}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Modifier
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
} 