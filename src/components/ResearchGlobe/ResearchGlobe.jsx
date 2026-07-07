import React, { useState, Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import Earth from './Earth';

const THEMES = [
    { name: 'Extreme Weather Events', region: 'Indian Subcontinent' },
    { name: 'Climate Modeling and Predictions', region: 'Tibetan Plateau' },
    { name: 'Glacier Dynamics and Water Resources', region: 'Everest Massif' },
    { name: 'Vegetation Changes and Land Use', region: 'Amazon Basin' },
    { name: 'Humanitarian Response', region: 'Nepal & Bihar' },
    { name: 'Terrestrial Water Changes', region: 'Uttarakhand' },
];

const LoadingFallback = () => (
    <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
            <div className="w-10 h-10 border border-ink border-t-glacier rounded-full animate-spin mx-auto mb-3" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Plotting terrain&hellip;</p>
        </div>
    </div>
);

// Left index — cartographic table of research themes
const ThemeIndex = ({ activeTheme, onThemeSelect }) => (
    <div>
        <div className="flex items-center gap-4 mb-6 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
            <span className="h-px w-8 bg-ink-faint" />
            <span>Index of Study</span>
        </div>

        <h2 className="font-display font-light text-ink text-4xl lg:text-5xl leading-[0.95] tracking-tight mb-4">
            Research
            <span className="block italic text-glacier">Themes</span>
        </h2>
        <p className="text-ink-soft text-sm leading-relaxed max-w-sm mb-8">
            Six lines of inquiry across the Third Pole. Select a plate to survey
            its region on the globe.
        </p>

        <ul className="border-t border-paper-deep">
            {THEMES.map((t, i) => {
                const isActive = activeTheme === t.name;
                return (
                    <li key={t.name} className="border-b border-paper-deep">
                        <button
                            onClick={() => onThemeSelect(isActive ? null : t.name)}
                            className="group w-full text-left py-4 flex items-baseline gap-4 transition-colors"
                        >
                            <span className={`font-mono text-xs tabular-nums transition-colors ${isActive ? 'text-glacier' : 'text-ink-faint group-hover:text-ink'}`}>
                                {String(i + 1).padStart(2, '0')}
                            </span>
                            <span className="flex-1">
                                <span className={`block font-display text-lg leading-snug transition-colors ${isActive ? 'text-glacier' : 'text-ink group-hover:text-glacier'}`}>
                                    {t.name}
                                </span>
                                <span className="block font-mono text-[10px] uppercase tracking-widest text-ink-faint mt-0.5">
                                    {t.region}
                                </span>
                            </span>
                            <span className={`self-center transition-all duration-300 ${isActive ? 'text-glacier translate-x-0 opacity-100' : 'text-ink-faint -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`}>
                                &rarr;
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>

        <AnimatePresence>
            {activeTheme && (
                <motion.button
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    onClick={() => onThemeSelect(null)}
                    className="mt-6 font-mono text-[11px] uppercase tracking-widest text-ink-soft hover:text-glacier transition-colors flex items-center gap-2"
                >
                    <span>&larr;</span> Return to global view
                </motion.button>
            )}
        </AnimatePresence>
    </div>
);

const ResearchGlobe = () => {
    const [activeTheme, setActiveTheme] = useState(null);
    const cameraControlsRef = useRef();

    return (
        <div className="relative w-full grid lg:grid-cols-[minmax(320px,2fr)_3fr] gap-8 lg:gap-12 items-center">
            {/* Left: index */}
            <div className="order-2 lg:order-1">
                <ThemeIndex activeTheme={activeTheme} onThemeSelect={setActiveTheme} />
            </div>

            {/* Right: globe plate */}
            <div className="order-1 lg:order-2 relative">
                <div className="relative aspect-square w-full max-w-[620px] mx-auto">
                    {/* Plate backdrop: soft glacier vignette + hairline frame */}
                    <div className="absolute inset-0 rounded-full"
                        style={{ background: 'radial-gradient(circle at 50% 45%, rgba(31,95,139,0.12), rgba(31,95,139,0) 62%)' }} />
                    <div className="pointer-events-none absolute inset-[6%] rounded-full border border-paper-deep" />
                    <div className="pointer-events-none absolute inset-0 rounded-full border border-glacier/20" />

                    <Suspense fallback={<LoadingFallback />}>
                        <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]} style={{ background: 'transparent' }}>
                            <PerspectiveCamera makeDefault position={[0, 0, 3.5]} fov={45} near={0.1} far={1000} />
                            <ambientLight intensity={0.6} />
                            <Earth activeTheme={activeTheme} cameraControlsRef={cameraControlsRef} />
                        </Canvas>
                    </Suspense>

                    {/* Corner caption — below the plate */}
                    <div className="absolute -bottom-8 inset-x-0 flex justify-between font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                        <span>Fig. 01 &mdash; Regional Overview</span>
                        <span>Drag to rotate</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResearchGlobe;
