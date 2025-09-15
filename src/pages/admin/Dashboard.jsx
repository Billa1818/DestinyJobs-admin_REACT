import React, { useState, useEffect } from 'react';
import { statsService } from '../../services';
import StatCard from '../../components/StatCard';
import AdvancedStatCard from '../../components/AdvancedStatCard';
import MultiMetricCard from '../../components/MultiMetricCard';
import CircularProgressCard from '../../components/CircularProgressCard';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger les statistiques principales
      const [
        systemStats,
        userStats,
        contentStats,
        analyticsSummary,
        realTimeStats,
        blogStats,
        applicationStats,
        subscriptionStats
      ] = await Promise.all([
        statsService.getSystemStats(),
        statsService.getUserStats(),
        statsService.getContentStats(),
        statsService.getAnalyticsSummary(),
        statsService.getRealTimeStats(),
        statsService.getBlogStats(),
        statsService.getApplicationStats(),
        statsService.getSubscriptionStats()
      ]);

      setStats({
        system: systemStats,
        users: userStats,
        content: contentStats,
        analytics: analyticsSummary,
        realTime: realTimeStats,
        blog: blogStats,
        applications: applicationStats,
        subscriptions: subscriptionStats
      });

    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError('Erreur lors du chargement des données du dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return num.toLocaleString('fr-FR');
  };

  const formatPercentage = (num) => {
    if (num === null || num === undefined) return '0%';
    return `${num.toFixed(1)}%`;
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Chargement des statistiques...</p>
          <div className="mt-4 w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <i className="fas fa-redo mr-2"></i>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Tableau de Bord
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Vue d'ensemble complète de la plateforme DestinyJobs avec des métriques en temps réel
          </p>
          <div className="mt-4 flex justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Statistiques principales avec nouveaux composants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AdvancedStatCard
            title="Total Utilisateurs"
            value={formatNumber(stats.system?.total_users || 0)}
            icon="fas fa-users"
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
            change="+12%"
            changeType="positive"
            chartData={[45, 52, 48, 61, 55, 58, 62, 65, 68, 71]}
            onClick={() => console.log('Utilisateurs')}
          />

          <AdvancedStatCard
            title="Total Offres"
            value={formatNumber(stats.system?.total_jobs || 0)}
            icon="fas fa-briefcase"
            iconColor="text-green-600"
            bgColor="bg-green-50"
            borderColor="border-green-200"
            change="+8%"
            changeType="positive"
            chartData={[12, 15, 18, 14, 16, 19, 22, 20, 23, 25]}
            onClick={() => console.log('Offres')}
          />

          <AdvancedStatCard
            title="Total Candidatures"
            value={formatNumber(stats.system?.total_applications || 0)}
            icon="fas fa-file-alt"
            iconColor="text-purple-600"
            bgColor="bg-purple-50"
            borderColor="border-purple-200"
            change="+15%"
            changeType="positive"
            chartData={[28, 32, 35, 30, 38, 42, 45, 48, 52, 55]}
            onClick={() => console.log('Candidatures')}
          />

          <AdvancedStatCard
            title="Total Articles"
            value={formatNumber(stats.system?.total_blog_posts || 0)}
            icon="fas fa-blog"
            iconColor="text-orange-600"
            bgColor="bg-orange-50"
            borderColor="border-orange-200"
            change="+5%"
            changeType="positive"
            chartData={[8, 10, 12, 11, 13, 15, 16, 17, 18, 19]}
            onClick={() => console.log('Articles')}
          />
        </div>

        {/* Cartes de métriques multiples */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MultiMetricCard
            title="Statistiques Utilisateurs"
            icon="fas fa-users"
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
            metrics={[
              {
                label: 'Candidats',
                value: formatNumber(stats.users?.users_by_type?.CANDIDAT || 0),
                icon: 'fas fa-user-graduate',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                change: '+5%',
                changeType: 'positive'
              },
              {
                label: 'Recruteurs',
                value: formatNumber(stats.users?.users_by_type?.RECRUTEUR || 0),
                icon: 'fas fa-building',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                change: '+3%',
                changeType: 'positive'
              },
              {
                label: 'Admins',
                value: formatNumber(stats.users?.users_by_type?.ADMIN || 0),
                icon: 'fas fa-user-shield',
                iconBg: 'bg-purple-100',
                iconColor: 'text-purple-600',
                change: '0%',
                changeType: 'neutral'
              }
            ]}
            onClick={() => console.log('Utilisateurs détaillés')}
          />

          <MultiMetricCard
            title="Statistiques Contenu"
            icon="fas fa-chart-bar"
            iconColor="text-green-600"
            bgColor="bg-green-50"
            metrics={[
              {
                label: 'Offres Publiées',
                value: formatNumber(stats.content?.jobs_by_status?.PUBLISHED || 0),
                icon: 'fas fa-check-circle',
                iconBg: 'bg-green-100',
                iconColor: 'text-green-600',
                change: '+12%',
                changeType: 'positive'
              },
              {
                label: 'Candidatures Approuvées',
                value: formatNumber(stats.content?.applications_by_status?.APPROVED || 0),
                icon: 'fas fa-thumbs-up',
                iconBg: 'bg-blue-100',
                iconColor: 'text-blue-600',
                change: '+8%',
                changeType: 'positive'
              },
              {
                label: 'Articles Publiés',
                value: formatNumber(stats.content?.blog_posts_by_status?.PUBLISHED || 0),
                icon: 'fas fa-newspaper',
                iconBg: 'bg-orange-100',
                iconColor: 'text-orange-600',
                change: '+6%',
                changeType: 'positive'
              }
            ]}
            onClick={() => console.log('Contenu détaillé')}
          />
        </div>

        {/* Cartes de progression circulaire */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <CircularProgressCard
            title="Utilisateurs Actifs"
            value={stats.users?.active_users || 0}
            maxValue={stats.system?.total_users || 1}
            icon="fas fa-user-check"
            iconColor="text-green-600"
            bgColor="bg-green-50"
            progressColor="text-green-600"
            subtitle="Pourcentage d'utilisateurs actifs"
            size="md"
          />

          <CircularProgressCard
            title="Offres Actives"
            value={stats.content?.jobs_by_status?.PUBLISHED || 0}
            maxValue={stats.system?.total_jobs || 1}
            icon="fas fa-briefcase"
            iconColor="text-blue-600"
            bgColor="bg-blue-50"
            progressColor="text-blue-600"
            subtitle="Pourcentage d'offres publiées"
            size="md"
          />

          <CircularProgressCard
            title="Taux de Conversion"
            value={stats.analytics?.conversion_rate || 0}
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
            value={100 - (stats.system?.system_health?.cpu_usage || 0)}
            maxValue={100}
            icon="fas fa-heartbeat"
            iconColor="text-red-600"
            bgColor="bg-red-50"
            progressColor="text-red-600"
            subtitle="Performance système"
            size="md"
          />
        </div>

        {/* Statistiques Blog et Applications avec design moderne */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <i className="fas fa-blog mr-3"></i>
                Statistiques Blog
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatNumber(stats.blog?.total_posts || 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatNumber(stats.blog?.published_posts || 0)}
                  </div>
                  <div className="text-sm text-gray-500">Publiés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatNumber(stats.blog?.total_views || 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Vues</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {formatNumber(stats.blog?.total_likes || 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Likes</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-blue-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <i className="fas fa-file-alt mr-3"></i>
                Statistiques Applications
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">
                    {formatNumber(stats.applications?.total_applications || 0)}
                  </div>
                  <div className="text-sm text-gray-500">Total Candidatures</div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {stats.applications?.applications_by_type && Object.entries(stats.applications.applications_by_type).map(([type, count]) => {
                    const getTypeLabel = (type) => {
                      switch (type) {
                        case 'CONSULTATION':
                          return 'Consultations';
                        case 'FUNDING':
                          return 'Financement de projets';
                        case 'JOB':
                          return 'Emploi';
                        default:
                          return type;
                      }
                    };
                    
                    return (
                      <div key={type} className="bg-gray-50 rounded-lg p-3">
                        <div className="text-lg font-semibold text-gray-900">{count}</div>
                        <div className="text-xs text-gray-500">{getTypeLabel(type)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques Système et Temps Réel avec design moderne */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <i className="fas fa-server mr-3"></i>
                Santé du Système
              </h3>
            </div>
            <div className="p-6">
              {stats.system?.system_health && (
                <div className="space-y-4">
                  {[
                    { label: 'CPU', value: stats.system.system_health.cpu_usage, color: 'blue' },
                    { label: 'Mémoire', value: stats.system.system_health.memory_usage, color: 'green' },
                    { label: 'Disque', value: stats.system.system_health.disk_usage, color: 'purple' }
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                        <span className={`text-sm font-semibold ${
                          metric.value < 80 ? 'text-green-600' : 'text-yellow-600'
                        }`}>
                          {metric.value?.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            metric.value < 80 ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${metric.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Uptime</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {stats.system.system_health.uptime || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <i className="fas fa-clock mr-3"></i>
                Temps Réel
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { label: 'Utilisateurs en ligne', value: stats.realTime?.online_users, color: 'green', icon: 'fa-users' },
                  { label: 'Sessions actives', value: stats.realTime?.active_sessions, color: 'blue', icon: 'fa-link' },
                  { label: 'Connexions récentes', value: stats.realTime?.recent_logins, color: 'purple', icon: 'fa-sign-in-alt' },
                  { label: 'Candidatures récentes', value: stats.realTime?.recent_applications, color: 'orange', icon: 'fa-file-alt' }
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg bg-${metric.color}-100 text-${metric.color}-600`}>
                        <i className={`fas ${metric.icon}`}></i>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                    </div>
                    <span className={`text-lg font-bold text-${metric.color}-600`}>
                      {formatNumber(metric.value || 0)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques Abonnements avec design moderne */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <i className="fas fa-credit-card mr-3"></i>
              Statistiques Abonnements
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Abonnements', value: stats.subscriptions?.total_subscriptions, color: 'blue', icon: 'fa-credit-card' },
                { label: 'Actifs', value: stats.subscriptions?.active_subscriptions, color: 'green', icon: 'fa-check-circle' },
                { label: 'Expirés', value: stats.subscriptions?.expired_subscriptions, color: 'red', icon: 'fa-times-circle' },
                { label: 'Revenus Totaux', value: `${formatNumber(stats.subscriptions?.total_revenue || 0)}€`, color: 'emerald', icon: 'fa-dollar-sign' }
              ].map((metric) => (
                <div key={metric.label} className="text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-${metric.color}-100 text-${metric.color}-600 mb-4`}>
                    <i className={`fas ${metric.icon} text-2xl`}></i>
                  </div>
                  <div className={`text-2xl font-bold text-${metric.color}-600 mb-2`}>
                    {metric.value}
                  </div>
                  <div className="text-sm text-gray-500">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bouton de rafraîchissement avec design moderne */}
        <div className="text-center">
          <button
            onClick={loadDashboardData}
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-2xl shadow-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transform hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-sync-alt mr-3 animate-spin"></i>
            Rafraîchir les données
          </button>
        </div>
      </div>
    </div>
  );
} 