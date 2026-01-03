import React from 'react';

const Hero = ({ onExplore }) => {
    return (
        <div className="relative h-[calc(100vh-4rem)] overflow-hidden">
            {/* Background Video */}
            <div className="absolute inset-0 z-0">
                <video
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                >
                    <source src={import.meta.env.BASE_URL + "temporal.mp4"} type="video/mp4" />
                </video>
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 via-dark-900/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
                <div className="max-w-2xl">
                    <h1 className="text-5xl md:text-7xl font-bold font-heading text-white mb-6 leading-tight animate-fade-in-up">
                        Decoding the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            Third Pole
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light leading-relaxed animate-fade-in-up delay-100">
                        Advanced AI forecasting and early disaster warning systems for the roof of the world.
                    </p>

                    <div className="flex gap-4 animate-fade-in-up delay-200">
                        <button
                            onClick={onExplore}
                            className="px-8 py-3 bg-gradient-to-r from-secondary-dark to-primary-dark text-white rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Explore Data
                        </button>
                        <button className="px-8 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
