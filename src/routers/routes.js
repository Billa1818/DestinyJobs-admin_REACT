// Configuration des routes de l'application
export const ROUTES = {
  // Routes publiques
  PUBLIC: {
    LOGIN: '/login',
    REGISTER: '/register',
            FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
  },

  // Routes protégées (admin)
  ADMIN: {
    DASHBOARD: '/dashboard',
    RECRUITERS: {
      LIST: '/recruiters',
      CREATE: '/recruiters/create',
      EDIT: (id) => `/recruiters/${id}/edit`,
    },
    BLOG: {
      LIST: '/blog',
      CREATE: '/blog/create',
      EDIT: (id) => `/blog/${id}/edit`,
    },
                            PROFILE: '/profile',
        SETTINGS: '/settings',
        CHANGE_PASSWORD: '/change-password',
        FORGOT_PASSWORD: '/forgot-password',
        NOTIFICATIONS: '/notifications',
  }
}

// Configuration des menus de navigation
export const NAVIGATION_MENUS = {
  MAIN: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: ROUTES.ADMIN.DASHBOARD,
      icon: 'fas fa-tachometer-alt',
      exact: true
    },
    {
      id: 'recruiters',
      label: 'Gestion des Recruteurs',
      path: ROUTES.ADMIN.RECRUITERS.LIST,
      icon: 'fas fa-building',
      children: [
        {
          id: 'recruiters-list',
          label: 'Liste des recruteurs',
          path: ROUTES.ADMIN.RECRUITERS.LIST,
          icon: 'fas fa-list'
        },

      ]
    },
    {
      id: 'blog',
      label: 'Gestion du Blog',
      path: ROUTES.ADMIN.BLOG.LIST,
      icon: 'fas fa-blog',
      children: [
        {
          id: 'blog-list',
          label: 'Tous les articles',
          path: ROUTES.ADMIN.BLOG.LIST,
          icon: 'fas fa-list'
        },
        {
          id: 'blog-create',
          label: 'Nouvel article',
          path: ROUTES.ADMIN.BLOG.CREATE,
          icon: 'fas fa-plus'
        }
      ]
    }
  ],

  USER: [
    {
      id: 'profile',
      label: 'Mon profil',
      path: ROUTES.ADMIN.PROFILE,
      icon: 'fas fa-user'
    },
    {
      id: 'settings',
      label: 'Paramètres',
      path: ROUTES.ADMIN.SETTINGS,
      icon: 'fas fa-cog'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      path: ROUTES.ADMIN.NOTIFICATIONS,
      icon: 'fas fa-bell'
    }
  ]
}

// Configuration des breadcrumbs
export const BREADCRUMB_CONFIG = {
  [ROUTES.ADMIN.DASHBOARD]: ['Dashboard'],
  [ROUTES.ADMIN.RECRUITERS.LIST]: ['Dashboard', 'Gestion des Recruteurs'],
  [ROUTES.ADMIN.RECRUITERS.CREATE]: ['Dashboard', 'Gestion des Recruteurs', 'Ajouter un recruteur'],
  [ROUTES.ADMIN.BLOG.LIST]: ['Dashboard', 'Gestion du Blog'],
  [ROUTES.ADMIN.BLOG.CREATE]: ['Dashboard', 'Gestion du Blog', 'Nouvel article'],
                [ROUTES.ADMIN.PROFILE]: ['Dashboard', 'Mon profil'],
              [ROUTES.ADMIN.SETTINGS]: ['Dashboard', 'Paramètres'],
              [ROUTES.ADMIN.CHANGE_PASSWORD]: ['Dashboard', 'Changer le mot de passe'],
              [ROUTES.ADMIN.NOTIFICATIONS]: ['Dashboard', 'Notifications']
}

// Fonction utilitaire pour obtenir les breadcrumbs
export const getBreadcrumbs = (pathname) => {
  return BREADCRUMB_CONFIG[pathname] || ['Dashboard']
}

// Fonction utilitaire pour vérifier si une route est active
export const isActiveRoute = (currentPath, routePath, exact = false) => {
  if (exact) {
    return currentPath === routePath
  }
  return currentPath === routePath || currentPath.startsWith(routePath + '/')
}

// Fonction utilitaire pour obtenir le menu actif
export const getActiveMenu = (pathname) => {
  const activeMenu = NAVIGATION_MENUS.MAIN.find(menu => 
    isActiveRoute(pathname, menu.path, menu.exact)
  )
  return activeMenu || null
} 