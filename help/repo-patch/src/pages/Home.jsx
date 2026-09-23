import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import PresentationSection from '../components/sections/PresentationSection';
import TimelineSection from '../components/sections/TimelineSection';
import FeaturedProjects from '../components/sections/FeaturedProjects';
import SkillsSection from '../components/sections/SkillsSection';
import AboutSection from '../components/sections/AboutSection';
import ContactSection from '../components/sections/ContactSection';
import ClientsSection from '../components/sections/ClientsSection';
import RecommendationSection from '../components/sections/RecommendationSection';
import Footer from '../components/Footer';

const Home = () => (
  <div className="home-page">
    <HeroSection />
    <PresentationSection />
    <TimelineSection />
    <FeaturedProjects />
    <SkillsSection />
    <AboutSection />
    <ClientsSection />
    <RecommendationSection />
    <ContactSection />
    <Footer />
  </div>
);

export default Home;
