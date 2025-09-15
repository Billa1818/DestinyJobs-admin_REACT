import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  icon, 
  iconColor = 'text-blue-600', 
  valueColor = 'text-gray-900',
  subtitle,
  trend,
  trendValue,
  trendColor = 'text-green-600',
  onClick,
  className = '',
  variant = 'default' // default, gradient, outline, elevated
}) => {
  const getCardClasses = () => {
    const baseClasses = 'rounded-xl transition-all duration-300 transform hover:scale-105';
    
    switch (variant) {
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg hover:shadow-xl`;
      case 'outline':
        return `${baseClasses} bg-white border-2 border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300`;
      case 'elevated':
        return `${baseClasses} bg-white shadow-xl hover:shadow-2xl border border-gray-100`;
      default:
        return `${baseClasses} bg-white shadow-lg hover:shadow-xl border border-gray-100`;
    }
  };

  const getIconClasses = () => {
    const baseClasses = 'text-3xl p-3 rounded-full';
    
    switch (variant) {
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br ${iconColor.replace('text-', 'from-')} ${iconColor.replace('text-', 'to-')} text-white shadow-lg`;
      case 'outline':
        return `${baseClasses} border-2 ${iconColor.replace('text-', 'border-')} ${iconColor} bg-gray-50`;
      case 'elevated':
        return `${baseClasses} ${iconColor} bg-gray-50 shadow-md`;
      default:
        return `${baseClasses} ${iconColor} bg-gray-50`;
    }
  };

  const CardContent = (
    <div className={`${getCardClasses()} ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`${getIconClasses()}`}>
            <i className={icon}></i>
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${trendColor}`}>
              <i className={`fas ${trend === 'up' ? 'fa-arrow-up' : 'fa-arrow-down'}`}></i>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
          <div className="flex items-baseline space-x-2">
            <span className={`text-3xl font-bold ${valueColor}`}>
              {value}
            </span>
            {subtitle && (
              <span className="text-sm text-gray-500 font-medium">
                {subtitle}
              </span>
            )}
          </div>
        </div>

        {/* Barre de progression décorative */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className={`h-1 rounded-full transition-all duration-1000 ease-out ${iconColor.replace('text-', 'bg-')}`}
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-xl"
      >
        {CardContent}
      </button>
    );
  }

  return CardContent;
};

export default StatCard; 