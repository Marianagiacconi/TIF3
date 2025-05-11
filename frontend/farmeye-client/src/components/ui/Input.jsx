import React from 'react';

const Input = ({
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`
          w-full px-3 py-1.5 sm:px-4 sm:py-2
          text-sm sm:text-base
          rounded-xl
          border border-gray-300
          focus:outline-none focus:ring-2 focus:ring-[#6CB7A1] focus:border-transparent
          placeholder:text-gray-400
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default Input; 