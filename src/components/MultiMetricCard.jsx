import React, { useState, useEffect } from 'react';

const MultiMetricCard = ({ 
  title, 
  icon, 
  iconColor = 'text-blue-600',
  bgColor = 'bg-blue-50',
  metrics = [],
  onClick,
  className = '',
  variant = 'default' // default, compact, expanded
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getCardClasses = () => {
    const baseClasses = 'relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500';
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} transform hover:scale-105`;
      case 'expanded':
        return `${baseClasses} transform hover:-translate-y-1`;
      default:
        return `${baseClasses} transform hover:scale-105 hover:-translate-y-1`;
    }
  };

  const getIconClasses = () => {
    const baseClasses = 'p-4 rounded-2xl text-2xl';
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} ${bgColor} ${iconColor}`;
      case 'expanded':
        return `${baseClasses} ${bgColor} ${iconColor} shadow-lg`;
      default:
        return `${baseClasses} ${bgColor} ${iconColor}`;
    }
  };

  const renderMetrics = () => {
    if (!metrics || metrics.length === 0) {
      return (
        <div className="text-center text-gray-500 py-8">
          <i className="fas fa-chart-bar text-4xl mb-2"></i>
          <p className="text-sm">Aucune métrique disponible</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div 
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: `translateX(${isVisible ? 0 : -20}px)`,
              transitionDelay: `${index * 100}ms`
            }}
          >
            <div className="flex items-center space-x-3">
              {metric.icon && (
                <div className={`p-2 rounded-lg ${metric.iconBg || 'bg-white'} ${metric.iconColor || 'text-gray-600'}`}>
                  <i className={`${metric.icon} text-sm`}></i>
                </div>
              )}
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {metric.label}
                </div>
                {metric.description && (
                  <div className="text-xs text-gray-500">
                    {metric.description}
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">
                {metric.value}
              </div>
              {metric.change && (
                <div className={`text-xs font-medium ${
                  metric.changeType === 'positive' ? 'text-green-600' : 
                  metric.changeType === 'negative' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  <i className={`fas ${
                    metric.changeType === 'positive' ? 'fa-arrow-up' : 
                    metric.changeType === 'negative' ? 'fa-arrow-down' : 
                    'fa-minus'
                  } mr-1`}></i>
                  {metric.change}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`${getCardClasses()} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : 20}px)`
      }}
    >
      {/* Fond décoratif */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${bgColor} rounded-full -mr-12 -mt-12 opacity-10`}></div>
      
      {/* En-tête */}
      <div className="relative p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={getIconClasses()}>
              <i className={icon}></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
              <div className="text-sm text-gray-500">
                Métriques détaillées
              </div>
            </div>
          </div>
          
          {onClick && (
            <button 
              onClick={onClick}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <i className="fas fa-external-link-alt"></i>
            </button>
          )}
        </div>
      </div>

      {/* Contenu des métriques */}
      <div className="p-6">
        {renderMetrics()}
      </div>

      {/* Effet de brillance au survol */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default MultiMetricCard; 