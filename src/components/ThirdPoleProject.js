// src/components/ThirdPoleProject.js

import React, { useState, useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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
import DisasterDashboard from './DisasterDashboard';
import ClimateDisasterVisualizations from './ClimateDisasterVisualizations';
import { indiaTemperatureData } from '../data/temperatureData';
import { weatherData } from '../data/weatherData';
import { landslideData } from '../data/landslideData';
import { glacierData } from '../data/glacierData';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [hoveredTheme, setHoveredTheme] = useState(null);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
const researchItems = [
  {
    title: 'Extreme Weather Events',
    image: 'url("cloud.jpg.avif")',
    latitude: 28.6139,
    longitude: 77.2090,
    description: 'Study of extreme weather patterns in India  and surrounding regions, focusing on heat waves and monsoon variability.',
    },
  {
    title: 'Climate Modeling and Predictions',
    image: 'url("earth.jpg")',
    latitude: 22.5726,
    longitude: 88.3639,
    description: 'Advanced climate modeling techniques applied, predicting long-term climate trends and their impacts.',
    },
  {
    title: 'Glacier Dynamics and Water Resources',
    image: 'url("glacier2.jpg")',
    latitude: 33.45,
    longitude: 76.18,
    description: 'Monitoring of Drang-Drung Glacier retreat and its effects on water resources and formation of glacial lakes.',
  },
  {
    title: 'Vegetation Changes and Land Use',
    image: 'url("drought.jpeg.webp")',
    latitude: 26.8467,
    longitude: 80.9462,
    description: 'Analysis of changing vegetation patterns and land use practices, with a focus on agricultural impacts.',
    },
  {
    title: 'Humanitarian Response',
    image: 'url("floods.jpg.webp")',
    latitude: 11.46,
    longitude: 76.13,
    description: 'Development of early warning systems and disaster response strategies for disaster-prone areas.',
  },
  {
    title: "Terrestrial Water Changes",
    image: 'url("Gangotri.jpg")',
    latitude: 30.9980,
    longitude: 78.9400,
    description: 'Comprehensive study of terrestrial water dynamics in the Gangotri region, including glacial melt, precipitation patterns, and river flow changes.',
    },
];
const LocationCoordinates = ({ latitude, longitude }) => (
    <div className="mt-2 text-sm">
      <p>Latitude: {latitude.toFixed(4)}</p>
      <p>Longitude: {longitude.toFixed(4)}</p>
    </div>
  );
// Define a new ResearchGrid component
const ResearchGrid = ({ 
  researchItems, 
  setSelectedTheme, 
  hoveredTheme, 
  setHoveredTheme 
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {researchItems.map((item, index) => (
      <div
        key={index}
        className="bg-cover bg-center h-40 flex items-center justify-center text-white font-bold text-xl"
        style={{
          backgroundImage: item.image,
        }}
	onClick={() => setSelectedTheme(item)}
          onMouseEnter={() => setHoveredTheme(item)}
          onMouseLeave={() => setHoveredTheme(null)}
        >
      >
        <div className="bg-black bg-opacity-50 p-2 rounded">
          {item.title}
        </div>
	<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 p-2">
              <LocationCoordinates latitude={item.latitude} longitude={item.longitude} />
            </div>
          )}
      </div>
    ))}
  </div>
);

  // Component for map
  const ResearchMap = () => {
	   useEffect(() => { }, []);
    // If using server-side rendering, we need to check if window is defined
    if (typeof window === 'undefined') {
      return null;
    }
// Import map components only on client side
    const { MapContainer, TileLayer, Marker, Popup } = require('react-leaflet');	     
    return (
      <MapContainer center={[28.6139, 77.2090]} zoom={5} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {researchItems.map((item, index) => (
          <Marker key={index} position={[item.latitude, item.longitude]}>
            <Popup>
              <strong>{item.title}</strong>
              <br />
              {item.description}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  };

const SelectedThemeDetails = ({ theme }) => (
    <div className="mt-4 p-4 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-bold mb-2">{theme.title}</h3>
      <p className="mb-2">{theme.description}</p>
      <LocationCoordinates latitude={theme.latitude} longitude={theme.longitude} />
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
          <source src={process.env.PUBLIC_URL + "/temporal.mp4"} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      <p className="text-gray-300">
        Our mission is to revolutionize weather forecasting and disaster management in the Indian subcontinent.
	  </p>
    </div>
  );
case 'research':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Research Themes</h2>
            <p className="mb-4">Hover over a research theme to view its location coordinates. Click to see more details.</p>
            <ResearchGrid 
              researchItems={researchItems}
              setSelectedTheme={setSelectedTheme}
              hoveredTheme={hoveredTheme}
              setHoveredTheme={setHoveredTheme}
            />
            {selectedTheme && <SelectedThemeDetails theme={selectedTheme} />}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Research Locations Map</h3>
              <ResearchMap />
            </div>
          </div>
        );
 case 'visualizations':
   return (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Data Visualizations</h2>
    
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-3">Comprehensive Disaster Impact Dashboard</h3>
      <DisasterDashboard />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
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

    <div className="mt-8">
      <ClimateDisasterVisualizations />
    </div>
  </div>
);

      case 'blogs and podcasts':
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Blogs and Podcasts</h2>
	   <div className="mb-16"> 
	     <h3 className="text-xl font-bold mb-2">Blogs</h3>
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
	 <div className="h-16"></div> 
            
            <div className="mt-16"> 
              <h3 className="text-xl font-bold mb-2">Podcast</h3>
              <div className="bg-gray-800 p-4 rounded-lg">
                <h4 className="text-lg font-semibold mb-2">Third Pole Project Podcast</h4>
                <p className="text-gray-300 mb-4">
                   Join us as we explore the latest developments in climate science, disaster management, 
                  and technological innovations in weather forecasting. Tales of Tempests, Time, and Techy Tomorrows. How has weather shaped our civilisations, how does it continue to impact our lives,                   and what role does technology play?
		</p>
                <a 
                  href="https://open.spotify.com/show/0lY18DcFTqR0RIIGE2kAJg?si=zhc8Rs-HSbC5U57JNCQAeg" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                >
                  Listen on Spotify
                </a>
	       <a
                href="https://podcasts.apple.com/us/podcast/weathering-the-ages/id1773291733"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
              >
                Listen on Apple Podcasts
              </a>
	       <a
                href="https://youtu.be/i6ivO4CZWkk?feature=shared"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Watch on YouTube
              </a>
              </div>
            </div>
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
          {['home', 'research', 'visualizations', 'blogs and podcasts'].map((tab) => (
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
    </footer>

  </div> 
);
};
export default ThirdPoleProject;
