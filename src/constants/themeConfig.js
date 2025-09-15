// Configuration des thèmes et couleurs pour les cartes du dashboard
export const THEME_CONFIG = {
  // Thème par défaut
  DEFAULT: {
    primary: {
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100'
    },
    secondary: {
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-100'
    },
    success: {
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      hover: 'hover:bg-green-100'
    },
    warning: {
      color: 'text-yellow-600',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      hover: 'hover:bg-yellow-100'
    },
    danger: {
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      hover: 'hover:bg-red-100'
    },
    info: {
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      hover: 'hover:bg-cyan-100'
    }
  },

  // Thème sombre
  DARK: {
    primary: {
      color: 'text-blue-400',
      bg: 'bg-blue-900',
      border: 'border-blue-700',
      hover: 'hover:bg-blue-800'
    },
    secondary: {
      color: 'text-gray-400',
      bg: 'bg-gray-900',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-800'
    },
    success: {
      color: 'text-green-400',
      bg: 'bg-green-900',
      border: 'border-green-700',
      hover: 'hover:bg-green-800'
    },
    warning: {
      color: 'text-yellow-400',
      bg: 'bg-yellow-900',
      border: 'border-yellow-700',
      hover: 'hover:bg-yellow-800'
    },
    danger: {
      color: 'text-red-400',
      bg: 'bg-red-900',
      border: 'border-red-700',
      hover: 'hover:bg-red-800'
    },
    info: {
      color: 'text-cyan-400',
      bg: 'bg-cyan-900',
      border: 'border-cyan-700',
      hover: 'hover:bg-cyan-800'
    }
  },

  // Thème coloré
  COLORFUL: {
    primary: {
      color: 'text-indigo-600',
      bg: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      border: 'border-indigo-200',
      hover: 'hover:from-indigo-100 hover:to-purple-100'
    },
    secondary: {
      color: 'text-emerald-600',
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      border: 'border-emerald-200',
      hover: 'hover:from-emerald-100 hover:to-teal-100'
    },
    success: {
      color: 'text-green-600',
      bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
      border: 'border-green-200',
      hover: 'hover:from-green-100 hover:to-emerald-100'
    },
    warning: {
      color: 'text-amber-600',
      bg: 'bg-gradient-to-br from-amber-50 to-orange-50',
      border: 'border-amber-200',
      hover: 'hover:from-amber-100 hover:to-orange-100'
    },
    danger: {
      color: 'text-rose-600',
      bg: 'bg-gradient-to-br from-rose-50 to-pink-50',
      border: 'border-rose-200',
      hover: 'hover:from-rose-100 hover:to-pink-100'
    },
    info: {
      color: 'text-sky-600',
      bg: 'bg-gradient-to-br from-sky-50 to-blue-50',
      border: 'border-sky-200',
      hover: 'hover:from-sky-100 hover:to-blue-100'
    }
  }
};

// Configuration des variantes de cartes
export const CARD_VARIANTS = {
  DEFAULT: {
    name: 'Par défaut',
    classes: 'bg-white shadow-lg hover:shadow-xl border border-gray-100',
    iconClasses: 'p-3 rounded-xl bg-gray-50 text-gray-600'
  },
  GRADIENT: {
    name: 'Dégradé',
    classes: 'bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl border border-gray-100',
    iconClasses: 'p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg'
  },
  OUTLINE: {
    name: 'Contour',
    classes: 'bg-white border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300',
    iconClasses: 'p-3 rounded-xl border-2 border-gray-300 bg-gray-50 text-gray-600'
  },
  ELEVATED: {
    name: 'Élevé',
    classes: 'bg-white shadow-xl hover:shadow-2xl border border-gray-100',
    iconClasses: 'p-3 rounded-xl bg-gray-50 text-gray-600 shadow-md'
  },
  GLASS: {
    name: 'Verre',
    classes: 'bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl border border-white/20',
    iconClasses: 'p-3 rounded-xl bg-white/50 backdrop-blur-sm text-gray-600 shadow-md'
  }
};

// Configuration des animations
export const ANIMATION_CONFIG = {
  ENTRANCE: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    slideLeft: 'animate-slide-left',
    slideRight: 'animate-slide-right',
    scaleIn: 'animate-scale-in',
    bounceIn: 'animate-bounce-in'
  },
  HOVER: {
    scale: 'hover:scale-105',
    lift: 'hover:-translate-y-1',
    glow: 'hover:shadow-glow',
    rotate: 'hover:rotate-3'
  },
  TRANSITIONS: {
    fast: 'transition-all duration-200',
    normal: 'transition-all duration-300',
    slow: 'transition-all duration-500',
    bounce: 'transition-all duration-300 ease-bounce'
  }
};

// Configuration des icônes par catégorie
export const ICON_CONFIG = {
  USERS: {
    primary: 'fas fa-users',
    secondary: 'fas fa-user',
    tertiary: 'fas fa-user-plus',
    quaternary: 'fas fa-user-check'
  },
  ANALYTICS: {
    primary: 'fas fa-chart-bar',
    secondary: 'fas fa-chart-line',
    tertiary: 'fas fa-chart-pie',
    quaternary: 'fas fa-chart-area'
  },
  SYSTEM: {
    primary: 'fas fa-server',
    secondary: 'fas fa-cog',
    tertiary: 'fas fa-database',
    quaternary: 'fas fa-network-wired'
  },
  BUSINESS: {
    primary: 'fas fa-briefcase',
    secondary: 'fas fa-building',
    tertiary: 'fas fa-handshake',
    quaternary: 'fas fa-chart-line'
  },
  COMMUNICATION: {
    primary: 'fas fa-comments',
    secondary: 'fas fa-envelope',
    tertiary: 'fas fa-phone',
    quaternary: 'fas fa-bell'
  }
};

// Configuration des couleurs par métrique
export const METRIC_COLORS = {
  USERS: {
    primary: 'text-blue-600',
    secondary: 'text-blue-500',
    accent: 'text-blue-400',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
  PERFORMANCE: {
    primary: 'text-green-600',
    secondary: 'text-green-500',
    accent: 'text-green-400',
    bg: 'bg-green-50',
    border: 'border-green-200'
  },
  REVENUE: {
    primary: 'text-emerald-600',
    secondary: 'text-emerald-500',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200'
  },
  SYSTEM: {
    primary: 'text-purple-600',
    secondary: 'text-purple-500',
    accent: 'text-purple-400',
    bg: 'bg-purple-50',
    border: 'border-purple-200'
  },
  ALERTS: {
    primary: 'text-red-600',
    secondary: 'text-red-500',
    accent: 'text-red-400',
    bg: 'bg-red-50',
    border: 'border-red-200'
  }
};

export default THEME_CONFIG; 