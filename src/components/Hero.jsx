import React, { useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ease = [0.16, 1, 0.3, 1];
const rise = {
    hidden: { opacity: 0, y: 26 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.1 + i * 0.12 } }),
};

// Mosaic reveal: the hero is tiled into paper cells; the spectral footage
// underneath shows through the cells nearest the cursor.
const COLS = 10;
const ROWS = 6;

const Hero = () => {
    const frameRef = useRef(null);
    const [hover, setHover] = useState(null); // [col, row] under the cursor

    const cells = useMemo(
        () => Array.from({ length: COLS * ROWS }, (_, i) => [i % COLS, Math.floor(i / COLS)]),
        []
    );

    const onMove = (e) => {
        const rect = frameRef.current?.getBoundingClientRect();
        if (!rect) return;
        const c = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
        const r = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS);
        setHover((prev) => (prev && prev[0] === c && prev[1] === r ? prev : [c, r]));
    };

    return (
        <header
            ref={frameRef}
            onMouseMove={onMove}
            onMouseLeave={() => setHover(null)}
            className="relative min-h-[100svh] overflow-hidden bg-paper"
        >
            {/* Spectral footage — only visible where the mosaic opens */}
            <video
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                autoPlay muted loop playsInline preload="auto"
            >
                <source src={import.meta.env.BASE_URL + 'temporal.mp4'} type="video/mp4" />
            </video>

            {/* Paper mosaic cover */}
            <div
                aria-hidden
                className="absolute inset-0 grid pointer-events-none"
                style={{
                    gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                    gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                }}
            >
                {cells.map(([c, r]) => {
                    const d = hover ? Math.hypot(c - hover[0], r - hover[1]) : Infinity;
                    const opacity = hover ? Math.min(1, Math.max(0, (d - 0.6) / 2.4)) : 1;
                    return (
                        <div
                            key={`${c}-${r}`}
                            className="bg-paper transition-opacity duration-500"
                            style={{ opacity, transitionDelay: `${Number.isFinite(d) ? Math.min(d * 40, 220) : 0}ms` }}
                        />
                    );
                })}
            </div>

            {/* Contour texture above the mosaic */}
            <div className="pointer-events-none absolute inset-0 topo-lines" aria-hidden />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl px-8 sm:px-14 min-h-[100svh] flex flex-col justify-center pt-16">
                <motion.p
                    variants={rise} initial="hidden" animate="show"
                    className="flex items-center gap-4 mb-8 font-mono text-[11px] uppercase tracking-widest text-ink-faint"
                >
                    <span className="h-px w-10 bg-ink-faint" />
                    The Hindu Kush Himalaya &mdash; Earth&rsquo;s &ldquo;Third Pole&rdquo;
                </motion.p>

                <h1 className="font-display font-light text-ink leading-[0.94] tracking-[-0.02em] text-[clamp(3rem,10vw,8.5rem)]">
                    <motion.span custom={0} variants={rise} initial="hidden" animate="show" className="block">
                        Decoding the
                    </motion.span>
                    <motion.span custom={1} variants={rise} initial="hidden" animate="show" className="block italic text-glacier">
                        Third&nbsp;Pole
                    </motion.span>
                </h1>

                <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end max-w-4xl">
                    <motion.p
                        custom={2} variants={rise} initial="hidden" animate="show"
                        className="text-lg md:text-xl text-ink-soft leading-relaxed max-w-md"
                    >
                        We build AI weather forecasting and early-warning systems for the
                        Himalaya, where 1.9 billion people depend on water from rapidly
                        melting glaciers.
                    </motion.p>

                    <motion.div custom={3} variants={rise} initial="hidden" animate="show" className="flex flex-wrap gap-3">
                        <a
                            href="#research"
                            className="group inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-widest hover:bg-glacier transition-colors"
                        >
                            Explore the research
                            <span className="transition-transform group-hover:translate-y-0.5">&darr;</span>
                        </a>
                        <Link
                            to="/data"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-ink text-ink font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
                        >
                            View the data
                        </Link>
                    </motion.div>
                </div>

                <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 1 }}
                    className="absolute bottom-10 right-8 sm:right-14 font-mono text-[10px] uppercase tracking-widest text-ink-faint"
                >
                    Move to reveal the satellite record
                </motion.p>
            </div>
        </header>
    );
};

export default Hero;
