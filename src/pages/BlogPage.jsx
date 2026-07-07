import React from 'react';
import { motion } from 'framer-motion';

const notes = [
    {
        title: 'Tackling Climate and Water Challenges in the Himalayas using AI',
        source: 'Himalayan Water Project',
        date: '2024',
        tag: 'Method',
        link: 'https://www.himalayanwaterproject.org/post/tackling-climate-and-water-challenges-in-the-himalayas-using-ai',
    },
];

const BlogPage = () => (
    <main className="pt-24 pb-24 min-h-screen">
        <div className="mx-auto max-w-4xl px-8 sm:px-14">
            <header className="mb-14 border-b border-paper-deep pb-8">
                <div className="flex items-center gap-4 mb-5 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                    <span className="text-glacier">Plate III</span>
                    <span className="h-px w-8 bg-ink-faint" />
                    <span>Field Notes</span>
                </div>
                <h1 className="font-display font-light text-ink text-5xl md:text-7xl leading-[0.95] tracking-tight">
                    From the <span className="italic text-glacier">field</span>
                </h1>
                <p className="mt-5 max-w-xl text-ink-soft text-lg leading-relaxed">
                    Writing and dispatches on climate, water and AI across the Third Pole.
                </p>
            </header>

            <ul className="border-t border-paper-deep">
                {notes.map((n, i) => (
                    <motion.li
                        key={n.title}
                        initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.08 }}
                        className="border-b border-paper-deep"
                    >
                        <a href={n.link} target="_blank" rel="noopener noreferrer"
                            className="group block py-8">
                            <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-ink-faint mb-3">
                                <span className="px-2 py-0.5 border border-paper-deep text-glacier">{n.tag}</span>
                                <span>{n.source}</span>
                                <span>&middot;</span>
                                <span>{n.date}</span>
                            </div>
                            <h2 className="font-display text-2xl md:text-3xl text-ink leading-snug group-hover:text-glacier transition-colors max-w-2xl">
                                {n.title}
                            </h2>
                            <span className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink-soft group-hover:text-glacier transition-colors">
                                Read dispatch <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                            </span>
                        </a>
                    </motion.li>
                ))}
            </ul>
        </div>
    </main>
);

export default BlogPage;
