// Configuration des couleurs et icônes pour le dashboard
export const DASHBOARD_CONFIG = {
  // Couleurs des cartes de statistiques
  CARD_COLORS: {
    USERS: {
      icon: 'text-blue-600',
      value: 'text-gray-900'
    },
    JOBS: {
      icon: 'text-green-600',
      value: 'text-gray-900'
    },
    APPLICATIONS: {
      icon: 'text-purple-600',
      value: 'text-gray-900'
    },
    BLOG: {
      icon: 'text-orange-600',
      value: 'text-gray-900'
    },
    REVENUE: {
      icon: 'text-emerald-600',
      value: 'text-gray-900'
    },
    SYSTEM: {
      icon: 'text-indigo-600',
      value: 'text-gray-900'
    }
  },

  // Icônes des cartes de statistiques
  CARD_ICONS: {
    USERS: 'fas fa-users',
    JOBS: 'fas fa-briefcase',
    APPLICATIONS: 'fas fa-file-alt',
    BLOG: 'fas fa-blog',
    REVENUE: 'fas fa-dollar-sign',
    SYSTEM: 'fas fa-server',
    NOTIFICATIONS: 'fas fa-bell',
    ACTIVITY: 'fas fa-chart-line',
    PERFORMANCE: 'fas fa-tachometer-alt',
    HEALTH: 'fas fa-heartbeat'
  },

  // Configuration des graphiques
  CHART_CONFIG: {
    COLORS: [
      '#3B82F6', // blue-500
      '#10B981', // emerald-500
      '#8B5CF6', // violet-500
      '#F59E0B', // amber-500
      '#EF4444', // red-500
      '#06B6D4', // cyan-500
      '#84CC16', // lime-500
      '#F97316'  // orange-500
    ],
    HEIGHT: 'h-64',
    ANIMATION_DURATION: 300
  },

  // Seuils de performance
  PERFORMANCE_THRESHOLDS: {
    CPU: 80,
    MEMORY: 80,
    DISK: 80,
    RESPONSE_TIME: 1000, // ms
    UPTIME: 99.9 // %
  },

  // Intervalles de rafraîchissement (en millisecondes)
  REFRESH_INTERVALS: {
    REAL_TIME: 30000,    // 30 secondes
    STATS: 60000,        // 1 minute
    SYSTEM_HEALTH: 15000 // 15 secondes
  },

  // Messages d'erreur personnalisés
  ERROR_MESSAGES: {
    LOADING_FAILED: 'Erreur lors du chargement des données du dashboard',
    API_ERROR: 'Erreur de communication avec l\'API',
    NETWORK_ERROR: 'Erreur de connexion réseau',
    PERMISSION_DENIED: 'Accès refusé aux statistiques'
  },

  // Textes d'aide
  HELP_TEXTS: {
    SYSTEM_HEALTH: 'État de santé du système en temps réel',
    USER_STATS: 'Statistiques détaillées des utilisateurs',
    CONTENT_STATS: 'Statistiques du contenu et des offres',
    PERFORMANCE: 'Métriques de performance de la plateforme',
    REVENUE: 'Statistiques des revenus et abonnements'
  }
};

// Configuration des métriques par défaut
export const DEFAULT_METRICS = {
  system: {
    total_users: 0,
    total_jobs: 0,
    total_applications: 0,
    total_blog_posts: 0,
    system_health: {
      cpu_usage: 0,
      memory_usage: 0,
      disk_usage: 0,
      uptime: 'N/A'
    }
  },
  users: {
    users_by_type: {},
    users_by_status: {},
    new_users_today: 0,
    new_users_week: 0,
    active_users_today: 0
  },
  content: {
    jobs_by_status: {},
    applications_by_status: {},
    blog_posts_by_status: {}
  },
  realTime: {
    online_users: 0,
    active_sessions: 0,
    recent_logins: 0,
    recent_applications: 0
  },
  blog: {
    total_posts: 0,
    published_posts: 0,
    total_views: 0,
    total_likes: 0
  },
  applications: {
    total_applications: 0,
    applications_by_type: {},
    applications_by_status: {}
  },
  subscriptions: {
    total_subscriptions: 0,
    active_subscriptions: 0,
    expired_subscriptions: 0,
    total_revenue: 0
  }
};

export default DASHBOARD_CONFIG; 