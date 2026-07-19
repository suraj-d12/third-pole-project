import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';
import Scene, { FOV } from './Scene';
import { THEME_ORDER, themeCoordinates, THIRD_POLE, heroFraming } from './coordinates';

const ease = [0.16, 1, 0.3, 1];
const rise = {
    hidden: { opacity: 0, y: 26 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.1 + i * 0.12 } }),
};

// scroll progress past which the flight is complete and the data layers mount
const LOCK_AT = 0.72;
const UNLOCK_AT = 0.68;

// Globe anchored right on desktop, up on small screens (screen-space offset,
// mirrored by CameraControls' focal offset once locked).
const useAnchorOffset = () => {
    const [offset, setOffset] = useState([0, 0]);
    useEffect(() => {
        // Tuned for LOCK_DIST: keeps the Third Pole inside the right/upper
        // half of the frame instead of shoving it off-screen.
        const compute = () => setOffset(window.innerWidth >= 1024 ? [-0.46, 0] : [0, -0.35]);
        compute();
        window.addEventListener('resize', compute);
        return () => window.removeEventListener('resize', compute);
    }, []);
    return offset;
};

const coordsLabel = `${THIRD_POLE.lat.toFixed(2)}° N · ${THIRD_POLE.long.toFixed(2)}° E`;

// Light-page ink (the hero opens on white before the void takes over)
const L = {
    ink: '#1a2230', soft: '#414b5c', faint: '#767f90', accent: '#1f5f8b', page: '#f7f6f2',
};

const GlobeExperience = () => {
    const wrapRef = useRef(null);
    const [locked, setLocked] = useState(false);
    const [heroGone, setHeroGone] = useState(false);
    const [heroLight, setHeroLight] = useState(() =>
        typeof window === 'undefined' || window.scrollY < window.innerHeight * 0.15);
    const [activeTheme, setActiveTheme] = useState(null);
    const anchorOffset = useAnchorOffset();

    // The | belongs to the earth: it rises from the marker dot (which projects
    // at exact screen centre — the Third Pole faces the camera) up to land
    // beside the headline's "Pole" row. Measure the headline for its top end.
    const poleRef = useRef(null);
    const [lineGeom, setLineGeom] = useState(null); // { top, h } in px
    useEffect(() => {
        const measure = () => {
            const el = poleRef.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const { markerY, halfH } = heroFraming(window.innerWidth, window.innerHeight);
            const dotY = (0.5 - markerY / halfH / 2) * window.innerHeight;
            const top = rect.bottom - 8;
            setLineGeom({ top, h: Math.max(0, dotY - top - 4) });
        };
        measure();
        window.addEventListener('resize', measure);
        document.fonts?.ready?.then(measure);
        const t = setTimeout(measure, 500); // post-layout settle
        return () => { window.removeEventListener('resize', measure); clearTimeout(t); };
    }, []);

    const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end end'] });
    useMotionValueEvent(scrollYProgress, 'change', (p) => {
        setHeroGone(p > 0.16);
        setHeroLight(p < 0.06);
        setLocked((prev) => {
            const next = prev ? p > UNLOCK_AT : p > LOCK_AT;
            if (prev && !next) setActiveTheme(null);
            return next;
        });
    });
    // the fixed nav flips its ink while the hero is still light
    useEffect(() => {
        window.dispatchEvent(new CustomEvent('hero-light', { detail: heroLight }));
    }, [heroLight]);
    useEffect(() => () => window.dispatchEvent(new CustomEvent('hero-light', { detail: false })), []);

    const heroOpacity = useTransform(scrollYProgress, [0.02, 0.13], [1, 0]);
    const heroShift = useTransform(scrollYProgress, [0.02, 0.13], [0, -60]);
    const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
    // Night doesn't fade in — it RADIATES from the beacon's anchor point on
    // the globe, a feathered black disc growing until it owns the frame.
    const nightR = useTransform(scrollYProgress, [0.02, 0.18], [0, 175]);
    const nightEdge = useTransform(nightR, (v) => v + 12);
    const dotY = lineGeom ? `${Math.round(lineGeom.top + lineGeom.h + 4)}px` : '86%';
    const nightMask = useMotionTemplate`radial-gradient(circle at 50% ${dotY}, #000000 ${nightR}vmax, rgba(0,0,0,0) ${nightEdge}vmax)`;

    // Click-to-descend plays the whole flight: a slow scroll tween scrubs the
    // globe through its full revolution + zoom before arriving at the region.
    // Any manual scroll input aborts the tween and hands control back.
    const descend = () => {
        const wrap = wrapRef.current;
        if (!wrap) return;
        const start = window.scrollY;
        const sectionTop = start + wrap.getBoundingClientRect().top;
        const target = sectionTop + (wrap.offsetHeight - window.innerHeight) * 0.8;
        const dur = 2800;
        const t0 = performance.now();
        let cancelled = false;
        const cancel = () => { cancelled = true; };
        window.addEventListener('wheel', cancel, { passive: true, once: true });
        window.addEventListener('touchstart', cancel, { passive: true, once: true });
        const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const step = (now) => {
            if (cancelled) return;
            const t = Math.min((now - t0) / dur, 1);
            window.scrollTo({ top: start + (target - start) * easeInOut(t), behavior: 'instant' });
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    return (
        <section ref={wrapRef} className="relative h-[260vh] bg-paper">
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* white page, with night radiating out of the beacon's root */}
                <div aria-hidden className="absolute inset-0" style={{ backgroundColor: L.page }} />
                <motion.div aria-hidden className="absolute inset-0" style={{ backgroundImage: nightMask }} />

                {/* the one persistent canvas (transparent — backdrop shows through) */}
                <div className="absolute inset-0">
                    <Canvas gl={{ antialias: true, alpha: true }} dpr={[1, 1.75]} style={{ touchAction: 'pan-y' }}>
                        <PerspectiveCamera makeDefault position={[0, 0, 3.4]} fov={FOV} near={0.1} far={100} />
                        <Scene progress={scrollYProgress} locked={locked} activeTheme={activeTheme} anchorOffset={anchorOffset} />
                    </Canvas>
                </div>

                {/* ── HERO — left-set on the white page, beacon anchored to the o of Pole ── */}
                <motion.div
                    style={{ opacity: heroOpacity, y: heroShift }}
                    className={`absolute inset-x-0 top-0 z-10 pointer-events-none ${heroGone ? 'invisible' : ''}`}
                >
                    <div className="mx-auto max-w-7xl px-8 sm:px-14 pt-[16vh] flex flex-col items-start">
                        <motion.p
                            variants={rise} initial="hidden" animate="show"
                            className="flex items-center gap-4 mb-8 font-mono text-[11px] uppercase tracking-widest"
                            style={{ color: L.faint }}
                        >
                            <span className="h-px w-10" style={{ backgroundColor: L.faint }} />
                            The Hindu Kush Himalaya &mdash; Earth&rsquo;s &ldquo;Third Pole&rdquo;
                        </motion.p>

                        <h1 className="font-display font-light leading-[0.94] tracking-[-0.02em] text-[clamp(3rem,9vw,7.5rem)]" style={{ color: L.ink }}>
                            <motion.span custom={0} variants={rise} initial="hidden" animate="show" className="block">
                                Decoding the
                            </motion.span>
                            <motion.span ref={poleRef} custom={1} variants={rise} initial="hidden" animate="show" className="block italic" style={{ color: L.accent }}>
                                Third&nbsp;Pole
                            </motion.span>
                        </h1>

                        <motion.p
                            custom={2} variants={rise} initial="hidden" animate="show"
                            className="mt-8 text-lg md:text-xl leading-relaxed max-w-md"
                            style={{ color: L.soft }}
                        >
                            We build AI weather forecasting and early-warning systems for the
                            Himalaya, where 1.9 billion people depend on water from rapidly
                            melting glaciers.
                        </motion.p>

                        <motion.div
                            custom={3} variants={rise} initial="hidden" animate="show"
                            className={`mt-9 flex flex-wrap gap-3 ${heroGone ? '' : 'pointer-events-auto'}`}
                        >
                            <button
                                onClick={descend}
                                className="group inline-flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-widest transition-colors bg-[#1a2230] text-[#f7f6f2] hover:bg-[#1f5f8b]"
                            >
                                Descend to the region
                                <span className="transition-transform group-hover:translate-y-0.5">&darr;</span>
                            </button>
                            <Link
                                to="/data"
                                className="inline-flex items-center gap-2 px-6 py-3 border font-mono text-xs uppercase tracking-widest transition-colors border-[#1a2230] text-[#1a2230] hover:bg-[#1a2230] hover:text-[#f7f6f2]"
                            >
                                View the data
                            </Link>
                        </motion.div>

                        <motion.p
                            custom={4} variants={rise} initial="hidden" animate="show"
                            className="mt-8 font-mono text-[10px] uppercase tracking-widest"
                            style={{ color: L.faint }}
                        >
                            {coordsLabel} &middot; Sagarmatha &mdash; <span style={{ color: L.accent }}>the beacon takes you there</span>
                        </motion.p>
                    </div>

                    {/* the | — rooted on the glowing surface dot at screen centre,
                        rising to land beside "Pole"; beacon dot crowns its top */}
                    {lineGeom && (
                        <motion.span
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.9 }}
                            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none"
                            style={{ top: lineGeom.top, height: lineGeom.h }}
                        >
                            <button
                                onClick={descend}
                                aria-label="Descend to the Third Pole region"
                                className={`group relative grid place-items-center w-10 h-10 -m-3 shrink-0 cursor-pointer ${heroGone ? '' : 'pointer-events-auto'}`}
                            >
                                {/* emitting signal — staggered radar rings */}
                                <span className="beacon-ring" />
                                <span className="beacon-ring" style={{ animationDelay: '0.8s' }} />
                                <span className="beacon-ring" style={{ animationDelay: '1.6s' }} />
                                <span
                                    className="relative w-3.5 h-3.5 rounded-full beacon transition-transform duration-300 group-hover:scale-125"
                                    style={{ backgroundColor: L.accent }}
                                />
                            </button>
                            <span className="beacon-line flex-1 mt-1.5" />
                        </motion.span>
                    )}
                </motion.div>

                {/* scroll hint */}
                <motion.p
                    style={{ opacity: hintOpacity }}
                    className="absolute bottom-8 right-8 sm:right-14 z-10 font-mono text-[10px] uppercase tracking-widest text-ink-faint pointer-events-none"
                >
                    Scroll &mdash; descend to the Himalaya
                </motion.p>

                {/* ── LOCKED STATE — research index + data layers ── */}
                <AnimatePresence>
                    {locked && (
                        <motion.div
                            key="panel"
                            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
                            transition={{ duration: 0.7, ease }}
                            className="absolute inset-0 z-10 pointer-events-none"
                        >
                            <p className="absolute top-20 right-8 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                                Drag to rotate
                            </p>

                            <div className="mx-auto max-w-7xl px-8 sm:px-14 h-full flex flex-col justify-end lg:justify-center pb-8 lg:pb-0">
                                <div className="lg:max-w-md pointer-events-auto max-h-[56vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
                                    <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-4">
                                        Research &middot; {coordsLabel}
                                    </p>
                                    <h2 className="font-display font-light text-3xl md:text-5xl leading-[1.0] tracking-tight text-ink">
                                        Six ways we read a <span className="italic text-glacier">changing Himalaya</span>
                                    </h2>

                                    {!activeTheme && (
                                        <p className="mt-4 text-sm leading-relaxed text-ink-soft max-w-sm">
                                            46,000 glaciers feeding the rivers of 1.9 billion people.
                                            Select a theme to project its data layer onto the region.
                                        </p>
                                    )}

                                    <ul className="mt-6 border-t border-paper-deep">
                                        {THEME_ORDER.map((theme, i) => {
                                            const isActive = theme === activeTheme;
                                            const meta = themeCoordinates[theme];
                                            return (
                                                <li key={theme} className="border-b border-paper-deep">
                                                    <button
                                                        onClick={() => setActiveTheme(isActive ? null : theme)}
                                                        className="group w-full text-left py-3 flex items-baseline gap-4"
                                                    >
                                                        <span className={`font-mono text-xs tabular-nums transition-colors ${isActive ? 'text-glacier' : 'text-ink-faint group-hover:text-ink'}`}>
                                                            {String(i + 1).padStart(2, '0')}
                                                        </span>
                                                        <span className="flex-1">
                                                            <span className={`block font-display text-lg leading-snug transition-colors ${isActive ? 'text-glacier' : 'text-ink group-hover:text-glacier-light'}`}>
                                                                {theme}
                                                            </span>
                                                            <AnimatePresence initial={false}>
                                                                {isActive && (
                                                                    <motion.span
                                                                        initial={{ height: 0, opacity: 0 }}
                                                                        animate={{ height: 'auto', opacity: 1 }}
                                                                        exit={{ height: 0, opacity: 0 }}
                                                                        transition={{ duration: 0.45, ease }}
                                                                        className="block overflow-hidden"
                                                                    >
                                                                        <span className="block pt-2 text-sm leading-relaxed max-w-sm text-ink-soft">
                                                                            {meta.description}
                                                                        </span>
                                                                        <span className="block pt-2 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
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
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* nav / CTA target: lands mid-way through the locked dwell */}
            <div id="research" aria-hidden className="absolute left-0 top-[56%]" />
        </section>
    );
};

export default GlobeExperience;
