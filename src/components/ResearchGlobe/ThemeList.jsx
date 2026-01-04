import React from 'react';
import { motion } from 'framer-motion';

const themes = [
    'Extreme Weather Events',
    'Climate Modeling and Predictions',
    'Glacier Dynamics and Water Resources',
    'Vegetation Changes and Land Use',
    'Humanitarian Response',
    'Terrestrial Water Changes'
];

const ThemeList = ({ activeTheme, onThemeSelect }) => {
    return (
        <div className="h-full flex flex-col justify-center px-8 z-10 relative pointer-events-none">
            <div className="pointer-events-auto">
                <h2 className="text-4xl font-bold font-heading mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                    Research Themes
                </h2>

                <div className="space-y-4">
                    {themes.map((theme, index) => (
                        <motion.div
                            key={theme}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <button
                                onClick={() => onThemeSelect(theme === activeTheme ? null : theme)}
                                className={`group flex items-center w-full text-left p-4 rounded-xl transition-all duration-300 backdrop-blur-sm border ${activeTheme === theme
                                        ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                {/* Indicator Dot */}
                                <div className={`w-3 h-3 rounded-full mr-4 transition-all duration-300 ${activeTheme === theme ? 'bg-accent shadow-[0_0_10px_#f97316]' : 'bg-gray-500 group-hover:bg-gray-300'
                                    }`}></div>

                                <span className={`text-lg font-medium transition-colors ${activeTheme === theme ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                    }`}>
                                    {theme}
                                </span>
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* Return to Global View Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: activeTheme ? 1 : 0 }}
                    className={`mt-8 px-6 py-2 rounded-full border border-white/20 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all ${!activeTheme && 'pointer-events-none'
                        }`}
                    onClick={() => onThemeSelect(null)}
                >
                    ← Return to Global View
                </motion.button>
            </div>
        </div>
    );
};

export default ThemeList;
