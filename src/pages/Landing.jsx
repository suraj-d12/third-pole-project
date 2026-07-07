import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ThemeJourney from '../components/ResearchGlobe/ThemeJourney';

const ease = [0.16, 1, 0.3, 1];

const SectionLabel = ({ index, children }) => (
    <div className="flex items-center gap-4 mb-6 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
        <span className="text-glacier">{index}</span>
        <span className="h-px w-8 bg-ink-faint" />
        <span>{children}</span>
    </div>
);

const stats = [
    { k: '46,000', l: 'Himalayan glaciers surveyed' },
    { k: '1.9 bn', l: 'People fed by its rivers' },
    { k: '−0.4 m', l: 'Mean annual ice loss' },
    { k: '24 / 7', l: 'Early-warning monitoring' },
];

const Landing = () => {
    return (
        <main>
            <Hero />

            {/* ── Scroll-driven theme journey ── */}
            <ThemeJourney />

            {/* ── Mission / about strip ── */}
            <section id="mission" className="relative border-t border-paper-deep bg-paper-dim scroll-mt-16">
                <div className="mx-auto max-w-7xl px-8 sm:px-14 py-24 lg:py-32">
                    <SectionLabel index="§ 02">The Mission</SectionLabel>
                    <div className="grid lg:grid-cols-[1.3fr_1fr] gap-14 lg:gap-24 items-start">
                        <motion.div
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, ease }}
                        >
                            <h2 className="font-display font-light text-ink text-3xl md:text-5xl leading-[1.05] tracking-tight max-w-3xl">
                                The Third Pole holds more ice than anywhere outside the
                                Arctic and Antarctic&mdash;and it is <span className="italic text-glacier">melting fastest</span>.
                            </h2>
                            <div className="mt-8 space-y-5 text-ink-soft text-lg leading-relaxed max-w-2xl">
                                <p>
                                    We pair deep learning with numerical weather prediction to extend
                                    forecast horizons and sharpen resolution across the Himalaya&mdash;serving
                                    governments, relief agencies and the communities living downstream.
                                </p>
                                <p>
                                    Using the OpenBuildings dataset, our early-warning models translate
                                    climate signals into actionable response for the region's most
                                    disaster-exposed districts.
                                </p>
                            </div>
                            <blockquote className="mt-10 pl-6 border-l-2 border-glacier">
                                <p className="font-display italic text-xl text-ink leading-relaxed max-w-xl">
                                    &ldquo;Accurate, timely intelligence on a changing cryosphere&mdash;so
                                    communities and policymakers can decide before the water arrives.&rdquo;
                                </p>
                            </blockquote>
                        </motion.div>

                        {/* Field readings */}
                        <div className="lg:border-l lg:border-paper-deep lg:pl-12">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-6">
                                Field Readings
                            </p>
                            <dl className="divide-y divide-paper-deep">
                                {stats.map((s) => (
                                    <div key={s.l} className="py-5">
                                        <dt className="font-display text-4xl text-ink tabular-nums">{s.k}</dt>
                                        <dd className="mt-1 text-sm text-ink-soft">{s.l}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Directory CTA ── */}
            <section className="border-t border-paper-deep">
                <div className="mx-auto max-w-7xl px-8 sm:px-14 py-20 grid md:grid-cols-2 gap-px bg-paper-deep">
                    <Link to="/data" className="group bg-paper hover:bg-paper-dim transition-colors p-10">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">Plate II</span>
                        <h3 className="mt-3 font-display text-3xl text-ink group-hover:text-glacier transition-colors">
                            Impact Data &rarr;
                        </h3>
                        <p className="mt-2 text-ink-soft">Disaster losses, temperature, precipitation and glacier retreat.</p>
                    </Link>
                    <Link to="/blog" className="group bg-paper hover:bg-paper-dim transition-colors p-10">
                        <span className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">Plate III</span>
                        <h3 className="mt-3 font-display text-3xl text-ink group-hover:text-glacier transition-colors">
                            Field Notes &rarr;
                        </h3>
                        <p className="mt-2 text-ink-soft">Research writing from the roof of the world.</p>
                    </Link>
                </div>
            </section>

            <footer className="border-t border-paper-deep">
                <div className="mx-auto max-w-7xl px-8 sm:px-14 py-10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                    <span>The Third Pole Project</span>
                    <span>Himalayan Water Project &middot; {new Date().getFullYear()}</span>
                </div>
            </footer>
        </main>
    );
};

export default Landing;
