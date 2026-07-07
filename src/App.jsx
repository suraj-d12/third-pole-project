import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Landing from './pages/Landing';
import DataPage from './pages/DataPage';
import BlogPage from './pages/BlogPage';

// react-router basename derived from Vite's base ('/third-pole-project/')
const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Navigation />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/blog" element={<BlogPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
