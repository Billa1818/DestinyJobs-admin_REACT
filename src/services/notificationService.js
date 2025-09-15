import { apiClient } from './api';

/**
 * Service pour la gestion des notifications du recruteur
 * Basé sur la nouvelle documentation des endpoints
 */
class RecruteurNotificationService {
  
  /**
   * Récupérer la liste des notifications
   * GET /api/notifications/
   */
  async getNotifications(filters = {}, page = 1, pageSize = 20) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString(),
        ...filters
      });
      
      const response = await apiClient.get(`/api/notifications/?${params}`);
      console.log('🔍 DEBUG - Réponse API brute:', response);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  /**
   * Récupérer le détail d'une notification
   * GET /api/notifications/{notification_id}/
   */
  async getNotificationDetail(notificationId) {
    try {
      const response = await apiClient.get(`/api/notifications/${notificationId}/`);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération du détail de la notification:', error);
      throw error;
    }
  }

  /**
   * Marquer des notifications comme lues
   * POST /api/notifications/mark-as-read/
   */
  async markAsRead(notificationIds = []) {
    try {
      const payload = {
        notification_ids: notificationIds,
        mark_all: false
      };
      
      const response = await apiClient.post('/api/notifications/mark-as-read/', payload);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors du marquage comme lu:', error);
      throw error;
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   * POST /api/notifications/mark-as-read/
   */
  async markAllAsRead() {
    try {
      const payload = {
        mark_all: true
      };
      
      const response = await apiClient.post('/api/notifications/mark-as-read/', payload);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors du marquage de toutes les notifications:', error);
      throw error;
    }
  }

  /**
   * Récupérer les statistiques des notifications
   * GET /api/notifications/stats/
   */
  async getNotificationStats() {
    try {
      const response = await apiClient.get('/api/notifications/stats/');
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  /**
   * Récupérer les préférences de notification
   * GET /api/notifications/preferences/
   */
  async getNotificationPreferences() {
    try {
      const response = await apiClient.get('/api/notifications/preferences/');
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des préférences:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les préférences de notification
   * PUT /api/notifications/preferences/
   */
  async updateNotificationPreferences(preferences) {
    try {
      const response = await apiClient.put('/api/notifications/preferences/', preferences);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour des préférences:', error);
      throw error;
    }
  }

  /**
   * Envoyer une notification de candidature
   * POST /api/notifications/application/
   */
  async sendApplicationNotification(applicationId, status, message) {
    try {
      const payload = {
        application_id: applicationId,
        status: status,
        message: message
      };
      
      const response = await apiClient.post('/api/notifications/application/', payload);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notification de candidature:', error);
      throw error;
    }
  }

  /**
   * Envoyer une notification de service IA
   * POST /api/notifications/ai-service/
   */
  async sendAIServiceNotification(serviceType, data) {
    try {
      const payload = {
        service_type: serviceType,
        data: data
      };
      
      const response = await apiClient.post('/api/notifications/ai-service/', payload);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de l\'envoi de la notification de service IA:', error);
      throw error;
    }
  }

  /**
   * Récupérer les types de notifications disponibles
   * GET /api/notifications/types/
   */
  async getNotificationTypes() {
    try {
      const response = await apiClient.get('/api/notifications/types/');
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des types de notifications:', error);
      throw error;
    }
  }

  /**
   * Récupérer les analytics des notifications (admin seulement)
   * GET /api/notifications/analytics/
   */
  async getNotificationAnalytics(days = 30) {
    try {
      const params = new URLSearchParams({
        days: days.toString()
      });
      
      const response = await apiClient.get(`/api/notifications/analytics/?${params}`);
      return response;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des analytics:', error);
      throw error;
    }
  }

  /**
   * Récupérer les notifications non lues uniquement
   */
  async getUnreadNotifications(page = 1, pageSize = 20) {
    return this.getNotifications({ unread_only: true }, page, pageSize);
  }

  /**
   * Récupérer les notifications lues uniquement
   */
  async getReadNotifications(page = 1, pageSize = 20) {
    return this.getNotifications({ unread_only: false }, page, pageSize);
  }

  /**
   * Récupérer les notifications par type
   */
  async getNotificationsByType(notificationType, page = 1, pageSize = 20) {
    return this.getNotifications({ notification_type: notificationType }, page, pageSize);
  }

  /**
   * Récupérer les notifications par priorité
   */
  async getNotificationsByPriority(priority, page = 1, pageSize = 20) {
    return this.getNotifications({ priority: priority }, page, pageSize);
  }
}

export default new RecruteurNotificationService(); 