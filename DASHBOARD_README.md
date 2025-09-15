# 📊 Dashboard Admin - DestinyJobs

## 🎯 **Vue d'ensemble**

Le Dashboard Admin de DestinyJobs est un tableau de bord complet qui affiche toutes les statistiques importantes de la plateforme en temps réel. Il utilise l'API complète documentée pour fournir une vue d'ensemble détaillée.

## 🚀 **Fonctionnalités**

### **Statistiques Principales**
- **Total Utilisateurs** : Nombre total d'utilisateurs inscrits
- **Total Offres** : Nombre total d'offres d'emploi
- **Total Candidatures** : Nombre total de candidatures reçues
- **Total Articles Blog** : Nombre total d'articles publiés

### **Statistiques Détaillées**
- **Utilisateurs** : Répartition par type et statut, nouveaux utilisateurs
- **Contenu** : Offres et candidatures par statut
- **Blog** : Articles, vues, likes et commentaires
- **Applications** : Candidatures par type et statut
- **Abonnements** : Statistiques des abonnements et revenus

### **Monitoring Système**
- **Santé du Système** : CPU, mémoire, disque, uptime
- **Temps Réel** : Utilisateurs en ligne, sessions actives
- **Performance** : Métriques de performance de la plateforme

## 🛠 **Architecture Technique**

### **Services API**
- `statsService.js` : Service principal pour toutes les statistiques
- Intégration avec l'API Axios et gestion d'erreurs
- Support de tous les endpoints documentés

### **Composants Réutilisables**
- `StatCard.jsx` : Carte de statistique avec icône et valeur
- `StatsChart.jsx` : Graphiques en barres et circulaires
- `PerformanceMetrics.jsx` : Métriques de performance avec indicateurs

### **Configuration**
- `dashboardConfig.js` : Configuration des couleurs, icônes et seuils
- Métriques par défaut et messages d'erreur personnalisés

## 📡 **Endpoints API Utilisés**

### **Core Admin**
- `GET /api/core-admin/stats/system/` - Statistiques système
- `GET /api/core-admin/stats/users/` - Statistiques utilisateurs
- `GET /api/core-admin/stats/content/` - Statistiques contenu

### **Analytics**
- `GET /api/analytics/site-stats/` - Statistiques du site
- `GET /api/analytics/summary/` - Résumé des statistiques
- `GET /api/analytics/real-time/` - Statistiques temps réel
- `GET /api/analytics/dashboard/` - Dashboard complet

### **Blog & Applications**
- `GET /api/blog/stats/` - Statistiques du blog
- `GET /api/applications/stats/` - Statistiques des candidatures

### **Subscriptions & Notifications**
- `GET /api/subscriptions/stats/` - Statistiques des abonnements
- `GET /api/notifications/stats/` - Statistiques des notifications

## 🎨 **Interface Utilisateur**

### **Design Responsive**
- Grille adaptative pour tous les écrans
- Cartes de statistiques avec icônes colorées
- Graphiques interactifs et métriques visuelles

### **Thème et Couleurs**
- Palette de couleurs cohérente (bleu, vert, violet, orange)
- Indicateurs de statut colorés (vert = sain, jaune = attention, rouge = erreur)
- Icônes Font Awesome pour une meilleure lisibilité

### **Interactions**
- Bouton de rafraîchissement manuel
- Chargement automatique des données au montage
- Gestion d'erreurs avec possibilité de réessayer

## 🔧 **Installation et Configuration**

### **1. Dépendances**
```bash
npm install axios
```

### **2. Services**
Assurez-vous que `statsService.js` est dans le dossier `src/services/`

### **3. Composants**
Placez les composants dans `src/components/`

### **4. Configuration**
Le fichier `dashboardConfig.js` est automatiquement importé

## 📱 **Utilisation**

### **Accès**
Le dashboard est accessible via la route `/dashboard` (protégée par authentification admin)

### **Navigation**
- **Header** : Menu principal avec accès au dashboard
- **Breadcrumbs** : Navigation contextuelle
- **Responsive** : Menu mobile avec navigation tactile

### **Fonctionnalités**
- **Vue d'ensemble** : Statistiques principales en haut
- **Détails** : Sections détaillées par catégorie
- **Monitoring** : Santé système et métriques temps réel
- **Rafraîchissement** : Bouton pour actualiser les données

## 🚨 **Gestion des Erreurs**

### **Types d'Erreurs**
- **Erreurs API** : Problèmes de communication avec le serveur
- **Erreurs réseau** : Problèmes de connexion
- **Erreurs d'autorisation** : Accès refusé aux statistiques

### **Gestion**
- Affichage d'icônes d'erreur explicites
- Messages d'erreur en français
- Bouton de réessai automatique
- Fallback vers des métriques par défaut

## 🔄 **Rafraîchissement des Données**

### **Automatique**
- Chargement initial au montage du composant
- Intervalles configurables pour les mises à jour

### **Manuel**
- Bouton "Rafraîchir les données" toujours visible
- Rechargement complet de toutes les statistiques

## 📊 **Métriques Affichées**

### **Utilisateurs**
- Total, actifs, nouveaux (jour/semaine)
- Répartition par type (Candidat, Recruteur, Admin)
- Statuts (approuvé, en attente, actif, inactif)

### **Contenu**
- Offres par statut (brouillon, en attente, publié, archivé)
- Candidatures par statut (en attente, approuvée, rejetée)
- Articles blog par statut

### **Performance**
- Utilisation CPU, mémoire, disque
- Temps de réponse et disponibilité
- Utilisateurs en ligne et sessions actives

### **Revenus**
- Abonnements actifs et expirés
- Revenus totaux et par mois
- Métriques de conversion

## 🎯 **Personnalisation**

### **Couleurs et Icônes**
Modifiez `dashboardConfig.js` pour changer :
- Couleurs des cartes et indicateurs
- Icônes Font Awesome
- Seuils de performance

### **Métriques**
Ajoutez de nouvelles métriques dans :
- `statsService.js` pour les nouveaux endpoints
- `Dashboard.jsx` pour l'affichage
- `dashboardConfig.js` pour la configuration

## 🔍 **Débogage**

### **Console Browser**
- Logs détaillés des appels API
- Erreurs avec stack traces
- Métriques de performance

### **Network Tab**
- Vérification des appels API
- Temps de réponse
- Codes d'erreur HTTP

## 📈 **Évolutions Futures**

### **Fonctionnalités Prévues**
- Graphiques interactifs avec Chart.js
- Export des données en PDF/Excel
- Notifications en temps réel
- Comparaisons historiques

### **Intégrations**
- Webhooks pour les mises à jour
- API REST pour l'export
- WebSocket pour le temps réel

---

## 📞 **Support**

Pour toute question ou problème :
1. Vérifiez la console du navigateur
2. Consultez les logs de l'API
3. Vérifiez la configuration des services

**Version :** 1.0.0  
**Dernière mise à jour :** 2025-01-26 