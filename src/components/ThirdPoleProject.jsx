// src/components/ThirdPoleProject.js

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

// Import data from separate file
import DisasterImpactDashboard from './DisasterImpactDashboard';
import ClimateDisasterVisualizations from './ClimateDisasterVisualizations';
import { indiaTemperatureData } from '../data/temperatureData';
import { weatherData } from '../data/weatherData';
import { landslideData } from '../data/landslideData';
import { glacierData } from '../data/glacierData';

// Create separate chart components
const IndiaTemperatureChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={indiaTemperatureData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
      <XAxis dataKey="year" stroke="#fff" />
      <YAxis stroke="#fff" domain={[25, 27]} />
      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
      <Legend />
      <Line type="monotone" dataKey="temperature" stroke="#8884d8" name="Avg. Temperature (°C)" />
    </LineChart>
  </ResponsiveContainer>
);

const PrecipitationChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={weatherData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
      <XAxis dataKey="month" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
      <Legend />
      <Bar dataKey="precipitation" fill="#82ca9d" name="Precipitation (mm)" />
    </BarChart>
  </ResponsiveContainer>
);

const LandslideChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={landslideData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
      <XAxis dataKey="year" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
      <Legend />
      <Line type="monotone" dataKey="deaths" stroke="#ff7300" name="Deaths from Landslides" />
    </LineChart>
  </ResponsiveContainer>
);

const GlacierChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={glacierData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#555" />
      <XAxis dataKey="year" stroke="#fff" />
      <YAxis stroke="#fff" />
      <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none' }} />
      <Legend />
      <Line type="monotone" dataKey="area" stroke="#8884d8" name="Glacier Area (relative units)" />
    </LineChart>
  </ResponsiveContainer>
);

const ThirdPoleProject = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const researchItems = [
    {
      title: 'Extreme Weather Events',
      image: 'url("cloud.jpg.avif")',
    },
    {
      title: 'Climate Modeling and Predictions',
      image: 'url("earth.jpg")',
    },
    {
      title: 'Glacier Dynamics and Water Resources',
      image: 'url("glacier2.jpg")',
    },
    {
      title: 'Vegetation Changes and Land Use',
      image: 'url("drought.jpeg.webp")',
    },
    {
      title: 'Humanitarian Response',
      image: 'url("floods.jpg.webp")',
    },
    {
      title: "Terrestrial Water Changes",
      image: 'url("Gangotri.jpg")',
    },
  ];

  // Define a new ResearchGrid component
  const ResearchGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {researchItems.map((item, index) => (
        <div
          key={index}
          className="bg-cover bg-center h-40 flex items-center justify-center text-white font-bold text-xl"
          style={{
            backgroundImage: item.image,
          }}
        >
          <div className="bg-black bg-opacity-50 p-2 rounded">
            {item.title}
          </div>
        </div>
      ))}
    </div>
  );

  const filteredBlogs = useMemo(() => {
    // Example filtering logic for blogs
    const blogs = [
      {
        title: "Tackling Climate and Water Challenges in the Himalayas using AI",
        link: "https://www.himalayanwaterproject.org/post/tackling-climate-and-water-challenges-in-the-himalayas-using-ai?fbclid=PAAaYk42lbCAwvs7NAlLl5tlILoeEEMovhuIRWmo2vMEQ_SAjkvU59c_c5N3g_aem_AUUgE-tuc5yK5O631x1-3Q7zOoMlneCuDTH2uRJHXjU-y7wdNfTwqlPw0oN2RBTUWPc"
      },
      // Add more blogs as needed
    ];

    return blogs.filter(blog => blog.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">About Third Pole Project</h2>
            <p className="text-gray-300 mb-4">
              Third Pole Project is an AI-powered weather forecasting and early disaster warning system that provides highly accurate predictions for governments, militaries, enterprises, and citizens worldwide. Using advanced deep learning techniques combined with numerical weather prediction, Third Pole Project improves forecast horizons and resolution compared to conventional meteorology.
              Our research focuses on weather across the Indian subcontinent, including extreme weather events, climate patterns, and their impacts on various sectors. Through our work, we aim to contribute to a better understanding of this crucial region and inform policy decisions for sustainable development and disaster mitigation.
              Using the OpenBuildings dataset we aim to significantly enhance humanatarian response in the disaster prone areas.

            </p>

            {/* Video container */}
            <div className="flex justify-center my-8">
              <video
                className="w-full max-w-md rounded-lg shadow-lg"
                controls
                autoPlay
                muted
                loop
              >
                <source src={import.meta.env.BASE_URL + "temporal.mp4"} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>

            <p className="text-gray-300">
              Our mission is to provide accurate and timely information about climate changes in the Third Pole region,
              helping communities and policymakers make informed decisions.
            </p>
          </div>
        );
      case 'research':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Research Themes</h2>
            <ResearchGrid />
          </div>
        );

      case 'visualizations':
        return (
          <div className="p-4">
            <div>
              <h2 className="text-2xl font-bold mb-4">Disaster Impact in India (1980-2024)</h2>
              <DisasterImpactDashboard />
            </div>
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4">Data Visualizations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-3">Average Annual Temperature in India (2001-2023)</h3>
                  <IndiaTemperatureChart />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-3">Precipitation Levels</h3>
                  <PrecipitationChart />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-3">Landslide Deaths Over Time</h3>
                  <LandslideChart />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-3">Glacier Retreat Over Time</h3>
                  <GlacierChart />
                </div>
              </div>
            </div>
            <div className="mt-8">
              <ClimateDisasterVisualizations />
            </div>
          </div>
        );
      case 'blogs':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Blogs</h2>
            <ul className="list-disc list-inside">
              {filteredBlogs.map((blog, index) => (
                <li key={index}>
                  <a href={blog.link} className="text-blue-400 hover:underline">
                    {blog.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Third Pole Project</h1>
          <input
            type="text"
            placeholder="Search..."
            className="px-2 py-1 bg-gray-700 text-white rounded"
            onChange={handleSearch}
          />
        </div>
      </header>
      <nav className="bg-gray-700 p-4">
        <div className="container mx-auto">
          <ul className="flex space-x-4">
            {['home', 'research', 'visualizations', 'blogs'].map((tab) => (
              <li key={tab}>
                <button
                  className={`text-white ${activeTab === tab ? 'font-bold' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <main className="flex-grow container mx-auto mt-8">
        {renderContent()}
      </main>
      <footer className="bg-gray-800 p-4 mt-8">
        <div className="container mx-auto text-center text-gray-400">
          © 2024 Third Pole Project. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ThirdPoleProject;
