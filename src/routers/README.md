# Système de Routage - Destiny Jobs Admin

## Vue d'ensemble

Ce dossier contient le système de routage centralisé de l'application Destiny Jobs Admin, utilisant React Router DOM pour une navigation SPA (Single Page Application).

## Structure des fichiers

```
routers/
├── AppRouter.jsx      # Composant de routage principal
├── routes.js          # Configuration des routes et menus
├── index.js           # Exports centralisés
└── README.md          # Documentation
```

## Composants

### AppRouter.jsx

Le composant principal de routage qui :
- Définit toutes les routes de l'application
- Gère la protection des routes (authentification)
- Applique le layout de base (BaseLayout)
- Gère les redirections

### routes.js

Fichier de configuration contenant :
- **ROUTES** : Constantes pour tous les chemins
- **NAVIGATION_MENUS** : Configuration des menus de navigation
- **BREADCRUMB_CONFIG** : Configuration des breadcrumbs
- **Fonctions utilitaires** : `isActiveRoute`, `getBreadcrumbs`, etc.

## Routes disponibles

### Routes publiques
- `/login` - Page de connexion
- `/register` - Page d'inscription
- `/forgot-password` - Mot de passe oublié
- `/reset-password` - Réinitialisation du mot de passe

### Routes protégées (Admin)
- `/` - Dashboard principal
- `/users` - Gestion des utilisateurs
- `/users/create` - Créer un utilisateur
- `/users/:id/edit` - Modifier un utilisateur
- `/recruiters` - Gestion des recruteurs
- `/recruiters/create` - Ajouter un recruteur
- `/recruiters/:id/edit` - Modifier un recruteur
- `/offers` - Gestion des offres d'emploi
- `/offers/create` - Créer une offre
- `/offers/:id/edit` - Modifier une offre
- `/offers/pending` - Offres en attente
- `/blog` - Gestion du blog
- `/blog/create` - Nouvel article
- `/blog/:id/edit` - Modifier un article
- `/profile` - Profil utilisateur
- `/settings` - Paramètres
- `/notifications` - Notifications

## Menus de navigation

### Menu principal
- Dashboard
- Gestion des Utilisateurs (avec sous-menus)
- Gestion des Recruteurs (avec sous-menus)
- Gestion des Offres (avec sous-menus)
- Gestion du Blog (avec sous-menus)

### Menu utilisateur
- Mon profil
- Paramètres
- Notifications

## Utilisation

### Dans les composants
```jsx
import { ROUTES, NAVIGATION_MENUS, isActiveRoute } from '../routers';

// Utiliser une route
<Link to={ROUTES.ADMIN.USERS.CREATE}>Créer un utilisateur</Link>

// Vérifier si une route est active
const isActive = isActiveRoute(location.pathname, ROUTES.ADMIN.USERS.LIST);
```

### Ajouter une nouvelle route
1. Ajouter la route dans `routes.js` (ROUTES)
2. Ajouter le menu dans `NAVIGATION_MENUS`
3. Ajouter la route dans `AppRouter.jsx`
4. Créer le composant de page correspondant

## Fonctionnalités

- **Navigation SPA** : Pas de rechargement de page
- **Routes protégées** : Système d'authentification intégré
- **Menus dynamiques** : Configuration centralisée
- **Breadcrumbs** : Navigation contextuelle
- **Responsive** : Adaptation mobile/desktop
- **Type-safe** : Constantes pour éviter les erreurs de frappe

## Sécurité

- Routes protégées par le composant `ProtectedRoute`
- Redirection automatique vers la page de connexion
- Gestion des routes non autorisées

## Performance

- Lazy loading possible pour les composants
- Routes imbriquées optimisées
- Pas de rechargement de page 