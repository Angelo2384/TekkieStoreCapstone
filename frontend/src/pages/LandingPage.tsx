import React from 'react';
import { Button, FloatingInfoBadge, Badge } from '../components/ui';
import { Stat, StatsGroup, BrandShowcase } from '../components/common';
import './LandingPage.css';

const LandingPage: React.FC = () => {
  const brands = [
    { id: 'nike', name: 'Nike' },
    { id: 'adidas', name: 'Adidas' },
    { id: 'puma', name: 'Puma' },
    { id: 'newbalance', name: 'New Balance' },
    { id: 'converse', name: 'Converse' },
    { id: 'vans', name: 'Vans' },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <Badge label="New Arrivals" variant="secondary" className="hero-badge" />
            <h1 className="hero-title">
              Elevate Your <br />
              <span className="text-primary">Street Style</span>
            </h1>
            <p className="hero-description">
              Discover the latest premium sneakers and streetwear from top brands. 
              Authentic gear for the modern culture.
            </p>
            
            <div className="hero-actions">
              <Button size="lg" variant="primary">
                Shop The Drop
              </Button>
              <Button size="lg" variant="secondary">
                Explore Collection
              </Button>
            </div>

            <StatsGroup className="hero-stats">
              <Stat value="50+" label="Brands" />
              <Stat value="10k+" label="Products" />
              <Stat value="24h" label="Fast Delivery" />
            </StatsGroup>
          </div>
          
          <div className="hero-visual">
            <div className="hero-image-wrapper">
              <div className="hero-shape"></div>
              <img 
                src="/Air Force 1 orange & white.png" 
                alt="Air Force 1 orange & white" 
                className="hero-image"
              />
              
              <FloatingInfoBadge 
                position="top-right"
                label="Trending"
                mainText="Air Force 1"
                className="badge-trending"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                }
              />
              
              <FloatingInfoBadge 
                position="bottom-left"
                label="Guarantee"
                mainText="100% Authentic"
                className="badge-auth"
                icon={
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Premium Brands Section */}
      <section className="brands-section">
        <div className="brands-container">
          <div className="brands-header">
            <h2>Premium Brands</h2>
            <p>Curated selection from the best in the game.</p>
          </div>
          <BrandShowcase brands={brands} />
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
