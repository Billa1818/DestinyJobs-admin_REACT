import React from 'react';

const Loader = ({ 
  size = 'md', 
  text = 'Chargement...', 
  fullScreen = true,
  color = 'indigo',
  showText = true 
}) => {
  const sizeClasses = {
    sm: 'h-12 w-12 border-2',
    md: 'h-16 w-16 border-4',
    lg: 'h-32 w-32 border-4',
    xl: 'h-40 w-40 border-4'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 flex justify-center items-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100'
    : 'flex flex-col justify-center items-center w-full py-12';

  const loaderClasses = `animate-spin rounded-full ${sizeClasses[size]} border-gray-200 border-t-${color}-600 mx-auto`;

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center">
        <div className={loaderClasses}></div>
        {showText && (
          <div className="mt-8 flex flex-col items-center justify-center">
            <p className="text-gray-600 text-lg font-medium whitespace-nowrap text-center px-4">{text}</p>
            <div className="mt-6 flex justify-center items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader; 