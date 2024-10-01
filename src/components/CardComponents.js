import React from 'react';

export const Card = ({ className, children }) => (
  <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="px-6 py-4 border-b border-gray-700">
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div className="px-6 py-4">
    {children}
  </div>
);