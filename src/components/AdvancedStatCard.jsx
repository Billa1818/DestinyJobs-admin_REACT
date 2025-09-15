import React, { useState, useEffect } from 'react';

const AdvancedStatCard = ({ 
  title, 
  value, 
  icon, 
  iconColor = 'text-blue-600',
  bgColor = 'bg-blue-50',
  borderColor = 'border-blue-200',
  subtitle,
  change,
  changeType = 'positive', // positive, negative, neutral
  chartData = [],
  onClick,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    // Animation du graphique
    setTimeout(() => setChartWidth(100), 300);
  }, []);

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      case 'neutral':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'fa-arrow-up';
      case 'negative':
        return 'fa-arrow-down';
      case 'neutral':
        return 'fa-minus';
      default:
        return 'fa-arrow-up';
    }
  };

  const renderMiniChart = () => {
    if (!chartData || chartData.length === 0) {
      return (
        <div className="h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          <i className="fas fa-chart-line text-gray-400"></i>
        </div>
      );
    }

    const maxValue = Math.max(...chartData);
    const minValue = Math.min(...chartData);
    const range = maxValue - minValue || 1;

    return (
      <div className="h-16 flex items-end space-x-1">
        {chartData.map((point, index) => {
          const height = ((point - minValue) / range) * 100;
          return (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-sm transition-all duration-500 ease-out"
              style={{ 
                height: `${height}%`,
                transform: `scaleY(${isVisible ? 1 : 0})`,
                transformOrigin: 'bottom'
              }}
            ></div>
          );
        })}
      </div>
    );
  };

  return (
    <div 
      className={`
        relative overflow-hidden bg-white rounded-2xl border-2 ${borderColor} 
        shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2
        ${className}
      `}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 20}px)`
      }}
    >
      {/* Fond décoratif */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} rounded-full -mr-16 -mt-16 opacity-20`}></div>
      
      {/* Contenu principal */}
      <div className="relative p-6">
        {/* En-tête avec icône et indicateur de changement */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor} ${iconColor}`}>
            <i className={`${icon} text-2xl`}></i>
          </div>
          
          {change && (
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getChangeColor()}`}>
              <i className={`fas ${getChangeIcon()} mr-1`}></i>
              {change}
            </div>
          )}
        </div>

        {/* Titre et valeur */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wider mb-2">
            {title}
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {value}
            </span>
            {subtitle && (
              <span className="text-sm text-gray-500 font-medium">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Graphique miniature */}
        <div className="mb-4">
          {renderMiniChart()}
        </div>

        {/* Barre de progression animée */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${iconColor.replace('text-', 'bg-')}`}
              style={{ 
                width: `${chartWidth}%`,
                background: `linear-gradient(90deg, ${iconColor.replace('text-', 'bg-')} 0%, ${bgColor.replace('bg-', 'bg-')} 100%)`
              }}
            ></div>
          </div>
        </div>

        {/* Indicateur de statut */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${iconColor.replace('text-', 'bg-')}`}></div>
            <span className="text-xs text-gray-500">Actif</span>
          </div>
          
          {onClick && (
            <button 
              onClick={onClick}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-external-link-alt"></i>
            </button>
          )}
        </div>
      </div>

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default AdvancedStatCard; 