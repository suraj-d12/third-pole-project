import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import Earth from './Earth';

// Loading fallback component
const LoadingFallback = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black">
        <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 text-sm">Loading 3D Assets...</p>
        </div>
    </div>
);

// Left side theme list with Antigravity UI
const ThemeList = ({ activeTheme, onThemeSelect }) => {
    const themes = [
        'Extreme Weather Events',
        'Climate Modeling and Predictions',
        'Glacier Dynamics and Water Resources',
        'Vegetation Changes and Land Use',
        'Humanitarian Response',
        'Terrestrial Water Changes'
    ];

    return (
        <div className="h-full flex flex-col justify-center px-8 lg:px-12">
            <h2 className="text-4xl lg:text-5xl font-bold font-heading mb-4 text-white">
                Research
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                    Themes
                </span>
            </h2>

            <p className="text-gray-400 mb-10 text-sm lg:text-base max-w-md">
                Explore our research areas across the Third Pole region. Click a theme to focus on its geographic region.
            </p>

            <div className="space-y-3 perspective-1000">
                {themes.map((theme, index) => {
                    const isActive = activeTheme === theme;

                    return (
                        <motion.button
                            key={theme}
                            onClick={() => onThemeSelect(isActive ? null : theme)}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{
                                x: 0,
                                opacity: 1,
                                scale: isActive ? 1.05 : 1,
                                z: isActive ? 50 : 0
                            }}
                            whileHover={{
                                scale: 1.02,
                                x: 10,
                                transition: { type: "spring", stiffness: 300 }
                            }}
                            transition={{
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 200,
                                damping: 20
                            }}
                            className={`relative group flex items-center w-full text-left py-3 px-4 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary shadow-[0_0_30px_rgba(56,189,248,0.2)]'
                                : 'hover:bg-white/5 border-l-4 border-transparent hover:border-white/20'
                                }`}
                        >
                            {/* Animated Background Pulse for Active State */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeGlow"
                                    className="absolute inset-0 bg-primary/10 blur-xl rounded-xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Indicator */}
                            <div className={`w-2 h-2 rounded-full mr-4 transition-all duration-300 ${isActive
                                ? 'bg-primary shadow-[0_0_10px_#38bdf8] scale-150'
                                : 'bg-gray-600 group-hover:bg-gray-400'
                                }`}></div>

                            <span className={`text-base lg:text-lg font-medium transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
                                }`}>
                                {theme}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Return to Global View */}
            <AnimatePresence>
                {activeTheme && (
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        onClick={() => onThemeSelect(null)}
                        className="mt-8 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                    >
                        <motion.span
                            animate={{ x: [0, -4, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            ←
                        </motion.span>
                        Return to Global View
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};

import { createPortal } from 'react-dom';

const ResearchGlobe = () => {
    const [activeTheme, setActiveTheme] = useState(null);
    const cameraControlsRef = useRef();

    // Render stars into the body to ensure full-screen coverage regardless of parent containers
    const FullScreenStars = createPortal(
        <div className="fixed inset-0 w-screen h-screen pointer-events-none -z-50 bg-black">
            <Canvas
                gl={{ antialias: false, alpha: false }} // Alpha false for solid black background
                style={{ background: '#000000', width: '100%', height: '100%' }}
                camera={{ position: [0, 0, 1] }} // Simple camera for stars
            >
                <Stars
                    radius={300}
                    depth={50}
                    count={5000} // Reduced for performance
                    factor={4}
                    saturation={0}
                    fade
                    speed={0.5}
                />
            </Canvas>
        </div>,
        document.body
    );

    return (
        // Removed borders, backgrounds, and fixed height constraint to integrate with page
        <div className="relative w-full h-[85vh] min-h-[600px] flex items-center">

            {/* Inject the Full Screen Stars */}
            {FullScreenStars}

            {/* Content Container with Flex and Gap */}
            <div className="relative z-10 w-full h-full flex items-center gap-12 px-8">

                {/* Left Side: Text Container - 40% */}
                <div className="w-2/5 min-w-[320px] h-full flex items-center">
                    <div className="w-full">
                        <ThemeList activeTheme={activeTheme} onThemeSelect={setActiveTheme} />
                    </div>
                </div>

                {/* Right Side: 3D Canvas - 60% */}
                <div className="flex-1 h-full">
                    <Suspense fallback={<LoadingFallback />}>
                        <Canvas
                            gl={{ antialias: true, alpha: true }}
                            dpr={[1, 2]}
                            style={{ background: 'transparent' }}
                        >
                            {/* Initial Camera Position */}
                            <PerspectiveCamera
                                makeDefault
                                position={[0, 0, 3.5]}
                                fov={45}
                                near={0.1}
                                far={1000}
                            />

                            {/* Cinematic Lighting */}
                            <ambientLight intensity={0.15} />
                            <directionalLight
                                position={[5, 3, 5]}
                                intensity={1.8}
                                color="#ffffff"
                            />
                            <directionalLight
                                position={[-5, -3, -5]}
                                intensity={0.3}
                                color="#38bdf8"
                            />
                            <pointLight
                                position={[10, 0, 10]}
                                intensity={0.5}
                                color="#0ea5e9"
                            />

                            {/* The Earth with Camera Controls */}
                            <Earth activeTheme={activeTheme} cameraControlsRef={cameraControlsRef} />
                        </Canvas>
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default ResearchGlobe;
