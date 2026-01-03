import React from 'react';

const GlassCard = ({ children, className = '' }) => {
    return (
        <div className={`bg-gray-800/40 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export default GlassCard;
