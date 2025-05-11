import React from 'react';

const Container = ({ children, className = '' }) => {
  return (
    <div className="min-h-screen bg-[#F6F6F6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] bg-white rounded-3xl shadow-lg flex flex-col overflow-hidden border border-gray-200">
        {children}
      </div>
    </div>
  );
};

export default Container; 