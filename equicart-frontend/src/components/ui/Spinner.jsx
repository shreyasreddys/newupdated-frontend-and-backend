import React from 'react';

const Spinner = ({ size = 'md', color = 'primary' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-primary border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]}`}></div>
    </div>
  );
};

export default Spinner;
