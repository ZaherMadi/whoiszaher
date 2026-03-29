import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectCanIHelpYou from './pages/ProjectCanIHelpYou';
import ProjectMarinaYacht from './pages/ProjectMarinaYacht';
import SpaceBackground from './components/SpaceBackground';
import './index.css';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app-container">
          <SpaceBackground />
          <Navbar />
          <main style={{ position: 'relative', zIndex: 10 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project/can-i-help-you" element={<ProjectCanIHelpYou />} />
              <Route path="/project/marina-yacht" element={<ProjectMarinaYacht />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
