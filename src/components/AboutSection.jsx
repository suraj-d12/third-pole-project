import React from 'react';
import GlassCard from './ui/GlassCard';

const AboutSection = () => {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold font-heading text-white">
                        About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">The Third Pole Project</span>
                    </h2>

                    <div className="text-gray-300 space-y-4 leading-relaxed text-lg">
                        <p>
                            The Third Pole Project is an AI-powered weather forecasting and early disaster warning system that provides highly accurate predictions for governments, militaries, enterprises, and citizens worldwide. Using advanced deep learning techniques combined with numerical weather prediction, The Third Pole Project improves forecast horizons and resolution compared to conventional meteorology.
                        </p>
                        <p>
                            Our research focuses on weather across the Indian subcontinent, including extreme weather events, climate patterns, and their impacts on various sectors. Through our work, we aim to contribute to a better understanding of this crucial region and inform policy decisions for sustainable development and disaster mitigation.
                        </p>
                        <p>
                            Using the OpenBuildings dataset we aim to significantly enhance humanitarian response in the disaster prone areas.
                        </p>
                    </div>

                    <GlassCard className="p-6 mt-8 border-l-4 border-primary">
                        <p className="text-white font-medium italic">
                            "Our mission is to provide accurate and timely information about climate changes in the Third Pole region, helping communities and policymakers make informed decisions."
                        </p>
                    </GlassCard>
                </div>

                {/* Visual/Stats Side */}
                <div className="grid grid-cols-2 gap-4">
                    <GlassCard className="p-6 flex flex-col items-center justify-center text-center h-40">
                        <span className="text-4xl font-bold text-primary mb-2">AI</span>
                        <span className="text-sm text-gray-400">Powered Forecasting</span>
                    </GlassCard>
                    <GlassCard className="p-6 flex flex-col items-center justify-center text-center h-40 mt-8">
                        <span className="text-4xl font-bold text-secondary mb-2">100%</span>
                        <span className="text-sm text-gray-400">Data Driven</span>
                    </GlassCard>
                    <GlassCard className="p-6 flex flex-col items-center justify-center text-center h-40 -mt-8">
                        <span className="text-4xl font-bold text-accent mb-2">24/7</span>
                        <span className="text-sm text-gray-400">Monitoring</span>
                    </GlassCard>
                    <GlassCard className="p-6 flex flex-col items-center justify-center text-center h-40">
                        <span className="text-4xl font-bold text-white mb-2">Global</span>
                        <span className="text-sm text-gray-400">Impact</span>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
