import React from 'react';
import StatCard from './StatCard';
import AdvancedStatCard from './AdvancedStatCard';
import MultiMetricCard from './MultiMetricCard';
import CircularProgressCard from './CircularProgressCard';

const CardShowcase = () => {
  const sampleChartData = [45, 52, 48, 61, 55, 58, 62, 65, 68, 71];
  const sampleMetrics = [
    {
      label: 'Utilisateurs Actifs',
      value: '1,234',
      icon: 'fas fa-user-check',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Nouvelles Inscriptions',
      value: '89',
      icon: 'fas fa-user-plus',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      change: '+5%',
      changeType: 'positive'
    },
    {
      label: 'Taux de Conversion',
      value: '23.4%',
      icon: 'fas fa-chart-line',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      change: '+2.1%',
      changeType: 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Galerie des Composants de Cartes
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez tous les types de cartes de statistiques disponibles pour le dashboard
          </p>
        </div>

        {/* Cartes StatCard de base */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cartes de Base (StatCard)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Utilisateurs"
              value="1,234"
              icon="fas fa-users"
              iconColor="text-blue-600"
              subtitle="Total inscrits"
              variant="default"
            />
            
            <StatCard
              title="Offres"
              value="567"
              icon="fas fa-briefcase"
              iconColor="text-green-600"
              subtitle="Actives"
              variant="gradient"
            />
            
            <StatCard
              title="Candidatures"
              value="890"
              icon="fas fa-file-alt"
              iconColor="text-purple-600"
              subtitle="En attente"
              variant="outline"
            />
            
            <StatCard
              title="Revenus"
              value="12,345€"
              icon="fas fa-dollar-sign"
              iconColor="text-emerald-600"
              subtitle="Ce mois"
              variant="elevated"
            />
          </div>
        </div>

        {/* Cartes AdvancedStatCard */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cartes Avancées (AdvancedStatCard)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdvancedStatCard
              title="Utilisateurs"
              value="1,234"
              icon="fas fa-users"
              iconColor="text-blue-600"
              bgColor="bg-blue-50"
              borderColor="border-blue-200"
              change="+12%"
              changeType="positive"
              chartData={sampleChartData}
            />
            
            <AdvancedStatCard
              title="Offres"
              value="567"
              icon="fas fa-briefcase"
              iconColor="text-green-600"
              bgColor="bg-green-50"
              borderColor="border-green-200"
              change="+8%"
              changeType="positive"
              chartData={[12, 15, 18, 14, 16, 19, 22, 20, 23, 25]}
            />
            
            <AdvancedStatCard
              title="Candidatures"
              value="890"
              icon="fas fa-file-alt"
              iconColor="text-purple-600"
              bgColor="bg-purple-50"
              borderColor="border-purple-200"
              change="+15%"
              changeType="positive"
              chartData={[28, 32, 35, 30, 38, 42, 45, 48, 52, 55]}
            />
            
            <AdvancedStatCard
              title="Revenus"
              value="12,345€"
              icon="fas fa-dollar-sign"
              iconColor="text-emerald-600"
              bgColor="bg-emerald-50"
              borderColor="border-emerald-200"
              change="+23%"
              changeType="positive"
              chartData={[1200, 1350, 1420, 1380, 1560, 1680, 1750, 1820, 1890, 1950]}
            />
          </div>
        </div>

        {/* Cartes MultiMetricCard */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cartes Multi-Métriques (MultiMetricCard)</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MultiMetricCard
              title="Statistiques Utilisateurs"
              icon="fas fa-users"
              iconColor="text-blue-600"
              bgColor="bg-blue-50"
              metrics={sampleMetrics}
            />
            
            <MultiMetricCard
              title="Performance Système"
              icon="fas fa-server"
              iconColor="text-green-600"
              bgColor="bg-green-50"
              metrics={[
                {
                  label: 'CPU',
                  value: '45%',
                  icon: 'fas fa-microchip',
                  iconBg: 'bg-blue-100',
                  iconColor: 'text-blue-600',
                  change: '-5%',
                  changeType: 'positive'
                },
                {
                  label: 'Mémoire',
                  value: '67%',
                  icon: 'fas fa-memory',
                  iconBg: 'bg-green-100',
                  iconColor: 'text-green-600',
                  change: '+2%',
                  changeType: 'negative'
                },
                {
                  label: 'Disque',
                  value: '23%',
                  icon: 'fas fa-hdd',
                  iconBg: 'bg-purple-100',
                  iconColor: 'text-purple-600',
                  change: '0%',
                  changeType: 'neutral'
                }
              ]}
            />
          </div>
        </div>

        {/* Cartes CircularProgressCard */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cartes de Progression Circulaire (CircularProgressCard)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CircularProgressCard
              title="Utilisateurs Actifs"
              value={85}
              maxValue={100}
              icon="fas fa-user-check"
              iconColor="text-green-600"
              bgColor="bg-green-50"
              progressColor="text-green-600"
              subtitle="Pourcentage d'utilisateurs actifs"
              size="md"
            />
            
            <CircularProgressCard
              title="Offres Actives"
              value={72}
              maxValue={100}
              icon="fas fa-briefcase"
              iconColor="text-blue-600"
              bgColor="bg-blue-50"
              progressColor="text-blue-600"
              subtitle="Pourcentage d'offres publiées"
              size="md"
            />
            
            <CircularProgressCard
              title="Taux de Conversion"
              value={45}
              maxValue={100}
              icon="fas fa-chart-line"
              iconColor="text-purple-600"
              bgColor="bg-purple-50"
              progressColor="text-purple-600"
              subtitle="Taux de conversion des offres"
              size="md"
            />
            
            <CircularProgressCard
              title="Santé du Système"
              value={92}
              maxValue={100}
              icon="fas fa-heartbeat"
              iconColor="text-red-600"
              bgColor="bg-red-50"
              progressColor="text-red-600"
              subtitle="Performance système"
              size="md"
            />
          </div>
        </div>

        {/* Informations sur l'utilisation */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Comment Utiliser Ces Composants
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Tous ces composants sont entièrement personnalisables avec des props pour les couleurs, 
            icônes, données et comportements. Ils incluent des animations fluides et des interactions 
            utilisateur pour une expérience moderne.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-palette text-2xl text-blue-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Personnalisable</h4>
              <p className="text-sm text-gray-600">Couleurs, icônes et styles adaptables</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-mobile-alt text-2xl text-green-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Responsive</h4>
              <p className="text-sm text-gray-600">S'adapte à tous les écrans</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-bolt text-2xl text-purple-600"></i>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Performant</h4>
              <p className="text-sm text-gray-600">Animations fluides et optimisées</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardShowcase; 