import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import SkillsSection from '../components/sections/SkillsSection';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <FeaturedProjects />
      <SkillsSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
};

export default Home;
