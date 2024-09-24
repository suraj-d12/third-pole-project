import React, { useState, useMemo } from 'react';
import IndiaTemperatureChart from './IndiaTemperatureChart';
import PrecipitationChart from './PrecipitationChart';
import LandslideChart from './LandslideChart';
import GlacierChart from './GlacierChart';
import '../styles/ThirdPoleProject.css'; // Assuming you'll add styles later

const ThirdPoleProject = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredBlogs = useMemo(() => {
    const blogs = [
      { title: "Tackling Climate and Water Challenges in the Himalayas using AI", link: "#" },
      // Add more blogs here
    ];
    return blogs.filter(blog => blog.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm]);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <div>Home Content</div>;
      case 'research':
        return <div>Research Content</div>;
      case 'visualizations':
        return (
          <div>
            <IndiaTemperatureChart />
            <PrecipitationChart />
            <LandslideChart />
            <GlacierChart />
          </div>
        );
      case 'blogs':
        return (
          <div>
            {filteredBlogs.map((blog, index) => (
              <a key={index} href={blog.link}>{blog.title}</a>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="third-pole-project">
      {/* Render the component UI with a tab system */}
      {renderContent()}
    </div>
  );
};

export default ThirdPoleProject;

