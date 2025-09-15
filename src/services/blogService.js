import { apiClient, handleApiError } from './api';

const blogService = {
  // Récupérer tous les articles du blog (admin)
  async getBlogPosts(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Ajouter les filtres disponibles
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.author) queryParams.append('author', filters.author);
      if (filters.is_featured !== undefined) queryParams.append('is_featured', filters.is_featured);
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.ordering) queryParams.append('ordering', filters.ordering);
      
      const url = `/api/blog/posts/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Récupérer un article spécifique par slug
  async getBlogPost(slug) {
    try {
      const response = await apiClient.get(`/api/blog/posts/${slug}/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Créer un nouvel article
  async createBlogPost(postData) {
    try {
      const response = await apiClient.post('/api/blog/posts/create/', postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Mettre à jour un article existant
  async updateBlogPost(slug, postData) {
    try {
      const response = await apiClient.put(`/api/blog/posts/${slug}/update/`, postData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Supprimer un article
  async deleteBlogPost(slug) {
    try {
      const response = await apiClient.delete(`/api/blog/posts/${slug}/delete/`);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Changer le statut d'un article
  async changePostStatus(slug, status) {
    try {
      const response = await apiClient.patch(`/api/blog/posts/${slug}/update/`, { status });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Mettre en vedette/retirer de la vedette
  async toggleFeatured(slug, isFeatured) {
    try {
      const response = await apiClient.patch(`/api/blog/posts/${slug}/update/`, { is_featured: isFeatured });
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Récupérer les statistiques du blog
  async getBlogStats() {
    try {
      const response = await apiClient.get('/api/blog/stats/');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Récupérer les catégories
  async getCategories() {
    try {
      const response = await apiClient.get('/api/blog/categories/');
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  },

  // Recherche avancée
  async searchPosts(searchParams) {
    try {
      const response = await apiClient.post('/api/blog/search/', searchParams);
      return response;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
};

export default blogService; 