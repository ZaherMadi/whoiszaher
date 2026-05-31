import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import PresentationSection from '../components/sections/PresentationSection';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import SkillsSection from '../components/sections/SkillsSection';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';
import ClientsSection from '../components/sections/ClientsSection';
import Footer from '../components/Footer';

const Home = () => (
  <div className="home-page">
    <HeroSection />
    <PresentationSection />
    <FeaturedProjects />
    <SkillsSection />
    <AboutSection />
    <ClientsSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Home;
