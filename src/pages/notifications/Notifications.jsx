import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecruteurNotificationService from '../../services/notificationService';
import Loader from '../../components/Loader';

const Notifications = () => {
    console.log('🎯 DEBUG - Composant Notifications rendu');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        total_notifications: 0,
        unread_count: 0,
        read_count: 0,
        by_type: [],
        by_priority: []
    });
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        pageSize: 20,
        totalCount: 0
    });
    const [activeTab, setActiveTab] = useState('all');
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [bulkActionLoading, setBulkActionLoading] = useState(false);

    // Types de notifications à exclure
    const EXCLUDED_NOTIFICATION_TYPES = ['NEW_PROVIDER', 'RECRUITER_ACCOUNT_PENDING', 'OFFER_REJECTED', 'APPLICATION_STATUS', 'AI_SERVICE_ERROR'];

    // Charger les notifications
    const loadNotifications = async (page = 1, filters = {}) => {
        console.log('🔍 DEBUG - Fonction loadNotifications appelée avec:', { page, filters, pageSize: pagination.pageSize });
        try {
            setLoading(true);
            setError(null);

            console.log('🔍 DEBUG - Chargement des notifications:', { page, filters, pageSize: pagination.pageSize });

            const response = await RecruteurNotificationService.getNotifications(filters, page, pagination.pageSize);

            console.log('✅ DEBUG - Réponse API reçue:', response);

            // Adapter la structure de réponse selon la nouvelle API
            const notificationsData = response.notifications || response.results || [];
            const paginationData = response.pagination || {
                currentPage: page,
                totalPages: Math.ceil((response.count || 0) / pagination.pageSize),
                pageSize: pagination.pageSize,
                totalCount: response.count || 0
            };

            setNotifications(notificationsData);
            setPagination(paginationData);

        } catch (err) {
            console.error('❌ DEBUG - Erreur détaillée lors du chargement:', {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                config: err.config
            });
            setError('Erreur lors du chargement des notifications');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    // Charger les statistiques
    const loadStats = async () => {
        console.log('📊 DEBUG - Fonction loadStats appelée');
        try {
            console.log('📊 DEBUG - Chargement des statistiques...');
            const statsData = await RecruteurNotificationService.getNotificationStats();
            console.log('✅ DEBUG - Statistiques reçues:', statsData);
            setStats(statsData);
        } catch (error) {
            console.error('❌ DEBUG - Erreur lors du chargement des statistiques:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    };

    // Charger les données au montage du composant
    useEffect(() => {
        console.log('🚀 DEBUG - Composant Notifications monté, chargement des données...');
        loadNotifications(1);
        loadStats();
    }, []);

    // Charger les notifications quand l'onglet change
    useEffect(() => {
      const filters = {};
      
      // Appliquer le filtre par type/lecture
      if (activeTab === 'all') {
        loadNotifications(1, filters);
      } else if (activeTab === 'read') {
        filters.is_read = true;
        loadNotifications(1, filters);
      } else if (activeTab === 'unread') {
        filters.unread_only = true;
        loadNotifications(1, filters);
      } else {
        filters.notification_type = activeTab.toUpperCase();
        loadNotifications(1, filters);
      }
    }, [activeTab]);

    // Marquer une notification comme lue
    const markAsRead = async (id) => {
        try {
            console.log('✅ DEBUG - Marquage comme lu de la notification:', id);
            await RecruteurNotificationService.markAsRead([id]);
            console.log('✅ DEBUG - Notification marquée comme lue avec succès');

            // Mettre à jour l'état local
            setNotifications(notifications.map(notif =>
                notif.id === id ? { ...notif, is_read: true } : notif
            ));

            // Recharger les statistiques
            loadStats();
        } catch (error) {
            console.error('❌ DEBUG - Erreur lors du marquage comme lu:', {
                notificationId: id,
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    };

    // Marquer toutes les notifications comme lues
    const markAllAsRead = async () => {
        try {
            console.log('✅ DEBUG - Marquage de toutes les notifications comme lues...');
            await RecruteurNotificationService.markAllAsRead();
            console.log('✅ DEBUG - Toutes les notifications marquées comme lues avec succès');

            // Mettre à jour l'état local
            setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));

            // Recharger les statistiques
            loadStats();
        } catch (error) {
            console.error('❌ DEBUG - Erreur lors du marquage de toutes les notifications:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data
            });
        }
    };

    // Gestion de la sélection multiple
    const toggleNotificationSelection = (id) => {
        setSelectedNotifications(prev =>
            prev.includes(id)
                ? prev.filter(n => n !== id)
                : [...prev, id]
        );
    };

    // Marquer les notifications sélectionnées comme lues
    const markSelectedAsRead = async () => {
        if (selectedNotifications.length === 0) return;

        try {
            setBulkActionLoading(true);
            await RecruteurNotificationService.markAsRead(selectedNotifications);

            // Mettre à jour l'état local
            setNotifications(notifications.map(notif =>
                selectedNotifications.includes(notif.id)
                    ? { ...notif, is_read: true }
                    : notif
            ));

            setSelectedNotifications([]);
            loadStats();
        } catch (error) {
            console.error('❌ Erreur lors du marquage multiple:', error);
        } finally {
            setBulkActionLoading(false);
        }
    };

    // Formatage des dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Non spécifié';
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Obtenir le titre traduit
    const getTranslatedTitle = (type) => {
        switch (type) {
            case 'APPLICATION_STATUS':
                return 'Statut candidature';
            case 'AI_SERVICE_ERROR':
                return 'Erreur service IA';
            case 'AI_CREDIT_LOW':
                return 'Crédits IA faibles';
            case 'RECRUITER_ACCOUNT_PENDING':
                return 'Compte en attente';
            case 'RECRUITER_ACCOUNT_APPROVED':
                return 'Compte approuvé';
            case 'NEW_APPLICATION':
                return 'Nouvelle candidature';
            case 'CV_IMPROVEMENT_COMPLETE':
                return 'CV amélioré par IA';
            case 'ACCOUNTS_APPROVED':
                return 'Compte approuvé';
            case 'ACCOUNTS_PENDING':
                return 'Compte en attente';
            case 'ACCOUNTS_REJECTED':
                return 'Compte rejeté';
            case 'SYSTEM_UPDATE':
                return 'Mise à jour système';
            case 'NEW_OFFER_MATCH':
                return 'Nouvelle offre correspondante';
            case 'SUBSCRIPTION_UPDATE':
                return 'Mise à jour abonnement';
            case 'PAYMENT_SUCCESS':
                return 'Paiement réussi';
            case 'PAYMENT_FAILED':
                return 'Échec paiement';
            case 'MESSAGE_RECEIVED':
                return 'Message reçu';
            case 'REMINDER':
                return 'Rappel';
            case 'WELCOME':
                return 'Bienvenue';
            case 'SECURITY_ALERT':
                return 'Alerte sécurité';
            case 'MAINTENANCE':
                return 'Maintenance';
            default:
                return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        }
    };

    // Calculer les compteurs pour les onglets (en local)
    const getTabCounts = () => {
      // Calculer en local à partir de toutes les notifications
      const allNotifications = notifications || [];
      
      const counts = {
        all: pagination.totalCount || allNotifications.length,
        unread: allNotifications.filter(n => !n.is_read).length
      };

      // Ajouter les compteurs par type (excluant les types filtrés)
      const typeCount = {};
      allNotifications.forEach(notif => {
        if (!EXCLUDED_NOTIFICATION_TYPES.includes(notif.notification_type)) {
          const key = notif.notification_type.toLowerCase().replace(/_/g, '');
          typeCount[key] = (typeCount[key] || 0) + 1;
        }
      });

      // Ajouter les compteurs calculés
      Object.keys(typeCount).forEach(key => {
        counts[key] = typeCount[key];
      });

      return counts;
    };

    // Statistiques affichées (dynamiques selon l'onglet)
    const getDisplayedStats = () => {
        // Mode global - utiliser les vraies stats de l'API
        if (activeTab === 'all') {
            return {
                total_notifications: stats.total_notifications || 0,
                unread_count: stats.unread_count || 0,
                read_count: stats.read_count || 0,
                read_rate: stats.total_notifications > 0 ? Math.round(((stats.read_count || 0) / stats.total_notifications) * 100) : 0
            };
        }

        // Mode filtré (onglet non-lu ou par type) basé sur la pagination courante
        const total = pagination.totalCount || notifications.length || 0;
        const pageUnread = notifications.filter(n => !n.is_read).length;
        const unread = activeTab === 'unread' ? total : pageUnread;
        const read = Math.max(total - unread, 0);
        const readRate = total > 0 ? Math.round((read / total) * 100) : 0;
        return {
            total_notifications: total,
            unread_count: unread,
            read_count: read,
            read_rate: readRate
        };
    };

    const tabCounts = getTabCounts();
    const displayedStats = getDisplayedStats();

    if (loading && notifications.length === 0) {
        return <Loader />;
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
                            <p className="text-gray-600">Gérez vos notifications et restez informé</p>
                        </div>
                        <div className="flex space-x-3">
                            {selectedNotifications.length > 0 && (
                                <button
                                    onClick={markSelectedAsRead}
                                    disabled={bulkActionLoading}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                                >
                                    <i className="fas fa-check mr-2"></i>
                                    {bulkActionLoading ? 'Traitement...' : `Marquer ${selectedNotifications.length} comme lu(es)`}
                                </button>
                            )}
                            <button
                                onClick={markAllAsRead}
                                disabled={stats.unread_count === 0}
                                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                <i className="fas fa-check-double mr-2"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Onglets */}
                <div className="bg-white rounded-lg shadow mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex overflow-x-auto scrollbar-hide px-4 sm:px-6">
                            <div className="flex space-x-4 sm:space-x-8 min-w-max">
                                {[
                                    { key: 'all', label: 'Toutes', count: tabCounts.all },
                                    { key: 'read', label: 'Lues', count: (notifications || []).filter(n => n.is_read).length },
                                    { key: 'unread', label: 'Non lues', count: tabCounts.unread },
                                    ...(stats.by_type || [])
                                        .filter(type => !EXCLUDED_NOTIFICATION_TYPES.includes(type.notification_type))
                                        .map(type => ({
                                            key: type.notification_type.toLowerCase().replace(/_/g, ''),
                                            label: getTranslatedTitle(type.notification_type),
                                            count: type.count
                                        }))
                                ].map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`py-3 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.key
                                                ? 'border-orange-500 text-orange-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        <span className="hidden sm:inline">{tab.label}</span>
                                        <span className="sm:hidden">{tab.label.length > 8 ? tab.label.substring(0, 8) + '...' : tab.label}</span>
                                        <span className="ml-1 sm:ml-2 bg-gray-100 text-gray-900 py-0.5 px-1.5 sm:px-2.5 rounded-full text-xs font-medium">
                                            {tab.count}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </nav>
                    </div>
                </div>

                {/* Liste des notifications */}
                <div className="bg-white rounded-lg shadow">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {[...notifications].sort((a, b) => (a.is_read ? 1 : 0) - (b.is_read ? 1 : 0)).map((notification) => (
                                <div key={notification.id} className={`p-6 hover:bg-gray-50 transition-colors ${notification.is_read ? 'bg-white' : 'bg-blue-50'
                                    }`}>
                                    <div className="flex items-start space-x-4">
                                        {/* Checkbox de sélection */}
                                        <input
                                            type="checkbox"
                                            checked={selectedNotifications.includes(notification.id)}
                                            onChange={() => toggleNotificationSelection(notification.id)}
                                            className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                        />

                                        {/* Contenu de la notification */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${notification.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                                                                notification.priority === 'URGENT' ? 'bg-purple-100 text-purple-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                            }`}>
                                                            {notification.priority_display || notification.priority}
                                                        </span>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            {notification.notification_type_display || getTranslatedTitle(notification.notification_type)}
                                                        </span>
                                                        {notification.delivery_method_display && (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                {notification.delivery_method_display}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                        {notification.title}
                                                    </h3>

                                                    <p className="text-gray-600 mb-3">
                                                        {notification.message}
                                                    </p>

                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <span>
                                                            <i className="fas fa-clock mr-1"></i>
                                                            {notification.time_since_created || formatDate(notification.created_at)}
                                                        </span>
                                                        {notification.read_at && (
                                                            <span>
                                                                <i className="fas fa-check mr-1"></i>
                                                                Lu le {formatDate(notification.read_at)}
                                                            </span>
                                                        )}
                                                        {notification.sent_at && (
                                                            <span>
                                                                <i className="fas fa-paper-plane mr-1"></i>
                                                                Envoyé le {formatDate(notification.sent_at)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col items-end space-y-2 ml-4">
                                                    {!notification.is_read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                                        >
                                                            <i className="fas fa-check mr-1"></i>Marquer comme lu
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <div className="text-gray-400 mb-4">
                                <i className="fas fa-bell text-6xl"></i>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune notification</h3>
                            <p className="text-gray-500">
                                {activeTab === 'unread'
                                    ? 'Vous n\'avez aucune notification non lue'
                                    : 'Vous n\'avez pas encore reçu de notifications'
                                }
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center">
                        <div className="mb-4 sm:mb-0 text-sm text-gray-600">
                            Affichage de <span className="font-medium">{(pagination.currentPage - 1) * pagination.pageSize + 1}</span> à{' '}
                            <span className="font-medium">
                                {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)}
                            </span>{' '}
                            sur <span className="font-medium">{pagination.totalCount}</span> notifications
                        </div>
                        <nav className="flex items-center space-x-2">
                            <button
                                onClick={() => {
                                    const filters = {};
                                    if (activeTab === 'read') filters.is_read = true;
                                    else if (activeTab === 'unread') filters.unread_only = true;
                                    else if (activeTab !== 'all') {
                                        filters.notification_type = activeTab.toUpperCase();
                                    }
                                    loadNotifications(pagination.currentPage - 1, filters);
                                }}
                                disabled={pagination.currentPage === 1}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i className="fas fa-chevron-left mr-1"></i>Précédent
                            </button>

                            <span className="px-3 py-2 text-sm text-gray-700">
                                Page <span className="font-medium">{pagination.currentPage}</span> sur{' '}
                                <span className="font-medium">{pagination.totalPages}</span>
                            </span>

                            <button
                                onClick={() => {
                                    const filters = {};
                                    if (activeTab === 'read') filters.is_read = true;
                                    else if (activeTab === 'unread') filters.unread_only = true;
                                    else if (activeTab !== 'all') {
                                        filters.notification_type = activeTab.toUpperCase();
                                    }
                                    loadNotifications(pagination.currentPage + 1, filters);
                                }}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Suivant<i className="fas fa-chevron-right ml-1"></i>
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications; 