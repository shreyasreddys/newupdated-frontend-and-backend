import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = 'px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-orange-600 shadow-lg shadow-primary/30',
    secondary: 'bg-secondary text-white hover:bg-neutral-700',
    outline: 'border border-primary text-primary hover:bg-primary/10',
    ghost: 'text-textSecondary hover:text-white hover:bg-white/5',
    danger: 'bg-danger text-white hover:bg-red-600 shadow-lg shadow-danger/30'
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
