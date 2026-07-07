import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useTransform } from 'framer-motion';
import Earth, { THEME_ORDER, themeCoordinates } from './Earth';

const N = THEME_ORDER.length;
const ease = [0.16, 1, 0.3, 1];

const LoadingFallback = () => (
    <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
            <div className="w-9 h-9 border border-ink border-t-glacier rounded-full animate-spin mx-auto mb-3" />
            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">Plotting terrain&hellip;</p>
        </div>
    </div>
);

const ThemeJourney = () => {
    const wrapRef = useRef(null);
    const [index, setIndex] = useState(0);
    const cameraControlsRef = useRef();

    const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
    const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

    useMotionValueEvent(scrollYProgress, 'change', (p) => {
        const i = Math.min(N - 1, Math.max(0, Math.floor(p * N)));
        if (i !== index) setIndex(i);
    });

    const activeTheme = THEME_ORDER[index];
    const meta = themeCoordinates[activeTheme];

    const skipTo = (i) => {
        const el = wrapRef.current;
        if (!el) return;
        const top = el.offsetTop + ((i + 0.5) / N) * (el.offsetHeight - window.innerHeight);
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <section id="themes" ref={wrapRef} style={{ height: `${N * 100}vh` }} className="relative">
            {/* Pinned stage */}
            <div className="sticky top-0 h-screen overflow-hidden flex items-center">
                {/* scroll progress bar */}
                <motion.div style={{ scaleX: progressScale }}
                    className="absolute top-0 left-0 right-0 h-px bg-glacier origin-left z-20" />

                <div className="mx-auto max-w-7xl w-full px-8 sm:px-14 grid lg:grid-cols-[auto_1fr_1.15fr] gap-6 lg:gap-10 items-center">
                    {/* Skip rail */}
                    <nav className="hidden lg:flex flex-col gap-1 pr-2">
                        {THEME_ORDER.map((t, i) => {
                            const on = i === index;
                            return (
                                <button key={t} onClick={() => skipTo(i)}
                                    className="group flex items-center gap-3 py-1.5 text-left">
                                    <span className={`font-mono text-[10px] tabular-nums transition-colors ${on ? 'text-glacier' : 'text-ink-faint group-hover:text-ink'}`}>
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span className={`h-px transition-all duration-500 ${on ? 'w-8 bg-glacier' : 'w-4 bg-paper-deep group-hover:w-6 group-hover:bg-ink-faint'}`} />
                                </button>
                            );
                        })}
                    </nav>

                    {/* Copy panel */}
                    <div className="relative order-2 lg:order-none">
                        <div className="flex items-center gap-3 mb-6 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                            <span className="text-glacier">§ 01</span>
                            <span className="h-px w-6 bg-ink-faint" />
                            <span>The Living Atlas</span>
                        </div>
                        <div className="min-h-[320px]">
                            <AnimatePresence mode="wait">
                                <motion.div key={index}
                                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }}
                                    transition={{ duration: 0.6, ease }}>
                                    <span className="font-display text-6xl text-glacier/25 leading-none">{String(index + 1).padStart(2, '0')}</span>
                                    <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mt-4 mb-2">{meta.region}</p>
                                    <h3 className="font-display font-light text-ink text-4xl lg:text-5xl leading-[1.02] tracking-tight max-w-md">
                                        {activeTheme}
                                    </h3>
                                    <div className="h-px w-12 bg-glacier my-6" />
                                    <p className="text-ink-soft text-lg leading-relaxed max-w-md">{meta.description}</p>
                                    <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                                        {meta.fig} &mdash; {meta.label}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* mobile dot rail */}
                        <div className="flex lg:hidden gap-1.5 mt-8">
                            {THEME_ORDER.map((t, i) => (
                                <button key={t} onClick={() => skipTo(i)}
                                    className={`h-1 rounded-full transition-all ${i === index ? 'w-6 bg-glacier' : 'w-2 bg-paper-deep'}`} />
                            ))}
                        </div>
                    </div>

                    {/* Globe */}
                    <div className="relative order-1 lg:order-none">
                        <div className="relative aspect-square w-full max-w-[600px] mx-auto">
                            <div className="absolute inset-0 rounded-full"
                                style={{ background: 'radial-gradient(circle at 50% 45%, rgba(31,95,139,0.12), rgba(31,95,139,0) 62%)' }} />
                            <div className="pointer-events-none absolute inset-[5%] rounded-full border border-paper-deep" />
                            <div className="pointer-events-none absolute inset-0 rounded-full border border-glacier/20" />
                            <Suspense fallback={<LoadingFallback />}>
                                <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 2]} style={{ background: 'transparent' }}>
                                    <PerspectiveCamera makeDefault position={[0, 0, 3.6]} fov={42} near={0.1} far={1000} />
                                    <ambientLight intensity={0.6} />
                                    <Earth activeTheme={activeTheme} cameraControlsRef={cameraControlsRef} showPopup={false} />
                                </Canvas>
                            </Suspense>
                            <div className="absolute -bottom-8 inset-x-0 flex justify-between font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                                <span>{meta.fig} &mdash; {meta.label}</span>
                                <span>Scroll to survey</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ThemeJourney;
