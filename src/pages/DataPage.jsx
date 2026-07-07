import React from 'react';
import DisasterImpactDashboard from '../components/DisasterImpactDashboard';
import ClimateDisasterVisualizations from '../components/ClimateDisasterVisualizations';
import IndiaTemperatureChart from '../components/IndiaTemperatureChart';
import PrecipitationChart from '../components/PrecipitationChart';
import LandslideChart from '../components/LandslideChart';
import GlacierChart from '../components/GlacierChart';

// Dark "plate" — mounts a legacy dark-themed chart on the paper page.
// (These charts get the Frozen Cartography treatment in Pass 2.)
const Plate = ({ label, title, children, className = '' }) => (
    <figure className={`bg-dark-900 rounded-sm shadow-plate overflow-hidden ${className}`}>
        <figcaption className="flex items-center justify-between px-5 py-3 border-b border-white/10">
            <span className="font-mono text-[10px] uppercase tracking-widest text-secondary">{label}</span>
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
                <div className="flex items-center gap-4 mb-5 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                    <span className="text-glacier">Plate II</span>
                    <span className="h-px w-8 bg-ink-faint" />
                    <span>Impact Data &middot; 1980&ndash;2024</span>
                </div>
                <h1 className="font-display font-light text-ink text-5xl md:text-7xl leading-[0.95] tracking-tight">
                    Reading the <span className="italic text-glacier">record</span>
                </h1>
                <p className="mt-5 max-w-xl text-ink-soft text-lg leading-relaxed">
                    Lives lost, economic damage and the physical signals&mdash;temperature,
                    precipitation and glacier extent&mdash;behind the Third Pole&rsquo;s changing climate.
                </p>
            </header>

            {/* Primary dashboard */}
            <Plate label="Fig. A" title="Disaster Impact Monitor" className="mb-10">
                <DisasterImpactDashboard />
            </Plate>

            {/* Metric grid */}
            <div className="grid md:grid-cols-2 gap-10 mb-10">
                <Plate label="Fig. B" title="Annual Temperature"><IndiaTemperatureChart /></Plate>
                <Plate label="Fig. C" title="Precipitation Levels"><PrecipitationChart /></Plate>
                <Plate label="Fig. D" title="Landslide Impact"><LandslideChart /></Plate>
                <Plate label="Fig. E" title="Glacier Retreat"><GlacierChart /></Plate>
            </div>

            <Plate label="Fig. F" title="Climate Disaster Overview">
                <ClimateDisasterVisualizations />
            </Plate>
        </div>
    </main>
);

export default DataPage;
