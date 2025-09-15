import React from 'react';

const StatsChart = ({ 
  title, 
  data, 
  type = 'bar', 
  height = 'h-64',
  className = ''
}) => {
  const renderBarChart = () => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <i className="fas fa-chart-bar text-4xl mb-2"></i>
          <p className="text-sm">Aucune donnée disponible</p>
        </div>
      );
    }

    const maxValue = Math.max(...Object.values(data));
    
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center space-x-3">
            <div className="w-20 text-sm text-gray-600 truncate">{key}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(value / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-12 text-sm font-medium text-gray-900 text-right">
              {value}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPieChart = () => {
    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-500">
          <i className="fas fa-chart-pie text-4xl mb-2"></i>
          <p className="text-sm">Aucune donnée disponible</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-lg font-semibold text-indigo-600">{value}</div>
            <div className="text-xs text-gray-500 truncate">{key}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className={`bg-white shadow rounded-lg ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      </div>
      <div className={`p-6 ${height}`}>
        {renderChart()}
      </div>
    </div>
  );
};

export default StatsChart; 