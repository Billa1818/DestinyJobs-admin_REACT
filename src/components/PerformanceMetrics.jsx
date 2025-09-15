import React from 'react';

const PerformanceMetrics = ({ 
  title, 
  metrics, 
  className = '' 
}) => {
  const getMetricColor = (value, threshold = 80) => {
    if (value >= threshold) return 'text-green-600';
    if (value >= threshold * 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMetricIcon = (value, threshold = 80) => {
    if (value >= threshold) return 'fas fa-check-circle';
    if (value >= threshold * 0.7) return 'fas fa-exclamation-triangle';
    return 'fas fa-times-circle';
  };

  if (!metrics || Object.keys(metrics).length === 0) {
    return (
      <div className={`bg-white shadow rounded-lg ${className}`}>
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <div className="text-center text-gray-500">
            <i className="fas fa-chart-line text-4xl mb-2"></i>
            <p>Aucune métrique disponible</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {Object.entries(metrics).map(([key, value]) => {
            const isPercentage = typeof value === 'number' && value <= 100;
            const displayValue = isPercentage ? `${value.toFixed(1)}%` : value;
            const color = isPercentage ? getMetricColor(value) : 'text-gray-900';
            const icon = isPercentage ? getMetricIcon(value) : 'fas fa-info-circle';
            
            return (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <i className={`${icon} ${color}`}></i>
                  <span className="text-sm text-gray-600 capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className={`text-sm font-medium ${color}`}>
                  {displayValue}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics; 