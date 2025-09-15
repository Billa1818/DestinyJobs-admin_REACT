import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../../../services';

export default function BlogCreate() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    status: 'PUBLISHED',
    is_featured: false,
    featured_image: null,
    meta_description: '',
    publish_date: new Date().toISOString().slice(0, 16)
  });

  // Charger les catégories au montage
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoriesData = await blogService.getCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
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
      setLoading(true);
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
      
      // Ajouter la date de publication (définie par défaut)
      postData.append('publish_date', formData.publish_date);
      
      // Ajouter l'image si présente
      if (formData.featured_image) {
        postData.append('featured_image', formData.featured_image);
      }

      // Créer l'article
      await blogService.createBlogPost(postData);
      
      // Rediriger vers la liste des articles
      navigate('/blog');
      
    } catch (err) {
      console.error('Erreur lors de la création de l\'article:', err);
      setError(err.message || 'Erreur lors de la création de l\'article');
    } finally {
      setLoading(false);
    }
  };

  // Prévisualiser l'image
  const previewImage = formData.featured_image ? URL.createObjectURL(formData.featured_image) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Créer un nouvel article</h1>
              <p className="mt-2 text-gray-600">Rédigez et publiez un nouvel article pour votre blog</p>
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

            {/* Catégorie */}
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
                Formats acceptés : JPEG, PNG, GIF. Taille max : 5MB. Recommandé : 1200x630px
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
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Création...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save mr-2"></i>
                    Créer l'article
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