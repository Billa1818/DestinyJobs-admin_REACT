import React, { useState, useEffect } from 'react';

const CircularProgressCard = ({ 
  title, 
  value, 
  maxValue = 100,
  icon, 
  iconColor = 'text-blue-600',
  bgColor = 'bg-blue-50',
  progressColor = 'text-blue-600',
  subtitle,
  onClick,
  className = '',
  size = 'lg' // sm, md, lg, xl
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    // Animation de la progression
    const timer = setTimeout(() => {
      const percentage = (value / maxValue) * 100;
      setProgress(percentage);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [value, maxValue]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { container: 'w-32 h-32', text: 'text-2xl', icon: 'text-lg' };
      case 'md':
        return { container: 'w-40 h-40', text: 'text-3xl', icon: 'text-xl' };
      case 'xl':
        return { container: 'w-48 h-48', text: 'text-4xl', icon: 'text-2xl' };
      default: // lg
        return { container: 'w-36 h-36', text: 'text-3xl', icon: 'text-xl' };
    }
  };

  const sizeClasses = getSizeClasses();
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div 
      className={`relative overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `scale(${isVisible ? 1 : 0.8})`
      }}
    >
      {/* Fond décoratif */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${bgColor} rounded-full -mr-10 -mt-10 opacity-20`}></div>
      
      <div className="relative p-6">
        {/* En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div className={`p-3 rounded-xl ${bgColor} ${iconColor}`}>
            <i className={`${icon} text-xl`}></i>
          </div>
          
          <div className="text-right">
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
              {title}
            </h3>
            {subtitle && (
              <div className="text-xs text-gray-500 mt-1">
                {subtitle}
              </div>
            )}
          </div>
        </div>

        {/* Graphique circulaire */}
        <div className="flex justify-center mb-4">
          <div className={`relative ${sizeClasses.container}`}>
            {/* Cercle de fond */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-gray-200"
              />
              
              {/* Cercle de progression */}
              <circle
                cx="60"
                cy="60"
                r={radius}
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className={`${progressColor} transition-all duration-1000 ease-out`}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            
            {/* Valeur centrale */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`font-bold ${sizeClasses.text} ${progressColor}`}>
                  {Math.round(progress)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {value} / {maxValue}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Barre de progression linéaire */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>0%</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${progressColor.replace('text-', 'bg-')}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Indicateur de statut */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${progressColor.replace('text-', 'bg-')}`}></div>
            <span className="text-xs text-gray-500">
              {progress >= 80 ? 'Excellent' : progress >= 60 ? 'Bon' : progress >= 40 ? 'Moyen' : 'Faible'}
            </span>
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

export default CircularProgressCard; 