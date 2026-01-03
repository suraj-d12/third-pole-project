// src/components/ThirdPoleProject.jsx

import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import DisasterImpactDashboard from './DisasterImpactDashboard';
import ClimateDisasterVisualizations from './ClimateDisasterVisualizations';
import Navigation from './Navigation';
import Hero from './Hero';
import GlassCard from './ui/GlassCard';
import AboutSection from './AboutSection';

import { indiaTemperatureData } from '../data/temperatureData';
import { weatherData } from '../data/weatherData';
import { landslideData } from '../data/landslideData';
import { glacierData } from '../data/glacierData';

const themeColors = {
  primary: '#38bdf8',
  secondary: '#22d3ee',
  accent: '#f97316',
  grid: '#334155',
  text: '#f1f5f9'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-dark-800 border border-white/10 p-4 rounded-lg shadow-xl backdrop-blur-sm">
        <p className="text-gray-300 mb-2">{label}</p>
        {payload.map((pld, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: pld.color }}></div>
            <p className="font-bold text-white">
              {pld.name}: {pld.value}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Updated Charts with new theme
const IndiaTemperatureChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={indiaTemperatureData}>
      <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
      <XAxis dataKey="year" stroke={themeColors.text} />
      <YAxis stroke={themeColors.text} domain={[25, 27]} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line type="monotone" dataKey="temperature" stroke={themeColors.primary} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Avg. Temp (°C)" />
    </LineChart>
  </ResponsiveContainer>
);

const PrecipitationChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={weatherData}>
      <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
      <XAxis dataKey="month" stroke={themeColors.text} />
      <YAxis stroke={themeColors.text} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey="precipitation" fill={themeColors.secondary} radius={[4, 4, 0, 0]} name="Precipitation (mm)" />
    </BarChart>
  </ResponsiveContainer>
);

const LandslideChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={landslideData}>
      <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
      <XAxis dataKey="year" stroke={themeColors.text} />
      <YAxis stroke={themeColors.text} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line type="monotone" dataKey="deaths" stroke={themeColors.accent} strokeWidth={3} name="Deaths" />
    </LineChart>
  </ResponsiveContainer>
);

const GlacierChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={glacierData}>
      <CartesianGrid strokeDasharray="3 3" stroke={themeColors.grid} />
      <XAxis dataKey="year" stroke={themeColors.text} />
      <YAxis stroke={themeColors.text} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Line type="monotone" dataKey="area" stroke={themeColors.primary} strokeWidth={3} name="Glacier Area" />
    </LineChart>
  </ResponsiveContainer>
);

const ThirdPoleProject = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');

  const researchItems = [
    { title: 'Extreme Weather Events', image: 'url("cloud.jpg.avif")' },
    { title: 'Climate Modeling and Predictions', image: 'url("earth.jpg")' },
    { title: 'Glacier Dynamics and Water Resources', image: 'url("glacier2.jpg")' },
    { title: 'Vegetation Changes and Land Use', image: 'url("drought.jpeg.webp")' },
    { title: 'Humanitarian Response', image: 'url("floods.jpg.webp")' },
    { title: "Terrestrial Water Changes", image: 'url("Gangotri.jpg")' },
  ];

  const ResearchGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {researchItems.map((item, index) => (
        <div
          key={index}
          className="group relative h-64 rounded-2xl overflow-hidden shadow-2xl cursor-pointer transform transition-all duration-500 hover:scale-105"
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: item.image }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <h3 className="text-xl font-bold text-white font-heading leading-tight group-hover:text-primary transition-colors">
              {item.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );

  const filteredBlogs = useMemo(() => {
    const blogs = [
      {
        title: "Tackling Climate and Water Challenges in the Himalayas using AI",
        link: "https://www.himalayanwaterproject.org/post/tackling-climate-and-water-challenges-in-the-himalayas-using-ai?fbclid=PAAaYk42lbCAwvs7NAlLl5tlILoeEEMovhuIRWmo2vMEQ_SAjkvU59c_c5N3g_aem_AUUgE-tuc5yK5O631x1-3Q7zOoMlneCuDTH2uRJHXjU-y7wdNfTwqlPw0oN2RBTUWPc"
      },
    ];
    return blogs.filter(blog => blog.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <Hero onExplore={() => setActiveTab('visualizations')} />
            <AboutSection />
          </>
        );

      case 'research':
        return (
          <div className="container mx-auto px-4 py-8 animate-fade-in">
            <h2 className="text-4xl font-bold font-heading mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
              Research Themes
            </h2>
            <ResearchGrid />
          </div>
        );

      case 'visualizations':
        return (
          <div className="container mx-auto px-4 py-8 space-y-12 animate-fade-in">
            {/* Main Dashboard */}
            <section>
              <h2 className="text-3xl font-bold font-heading mb-6 text-white border-l-4 border-primary pl-4">
                Disaster Impact Monitor
              </h2>
              <GlassCard className="p-6">
                <DisasterImpactDashboard />
              </GlassCard>
            </section>

            {/* Metric Grid */}
            <section>
              <h2 className="text-3xl font-bold font-heading mb-6 text-white border-l-4 border-secondary pl-4">
                Climate Metrics
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-200">Annual Temperature</h3>
                  <IndiaTemperatureChart />
                </GlassCard>
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-200">Precipitation Levels</h3>
                  <PrecipitationChart />
                </GlassCard>
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-200">Landslide Impact</h3>
                  <LandslideChart />
                </GlassCard>
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-200">Glacier Retreat</h3>
                  <GlacierChart />
                </GlassCard>
              </div>
            </section>

            <section>
              <ClimateDisasterVisualizations />
            </section>
          </div>
        );

      case 'blogs':
        return (
          <div className="container mx-auto px-4 py-8 animate-fade-in">
            <h2 className="text-4xl font-bold font-heading mb-8">Latest Insights</h2>
            <div className="grid gap-6">
              {filteredBlogs.map((blog, index) => (
                <GlassCard key={index} className="p-6 hover:border-primary/50 transition-colors group">
                  <a href={blog.link} target="_blank" rel="noopener noreferrer" className="block">
                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors mb-2">
                      {blog.title}
                    </h3>
                    <span className="text-sm text-gray-400">Read Article →</span>
                  </a>
                </GlassCard>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 to-black text-white selection:bg-primary selection:text-black font-sans">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="min-h-screen pb-20">
        {renderContent()}
      </main>
    </div>
  );
};

export default ThirdPoleProject;
