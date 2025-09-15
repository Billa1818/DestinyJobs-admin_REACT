# 🎨 Composants de Cartes - Dashboard DestinyJobs

## 🎯 **Vue d'ensemble**

Ce document présente tous les composants de cartes de statistiques disponibles pour le dashboard DestinyJobs. Chaque composant est conçu pour offrir une expérience utilisateur moderne et interactive.

## 🚀 **Composants Disponibles**

### **1. StatCard - Carte de Statistique de Base**

Composant de base pour afficher des statistiques simples avec icône et valeur.

```jsx
import StatCard from '../components/StatCard';

<StatCard
  title="Utilisateurs"
  value="1,234"
  icon="fas fa-users"
  iconColor="text-blue-600"
  subtitle="Total inscrits"
  variant="default" // default, gradient, outline, elevated
/>
```

**Props disponibles :**
- `title` : Titre de la carte
- `value` : Valeur principale
- `icon` : Icône Font Awesome
- `iconColor` : Couleur de l'icône
- `subtitle` : Sous-titre optionnel
- `variant` : Style de la carte
- `onClick` : Fonction de clic optionnelle

**Variants :**
- `default` : Style standard avec ombre
- `gradient` : Fond dégradé
- `outline` : Contour épais
- `elevated` : Ombre plus prononcée

---

### **2. AdvancedStatCard - Carte de Statistique Avancée**

Carte avec graphique miniature, indicateurs de tendance et animations.

```jsx
import AdvancedStatCard from '../components/AdvancedStatCard';

<AdvancedStatCard
  title="Utilisateurs"
  value="1,234"
  icon="fas fa-users"
  iconColor="text-blue-600"
  bgColor="bg-blue-50"
  borderColor="border-blue-200"
  change="+12%"
  changeType="positive" // positive, negative, neutral
  chartData={[45, 52, 48, 61, 55, 58, 62, 65, 68, 71]}
  onClick={() => console.log('Cliqué')}
/>
```

**Fonctionnalités :**
- Graphique en barres miniature
- Indicateur de tendance avec couleur
- Animations d'entrée et de survol
- Effet de brillance au survol
- Barre de progression décorative

---

### **3. MultiMetricCard - Carte Multi-Métriques**

Carte affichant plusieurs métriques dans une interface organisée.

```jsx
import MultiMetricCard from '../components/MultiMetricCard';

<MultiMetricCard
  title="Statistiques Utilisateurs"
  icon="fas fa-users"
  iconColor="text-blue-600"
  bgColor="bg-blue-50"
  metrics={[
    {
      label: 'Utilisateurs Actifs',
      value: '1,234',
      icon: 'fas fa-user-check',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      change: '+12%',
      changeType: 'positive'
    }
  ]}
  variant="default" // default, compact, expanded
/>
```

**Structure des métriques :**
- `label` : Nom de la métrique
- `value` : Valeur numérique
- `icon` : Icône de la métrique
- `iconBg` : Couleur de fond de l'icône
- `iconColor` : Couleur de l'icône
- `change` : Variation en pourcentage
- `changeType` : Type de variation

---

### **4. CircularProgressCard - Carte de Progression Circulaire**

Carte avec graphique circulaire et barre de progression linéaire.

```jsx
import CircularProgressCard from '../components/CircularProgressCard';

<CircularProgressCard
  title="Utilisateurs Actifs"
  value={85}
  maxValue={100}
  icon="fas fa-user-check"
  iconColor="text-green-600"
  bgColor="bg-green-50"
  progressColor="text-green-600"
  subtitle="Pourcentage d'utilisateurs actifs"
  size="md" // sm, md, lg, xl
  onClick={() => console.log('Détails')}
/>
```

**Fonctionnalités :**
- Graphique circulaire SVG animé
- Barre de progression linéaire
- Indicateur de statut automatique
- Tailles configurables
- Animations fluides

---

### **5. PerformanceMetrics - Métriques de Performance**

Carte spécialisée pour afficher les métriques de performance système.

```jsx
import PerformanceMetrics from '../components/PerformanceMetrics';

<PerformanceMetrics
  title="Performance Système"
  metrics={{
    'CPU Usage': 45,
    'Memory Usage': 67,
    'Disk Usage': 23,
    'Network': 89
  }}
/>
```

---

### **6. StatsChart - Graphiques de Statistiques**

Composant pour afficher des graphiques en barres et circulaires.

```jsx
import StatsChart from '../components/StatsChart';

<StatsChart
  title="Utilisateurs par Type"
  data={{
    'Candidats': 1200,
    'Recruteurs': 450,
    'Admins': 25
  }}
  type="bar" // bar, pie
  height="h-64"
/>
```

## 🎨 **Personnalisation des Thèmes**

### **Utilisation des Thèmes Prédéfinis**

```jsx
import { THEME_CONFIG } from '../constants/themeConfig';

// Utiliser un thème spécifique
const theme = THEME_CONFIG.COLORFUL.primary;
const cardClasses = `bg-white ${theme.bg} ${theme.border}`;
```

### **Thèmes Disponibles :**
- `DEFAULT` : Couleurs standard
- `DARK` : Thème sombre
- `COLORFUL` : Thème coloré avec dégradés

### **Variantes de Cartes :**
- `DEFAULT` : Style standard
- `GRADIENT` : Fond dégradé
- `OUTLINE` : Contour épais
- `ELEVATED` : Ombre prononcée
- `GLASS` : Effet verre

## 🎭 **Animations et Transitions**

### **Animations d'Entrée :**
- `fadeIn` : Apparition en fondu
- `slideUp` : Glissement vers le haut
- `slideDown` : Glissement vers le bas
- `scaleIn` : Apparition avec zoom
- `bounceIn` : Apparition avec rebond

### **Effets de Survol :**
- `scale` : Agrandissement
- `lift` : Élévation
- `glow` : Lueur
- `rotate` : Rotation légère

### **Transitions :**
- `fast` : 200ms
- `normal` : 300ms
- `slow` : 500ms
- `bounce` : Avec effet rebond

## 🎯 **Exemples d'Utilisation**

### **Dashboard Principal :**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <AdvancedStatCard
    title="Total Utilisateurs"
    value={formatNumber(stats.totalUsers)}
    icon="fas fa-users"
    iconColor="text-blue-600"
    bgColor="bg-blue-50"
    borderColor="border-blue-200"
    change="+12%"
    changeType="positive"
    chartData={userGrowthData}
  />
  
  <CircularProgressCard
    title="Taux de Conversion"
    value={conversionRate}
    maxValue={100}
    icon="fas fa-chart-line"
    iconColor="text-green-600"
    bgColor="bg-green-50"
    progressColor="text-green-600"
  />
</div>
```

### **Section de Métriques :**
```jsx
<MultiMetricCard
  title="Performance Globale"
  icon="fas fa-tachometer-alt"
  iconColor="text-purple-600"
  bgColor="bg-purple-50"
  metrics={performanceMetrics}
  variant="expanded"
/>
```

## 🔧 **Configuration Avancée**

### **Création de Thèmes Personnalisés :**
```jsx
const customTheme = {
  primary: {
    color: 'text-custom-600',
    bg: 'bg-custom-50',
    border: 'border-custom-200',
    hover: 'hover:bg-custom-100'
  }
};
```

### **Animations Personnalisées :**
```jsx
const customAnimation = {
  entrance: 'animate-custom-fade',
  hover: 'hover:scale-110',
  transition: 'transition-all duration-700 ease-out'
};
```

## 📱 **Responsive Design**

Tous les composants sont entièrement responsifs et s'adaptent automatiquement à :
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px
- **Large Desktop** : > 1280px

## 🎨 **Bonnes Pratiques**

### **1. Cohérence Visuelle :**
- Utilisez les mêmes couleurs pour des métriques similaires
- Maintenez une hiérarchie visuelle claire
- Respectez l'espacement et l'alignement

### **2. Performance :**
- Limitez le nombre d'animations simultanées
- Utilisez des transitions CSS plutôt que JavaScript
- Optimisez les re-renders avec React.memo

### **3. Accessibilité :**
- Fournissez des alternatives textuelles
- Utilisez des contrastes suffisants
- Supportez la navigation au clavier

## 🚀 **Évolutions Futures**

### **Fonctionnalités Prévues :**
- Graphiques interactifs avec Chart.js
- Animations 3D avec Three.js
- Thèmes dynamiques
- Export des données
- Intégration WebSocket pour temps réel

### **Composants à Venir :**
- `HeatmapCard` : Cartes de chaleur
- `TimelineCard` : Cartes temporelles
- `ComparisonCard` : Cartes de comparaison
- `AlertCard` : Cartes d'alerte

---

## 📞 **Support et Contribution**

Pour toute question ou suggestion d'amélioration :
1. Consultez la documentation des composants
2. Testez les exemples dans `CardShowcase.jsx`
3. Vérifiez la configuration des thèmes

**Version :** 2.0.0  
**Dernière mise à jour :** 2025-01-26 