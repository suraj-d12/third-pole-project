import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ThemeJourney from '../components/ResearchGlobe/ThemeJourney';

const ease = [0.16, 1, 0.3, 1];

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

            {/* Research themes with the globe */}
            <ThemeJourney />

            {/* About */}
            <section id="about" className="relative border-t border-paper-deep bg-paper-dim scroll-mt-16">
                <div className="mx-auto max-w-7xl px-8 sm:px-14 py-24 lg:py-32">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-6">About the project</p>
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
                                    climate signals into actionable response for the region&rsquo;s most
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

                        <div className="lg:border-l lg:border-paper-deep lg:pl-12">
                            <p className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-6">At a glance</p>
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

            {/* Where next */}
            <section className="border-t border-paper-deep">
                <div className="mx-auto max-w-7xl px-8 sm:px-14 py-20 grid md:grid-cols-2 gap-px bg-paper-deep">
                    <Link to="/data" className="group bg-paper hover:bg-paper-dim transition-colors p-10">
                        <h3 className="font-display text-3xl text-ink group-hover:text-glacier transition-colors">
                            Explore the data &rarr;
                        </h3>
                        <p className="mt-2 text-ink-soft">Disaster losses, temperature, precipitation and glacier retreat, 1980&ndash;2024.</p>
                    </Link>
                    <Link to="/blog" className="group bg-paper hover:bg-paper-dim transition-colors p-10">
                        <h3 className="font-display text-3xl text-ink group-hover:text-glacier transition-colors">
                            Read our writing &rarr;
                        </h3>
                        <p className="mt-2 text-ink-soft">Notes on climate, water and AI from the project team.</p>
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
