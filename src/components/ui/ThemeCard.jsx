import React from 'react';

const ThemeCard = ({ title, image, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]"
        >
            {/* Background Image with Zoom Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: image }}
            ></div>

            {/* Gradient Overlay (Always visible but gets darker on hover) */}
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

            {/* Content Container */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end transform transition-transform duration-500">

                {/* Animated Line */}
                <div className="w-12 h-1 bg-primary mb-4 transform origin-left transition-all duration-500 scale-x-0 group-hover:scale-x-100"></div>

                {/* Title moves up slightly on hover */}
                <h3 className="text-2xl font-bold text-white font-heading leading-tight group-hover:-translate-y-2 transition-transform duration-500">
                    {title}
                </h3>

                {/* Description/Link Reveal */}
                <div className="h-0 overflow-hidden group-hover:h-8 transition-all duration-500">
                    <span className="text-primary font-medium text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        Explore Research <span className="text-lg">→</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ThemeCard;
