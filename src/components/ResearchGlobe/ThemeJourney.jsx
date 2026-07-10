import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Earth, { THEME_ORDER, themeCoordinates } from './Earth';

const NIGHT = '#0a0f16';

const LoadingFallback = () => (
    <div className="absolute inset-0 grid place-items-center">
        <div className="w-9 h-9 border border-paper-deep border-t-glacier rounded-full animate-spin" />
    </div>
);

// Globe pushed right on desktop, up on small screens (screen-space focal offset).
const useFocalOffset = () => {
    const [offset, setOffset] = useState([0, 0]);
    useEffect(() => {
        const compute = () => setOffset(window.innerWidth >= 1024 ? [-1.2, 0] : [0, -0.55]);
        compute();
        window.addEventListener('resize', compute);
        return () => window.removeEventListener('resize', compute);
    }, []);
    return offset;
};

const ThemeJourney = () => {
    const sectionRef = useRef(null);
    // No theme selected initially: the globe holds the wide global view on the
    // right, clear of the index. Zoom (and possible overlap) only on selection.
    const [activeTheme, setActiveTheme] = useState(null);
    const [night, setNight] = useState(false);
    const cameraControlsRef = useRef();
    const focalOffset = useFocalOffset();

    // Night falls while the globe holds the viewport, and lifts on the way out.
    const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
    const nightOpacity = useTransform(scrollYProgress, [0.12, 0.38, 0.62, 0.88], [0, 1, 1, 0]);
    useMotionValueEvent(scrollYProgress, 'change', (p) => {
        const isNight = p > 0.25 && p < 0.75;
        setNight((prev) => {
            if (prev !== isNight) window.dispatchEvent(new CustomEvent('globe-night', { detail: isNight }));
            return isNight;
        });
    });

    return (
        <section ref={sectionRef} id="research" className="relative">
            {/* Scroll-linked night backdrop */}
            <motion.div
                aria-hidden
                className="fixed inset-0 z-0 pointer-events-none"
                style={{ opacity: nightOpacity, backgroundColor: NIGHT }}
            />

            <div className="relative lg:h-screen">
                {/* Full-bleed globe — only the screen edge ever crops it */}
                <div className="absolute inset-0 z-[1] cursor-grab active:cursor-grabbing h-[60vh] lg:h-full">
                    <Suspense fallback={<LoadingFallback />}>
                        <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]} style={{ background: 'transparent' }}>
                            <PerspectiveCamera makeDefault position={[0, 0, 3.1]} fov={45} near={0.1} far={1000} />
                            <ambientLight intensity={0.6} />
                            <Earth activeTheme={activeTheme} cameraControlsRef={cameraControlsRef} focalOffset={focalOffset} />
                        </Canvas>
                    </Suspense>
                </div>

                {/* Night-only scrim so the theme index stays readable if the sphere
                    drifts underneath it */}
                <motion.div
                    aria-hidden
                    className="hidden lg:block absolute inset-y-0 left-0 w-[52%] z-[2] pointer-events-none"
                    style={{
                        opacity: nightOpacity,
                        background: `linear-gradient(to right, ${NIGHT} 35%, ${NIGHT}b3 65%, transparent)`,
                    }}
                />

                <p className={`absolute top-6 right-8 z-10 font-mono text-[10px] uppercase tracking-widest pointer-events-none transition-colors duration-700 ${night ? 'text-paper/40' : 'text-ink-faint'}`}>
                    Drag to rotate
                </p>

                {/* Theme index — click to survey a region */}
                <div className="relative z-10 mx-auto max-w-7xl px-8 sm:px-14 pt-[56vh] lg:pt-0 lg:h-full flex flex-col justify-center pb-16 lg:pb-0 pointer-events-none">
                    <div className="lg:max-w-md pointer-events-auto">
                        <p className={`font-mono text-[11px] uppercase tracking-widest mb-4 transition-colors duration-700 ${night ? 'text-paper/50' : 'text-ink-faint'}`}>
                            Research
                        </p>
                        <h2 className={`font-display font-light text-3xl md:text-5xl leading-[1.0] tracking-tight transition-colors duration-700 ${night ? 'text-paper' : 'text-ink'}`}>
                            Six ways we read a <span className="italic text-glacier">changing Himalaya</span>
                        </h2>

                        <ul className={`mt-8 border-t transition-colors duration-700 ${night ? 'border-white/15' : 'border-paper-deep'}`}>
                            {THEME_ORDER.map((theme, i) => {
                                const isActive = theme === activeTheme;
                                const meta = themeCoordinates[theme];
                                return (
                                    <li key={theme} className={`border-b transition-colors duration-700 ${night ? 'border-white/15' : 'border-paper-deep'}`}>
                                        <button
                                            onClick={() => setActiveTheme(isActive ? null : theme)}
                                            className="group w-full text-left py-3.5 flex items-baseline gap-4"
                                        >
                                            <span className={`font-mono text-xs tabular-nums transition-colors ${isActive ? 'text-glacier' : night ? 'text-paper/35 group-hover:text-paper/70' : 'text-ink-faint group-hover:text-ink'}`}>
                                                {String(i + 1).padStart(2, '0')}
                                            </span>
                                            <span className="flex-1">
                                                <span className={`block font-display text-lg leading-snug transition-colors ${isActive ? 'text-glacier' : night ? 'text-paper/80 group-hover:text-paper' : 'text-ink group-hover:text-glacier'}`}>
                                                    {theme}
                                                </span>
                                                <AnimatePresence initial={false}>
                                                    {isActive && (
                                                        <motion.span
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                                                            className="block overflow-hidden"
                                                        >
                                                            <span className={`block pt-2 text-sm leading-relaxed max-w-sm transition-colors duration-700 ${night ? 'text-paper/65' : 'text-ink-soft'}`}>
                                                                {meta.description}
                                                            </span>
                                                            <span className={`block pt-2 font-mono text-[10px] uppercase tracking-widest transition-colors duration-700 ${night ? 'text-paper/40' : 'text-ink-faint'}`}>
                                                                {meta.label} &middot; {meta.region}
                                                            </span>
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThemeJourney;
