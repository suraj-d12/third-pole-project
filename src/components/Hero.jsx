import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ease = [0.16, 1, 0.3, 1];
const rise = {
    hidden: { opacity: 0, y: 26 },
    show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease, delay: 0.1 + i * 0.12 } }),
};

const Hero = () => {
    return (
        <header className="relative min-h-[100svh] overflow-hidden topo-lines">
            {/* Cartographic frame */}
            <div className="pointer-events-none absolute inset-5 sm:inset-8 border border-paper-deep" aria-hidden />
            <FrameTicks />

            <div className="relative mx-auto max-w-7xl px-8 sm:px-14 min-h-[100svh] flex flex-col justify-center pt-16">
                {/* Eyebrow / coordinates */}
                <motion.div
                    variants={rise} initial="hidden" animate="show"
                    className="flex items-center gap-4 mb-8 font-mono text-[11px] uppercase tracking-widest text-ink-faint"
                >
                    <span className="h-px w-10 bg-ink-faint" />
                    <span>27&deg;59&prime;N&nbsp;&nbsp;86&deg;55&prime;E</span>
                    <span className="text-glacier">&bull;</span>
                    <span>Elev. 8,849 m</span>
                </motion.div>

                {/* Display headline */}
                <h1 className="font-display font-light text-ink leading-[0.94] tracking-[-0.02em] text-[clamp(3rem,10vw,8.5rem)]">
                    <motion.span custom={0} variants={rise} initial="hidden" animate="show" className="block">
                        Decoding the
                    </motion.span>
                    <motion.span custom={1} variants={rise} initial="hidden" animate="show" className="block italic text-glacier">
                        Third&nbsp;Pole
                    </motion.span>
                </h1>

                {/* Lede + actions */}
                <div className="mt-10 grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-end max-w-4xl">
                    <motion.p
                        custom={2} variants={rise} initial="hidden" animate="show"
                        className="text-lg md:text-xl text-ink-soft leading-relaxed max-w-md"
                    >
                        A living atlas of the Himalaya&mdash;charting glaciers, extreme weather
                        and vanishing water with AI-driven forecasting and early warning.
                    </motion.p>

                    <motion.div custom={3} variants={rise} initial="hidden" animate="show" className="flex flex-wrap gap-3">
                        <a
                            href="#themes"
                            className="group inline-flex items-center gap-2 px-6 py-3 bg-ink text-paper font-mono text-xs uppercase tracking-widest hover:bg-glacier transition-colors"
                        >
                            Enter the Atlas
                            <span className="transition-transform group-hover:translate-y-0.5">&darr;</span>
                        </a>
                        <Link
                            to="/data"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-ink text-ink font-mono text-xs uppercase tracking-widest hover:bg-ink hover:text-paper transition-colors"
                        >
                            View Data
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scale bar + scroll cue */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 1 }}
                className="absolute bottom-10 left-8 sm:left-14 right-8 sm:right-14 flex items-end justify-between font-mono text-[10px] uppercase tracking-widest text-ink-faint"
            >
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-end gap-0.5 h-2.5">
                        {[0, 1, 2, 3].map((i) => (
                            <span key={i} className={`w-8 border-b border-ink-faint ${i % 2 === 0 ? 'h-2.5 border-x' : 'h-1.5'}`} />
                        ))}
                    </div>
                    <span>0&nbsp;&mdash;&nbsp;500 km</span>
                </div>
                <span className="hidden sm:block">Fig. 01 &mdash; Regional Overview</span>
            </motion.div>
        </header>
    );
};

// Corner registration ticks — printed-map detail
const FrameTicks = () => (
    <div className="pointer-events-none absolute inset-5 sm:inset-8" aria-hidden>
        {[
            'top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0',
        ].map((pos) => (
            <div key={pos} className={`absolute ${pos} w-4 h-4`}>
                <span className="absolute inset-0 border-glacier"
                    style={{
                        borderTopWidth: pos.includes('top') ? 1 : 0,
                        borderBottomWidth: pos.includes('bottom') ? 1 : 0,
                        borderLeftWidth: pos.includes('left') ? 1 : 0,
                        borderRightWidth: pos.includes('right') ? 1 : 0,
                    }}
                />
            </div>
        ))}
    </div>
);

export default Hero;
