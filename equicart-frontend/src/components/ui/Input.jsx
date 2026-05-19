import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-sm font-medium text-textSecondary">{label}</label>}
      <input
        ref={ref}
        className={`bg-surface border ${error ? 'border-danger' : 'border-white/10'} rounded-xl px-4 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
        {...props}
      />
      {error && <span className="text-xs text-danger mt-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
