import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogService } from '../../../services';

export default function BlogEdit() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'DRAFT',
    is_featured: false,
    featured_image: null,
    meta_description: '',
    publish_date: ''
  });

  // Charger l'article et les catégories au montage
  useEffect(() => {
    if (slug) {
      loadBlogData();
    }
  }, [slug]);

  const loadBlogData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger l'article
      const postData = await blogService.getBlogPost(slug);
      setPost(postData);

      // Préparer les données du formulaire
      let tagsString = '';
      if (postData.tags) {
        if (Array.isArray(postData.tags)) {
          // Si c'est un tableau, le joindre avec des virgules
          tagsString = postData.tags.length > 0 ? postData.tags.join(', ') : '';
        } else if (typeof postData.tags === 'string') {
          // Si c'est déjà une chaîne, l'utiliser directement
          tagsString = postData.tags;
        }
      }

      setFormData({
        title: postData.title || '',
        excerpt: postData.excerpt || '',
        content: postData.content || '',
        category: postData.category?.id || '',
        tags: tagsString,
        status: postData.status || 'DRAFT',
        is_featured: postData.is_featured || false,
        featured_image: null,
        meta_description: postData.meta_description || '',
        publish_date: postData.publish_date ? postData.publish_date.slice(0, 16) : ''
      });

      // Charger les catégories
      const categoriesData = await blogService.getCategories();
      setCategories(categoriesData);

    } catch (err) {
      console.error('Erreur lors du chargement des données:', err);
      setError('Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  // Gérer les changements de formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Gérer le changement d'image
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      // Vérifier le type de fichier
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setError('Format d\'image non supporté. Utilisez JPEG, PNG ou GIF.');
        return;
      }

      setFormData(prev => ({
        ...prev,
        featured_image: file
      }));
      setError(null); // Effacer l'erreur précédente
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);

      // Préparer les données
      const postData = new FormData();
      postData.append('title', formData.title);
      postData.append('excerpt', formData.excerpt);
      postData.append('content', formData.content);
      postData.append('category', formData.category);
      postData.append('status', formData.status);
      postData.append('is_featured', formData.is_featured);
      postData.append('meta_description', formData.meta_description);
      
      // Ajouter les tags
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        postData.append('tags', tagsArray.join(', '));
      }
      
      // Ajouter la date de publication si le statut est PUBLISHED
      if (formData.status === 'PUBLISHED' && formData.publish_date) {
        postData.append('publish_date', formData.publish_date);
      }
      
      // Ajouter l'image si présente
      if (formData.featured_image) {
        postData.append('featured_image', formData.featured_image);
      }

      // Mettre à jour l'article
      await blogService.updateBlogPost(slug, postData);
      
      // Rediriger vers la liste des articles
      navigate('/blog');
      
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l\'article:', err);
      setError(err.message || 'Erreur lors de la mise à jour de l\'article');
    } finally {
      setSaving(false);
    }
  };

  // Prévisualiser l'image
  const previewImage = formData.featured_image 
    ? URL.createObjectURL(formData.featured_image) 
    : post?.featured_image;

  // Obtenir la date minimale (aujourd'hui)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Article non trouvé</h2>
            <p className="text-gray-600 mb-6">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Modifier l'article</h1>
              <p className="mt-2 text-gray-600">Modifiez le contenu et les paramètres de votre article</p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <span>
                  <i className="fas fa-user mr-1"></i>
                  {post.author ? `${post.author.first_name} ${post.author.last_name}` : post.author?.username || 'Inconnu'}
                </span>
                <span>
                  <i className="fas fa-calendar mr-1"></i>
                  Créé le {new Date(post.created_at).toLocaleDateString('fr-FR')}
                </span>
                {post.updated_at !== post.created_at && (
                  <span>
                    <i className="fas fa-edit mr-1"></i>
                    Modifié le {new Date(post.updated_at).toLocaleDateString('fr-FR')}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Retour
            </button>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4">
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

            {/* Titre */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Titre de l'article *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Entrez le titre de votre article"
              />
            </div>

            {/* Extrait */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Extrait
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Résumé court de l'article (optionnel)"
              />
            </div>

            {/* Contenu */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Contenu de l'article *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Rédigez le contenu complet de votre article..."
              />
            </div>

            {/* Catégorie et statut */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="DRAFT">Brouillon</option>
                  <option value="PENDING">En attente d'approbation</option>
                  <option value="PUBLISHED">Publié</option>
                  <option value="ARCHIVED">Archivé</option>
                </select>
              </div>
            </div>

            {/* Date de publication (visible seulement si PUBLISHED) */}
            {formData.status === 'PUBLISHED' && (
              <div>
                <label htmlFor="publish_date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de publication
                </label>
                <input
                  type="datetime-local"
                  id="publish_date"
                  name="publish_date"
                  value={formData.publish_date}
                  onChange={handleInputChange}
                  min={getMinDate()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Laissez vide pour publier immédiatement
                </p>
              </div>
            )}

            {/* Meta description */}
            <div>
              <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                Description SEO (Meta Description)
              </label>
              <textarea
                id="meta_description"
                name="meta_description"
                value={formData.meta_description}
                onChange={handleInputChange}
                rows={2}
                maxLength={160}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Description pour le référencement (max 160 caractères)"
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.meta_description.length}/160 caractères
              </p>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="tag1, tag2, tag3 (séparés par des virgules)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Séparez les tags par des virgules pour une meilleure organisation
              </p>
            </div>

            {/* Image d'en-tête */}
            <div>
              <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 mb-2">
                Image d'en-tête
              </label>
              <input
                type="file"
                id="featured_image"
                name="featured_image"
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/gif"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {previewImage && (
                <div className="mt-3">
                  <img
                    src={previewImage}
                    alt="Aperçu"
                    className="h-32 w-auto rounded-lg object-cover"
                  />
                </div>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Laissez vide pour conserver l'image actuelle. Formats acceptés : JPEG, PNG, GIF. Taille max : 5MB.
              </p>
            </div>

            {/* Options */}
            <div className="flex items-center">
              <input
                id="is_featured"
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                Mettre en vedette
              </label>
            </div>

            {/* Statistiques de l'article */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Statistiques de l'article</h4>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{post.views_count || 0}</div>
                <div className="text-gray-500">Vues</div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/blog')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Sauvegarder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 