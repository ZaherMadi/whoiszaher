import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SpaceBackground from './components/SpaceBackground';
import './index.css';

const ProjectCanIHelpYou = lazy(() => import('./pages/ProjectCanIHelpYou'));
const ProjectMarinaYacht = lazy(() => import('./pages/ProjectMarinaYacht'));
const Page404 = lazy(() => import('./pages/Page404'));
const PageMerci = lazy(() => import('./pages/PageMerci'));

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app-container">
          <SpaceBackground />
          <Navbar />
          <main style={{ position: 'relative', zIndex: 10 }}>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/project/can-i-help-you" element={<ProjectCanIHelpYou />} />
                <Route path="/project/marina-yacht" element={<ProjectMarinaYacht />} />
                <Route path="/merci" element={<PageMerci />} />
                <Route path="*" element={<Page404 />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
