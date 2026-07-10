import React from 'react';
import DisasterImpactDashboard from '../components/DisasterImpactDashboard';
import ClimateDisasterVisualizations from '../components/ClimateDisasterVisualizations';
import IndiaTemperatureChart from '../components/IndiaTemperatureChart';
import PrecipitationChart from '../components/PrecipitationChart';
import LandslideChart from '../components/LandslideChart';
import GlacierChart from '../components/GlacierChart';

// Dark panel — mounts a legacy dark-themed chart on the paper page.
// (These charts get the light-theme treatment in a later pass.)
const Panel = ({ title, children, className = '' }) => (
    <figure className={`bg-dark-900 rounded-sm shadow-plate overflow-hidden ${className}`}>
        <figcaption className="px-5 py-3 border-b border-white/10">
            <span className="text-sm font-medium text-gray-200">{title}</span>
        </figcaption>
        <div className="p-5">{children}</div>
    </figure>
);

const DataPage = () => (
    <main className="pt-24 pb-24 min-h-screen">
        <div className="mx-auto max-w-7xl px-8 sm:px-14">
            {/* Page header */}
            <header className="mb-14 border-b border-paper-deep pb-8">
                <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint mb-5">
                    Impact data &middot; 1980&ndash;2024
                </p>
                <h1 className="font-display font-light text-ink text-5xl md:text-7xl leading-[0.95] tracking-tight">
                    The <span className="italic text-glacier">data</span>
                </h1>
                <p className="mt-5 max-w-xl text-ink-soft text-lg leading-relaxed">
                    Lives lost, economic damage and the physical signals&mdash;temperature,
                    precipitation and glacier extent&mdash;behind the Third Pole&rsquo;s changing climate.
                </p>
            </header>

            {/* Primary dashboard */}
            <Panel title="Disaster impact, lives and cost" className="mb-10">
                <DisasterImpactDashboard />
            </Panel>

            {/* Metric grid */}
            <div className="grid md:grid-cols-2 gap-10 mb-10">
                <Panel title="Annual temperature"><IndiaTemperatureChart /></Panel>
                <Panel title="Precipitation"><PrecipitationChart /></Panel>
                <Panel title="Landslide impact"><LandslideChart /></Panel>
                <Panel title="Glacier retreat"><GlacierChart /></Panel>
            </div>

            <Panel title="Climate disaster overview">
                <ClimateDisasterVisualizations />
            </Panel>
        </div>
    </main>
);

export default DataPage;
