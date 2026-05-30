import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProjectCanIHelpYou from './pages/ProjectCanIHelpYou';
import ProjectMarinaYacht from './pages/ProjectMarinaYacht';
import SpaceBackground from './components/SpaceBackground';
import Page404 from './pages/Page404';
import PageMerci from './pages/PageMerci';
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
              <Route path="/merci" element={<PageMerci />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
