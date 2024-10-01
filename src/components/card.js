import React from 'react';

// Card Component
export const Card = ({ children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

// CardHeader Component
export const CardHeader = ({ children, className }) => {
  return (
    <div className={`border-b-2 pb-2 mb-4 font-bold text-lg ${className}`}>
      {children}
    </div>
  );
};

// CardContent Component
export const CardContent = ({ children, className }) => {
  return (
    <div className={`text-gray-700 ${className}`}>
      {children}
    </div>
  );
};
