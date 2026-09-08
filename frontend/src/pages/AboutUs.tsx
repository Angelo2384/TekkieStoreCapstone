import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  Zap,
  Layers,
  ShoppingBag,
  ArrowRight,
  Flame,
  Tag,
  Search,
  Truck,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import './AboutUs.css';

export const AboutUs: React.FC = () => {
  const brands = [
    { name: 'Nike', displayName: 'NIKE', src: '/nike.svg' },
    { name: 'adidas', displayName: 'ADIDAS', src: '/adidas.svg' },
    { name: 'PUMA', displayName: 'PUMA', src: '/puma.svg' },
    { name: 'Vans', displayName: 'VANS', src: '/vans.svg' },
    { name: 'Converse', displayName: 'CONVERSE', src: '/converse.svg' },
    { name: 'New Balance', displayName: 'NEW BALANCE', src: '/newBalance.svg' },
    { name: 'ASICS', displayName: 'ASICS', src: '/asics.svg' },
  ];

  return (
    <div className="about-page">
      {/* BREADCRUMB BAR */}
      <div className="about-breadcrumb-bar">
        <div className="about-container">
          <nav className="about-breadcrumbs" aria-label="Breadcrumb">
            <Link to="/" className="about-breadcrumb-link">
              Home
            </Link>
            <span className="about-breadcrumb-separator">/</span>
            <span className="about-breadcrumb-current">About Us</span>
          </nav>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section className="about-hero-section">
        <div className="about-container">
          <div className="about-hero-grid">
            {/* LEFT: TEXT CONTENT */}
            <div className="about-hero-content">
              <span className="about-eyebrow">THE TEKKIESTORE STORY</span>
              <h1 className="about-hero-title">
                ABOUT
                <span className="about-text-orange">TEKKIESTORE</span>
              </h1>
              <h2 className="about-hero-subtitle">
                Your destination for sneakers, style, and everyday movement.
              </h2>
              <p className="about-hero-desc">
                Founded with a deep passion for footwear culture, TekkieStore brings together
                an authentic, curated selection of premium sneakers from the world's most
                renowned brands. From game-changing performance silhouettes to iconic street classics,
                we provide a refined platform designed to help you step forward with style.
              </p>

              <div className="about-hero-actions">
                <Link to="/catalogue" className="about-btn-primary">
                  <span>Explore Catalogue</span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/contact" className="about-btn-secondary">
                  <span>Contact Us</span>
                </Link>
              </div>

              {/* 3 HERO HIGHLIGHTS */}
              <div className="about-hero-highlights">
                <div className="about-highlight-item">
                  <ShieldCheck size={20} className="about-highlight-icon" />
                  <span className="about-highlight-title">Authentic Products</span>
                  <span className="about-highlight-sub">100% genuine footwear guaranteed</span>
                </div>
                <div className="about-highlight-item">
                  <Sparkles size={20} className="about-highlight-icon" />
                  <span className="about-highlight-title">Curated Selection</span>
                  <span className="about-highlight-sub">Handpicked rotation of top models</span>
                </div>
                <div className="about-highlight-item">
                  <Zap size={20} className="about-highlight-icon" />
                  <span className="about-highlight-title">Fast & Simple Shopping</span>
                  <span className="about-highlight-sub">Seamless discovery to checkout</span>
                </div>
              </div>
            </div>

            {/* RIGHT: HERO VISUAL */}
            <div className="about-hero-visual">
              <div className="about-hero-img-wrapper">
                <img
                  src="/category_men_sneakers_sitting.jpg"
                  alt="TekkieStore Premium Sneaker Culture"
                  className="about-hero-img"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/hero.png';
                  }}
                />
                <div className="about-hero-floating-badge">
                  <span className="badge-pulse-dot" />
                  <div>
                    <div className="badge-text-primary">PREMIUM FOOTWEAR</div>
                    <div className="badge-text-secondary">Authentic Sneaker Rotation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHO WE ARE SECTION */}
      <section className="about-who-section">
        <div className="about-container">
          <div className="about-who-grid">
            {/* LEFT: LIFESTYLE IMAGE */}
            <div className="about-who-visual">
              <img
                src="/category_women_sneakers_sitting_orange.jpg"
                alt="Crafted for Sneakerheads"
                className="about-who-img"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/hero.png';
                }}
              />
            </div>

            {/* RIGHT: STORY & BENEFITS */}
            <div className="about-who-content">
              <span className="about-eyebrow">WHO WE ARE</span>
              <h2 className="about-who-title">
                CRAFTED FOR SNEAKERHEADS. BUILT FOR EVERY DAY.
              </h2>
              <p className="about-who-paragraph">
                At TekkieStore, we believe finding the right pair of shoes shouldn't be complicated.
                Whether you are chasing the latest limited release, refreshing your daily rotation,
                or exploring new colourways, our digital store is built to make sneaker discovery
                intuitive, transparent, and enjoyable.
              </p>
              <p className="about-who-paragraph">
                We combine clean product categorisation, detailed sizing references, and instant
                cart synchronisation to deliver an exceptional e-commerce experience from the moment
                you browse to the moment your order arrives.
              </p>

              {/* 3 BENEFIT CARDS */}
              <div className="about-benefits-list">
                <div className="about-benefit-card">
                  <div className="about-benefit-icon-box">
                    <Search size={22} />
                  </div>
                  <div>
                    <h3 className="about-benefit-heading">CURATED DISCOVERY</h3>
                    <p className="about-benefit-text">
                      A focused catalogue designed to make sneaker discovery effortless and inspiring.
                    </p>
                  </div>
                </div>

                <div className="about-benefit-card">
                  <div className="about-benefit-icon-box">
                    <Layers size={22} />
                  </div>
                  <div>
                    <h3 className="about-benefit-heading">QUALITY SHOPPING EXPERIENCE</h3>
                    <p className="about-benefit-text">
                      Clean product browsing, detailed imagery, variant selections, and clear specifications.
                    </p>
                  </div>
                </div>

                <div className="about-benefit-card">
                  <div className="about-benefit-icon-box">
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <h3 className="about-benefit-heading">EASY ONLINE SHOPPING</h3>
                    <p className="about-benefit-text">
                      Discover products, select sizes, add to cart, and complete orders with secure checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE OFFER SECTION */}
      <section className="about-offer-section">
        <div className="about-container">
          <div className="about-section-header">
            <span className="about-eyebrow">CURATED CATEGORIES</span>
            <h2 className="about-section-title">WHAT WE OFFER</h2>
            <p className="about-section-desc">
              Explore our core collections tailored for performance, daily lifestyle, and streetwear culture.
            </p>
          </div>

          <div className="about-offer-grid">
            {/* CARD 1: MEN */}
            <Link to="/men" className="about-offer-card" aria-label="Explore Men's Collection">
              <div className="about-offer-icon-wrapper">
                <Layers size={24} />
              </div>
              <h3 className="about-offer-name">MEN</h3>
              <p className="about-offer-desc">
                Men's sneaker collections and footwear engineered for daily comfort and athletic aesthetics.
              </p>
              <span className="about-offer-link">
                Explore Collection <ArrowRight size={15} />
              </span>
            </Link>

            {/* CARD 2: WOMEN */}
            <Link to="/women" className="about-offer-card" aria-label="Explore Women's Collection">
              <div className="about-offer-icon-wrapper">
                <Sparkles size={24} />
              </div>
              <h3 className="about-offer-name">WOMEN</h3>
              <p className="about-offer-desc">
                Women's sneaker collections combining modern silhouettes, vibrant colourways, and versatile fits.
              </p>
              <span className="about-offer-link">
                Explore Collection <ArrowRight size={15} />
              </span>
            </Link>

            {/* CARD 3: NEW DROPS */}
            <Link to="/new-drops" className="about-offer-card" aria-label="Explore New Drops Collection">
              <div className="about-offer-icon-wrapper">
                <Flame size={24} />
              </div>
              <h3 className="about-offer-name">NEW DROPS</h3>
              <p className="about-offer-desc">
                Recently added products, seasonal releases, and the latest silhouettes from premier makers.
              </p>
              <span className="about-offer-link">
                Explore Collection <ArrowRight size={15} />
              </span>
            </Link>

            {/* CARD 4: SALE */}
            <Link to="/sale" className="about-offer-card" aria-label="Explore Sale Collection">
              <div className="about-offer-icon-wrapper">
                <Tag size={24} />
              </div>
              <h3 className="about-offer-name">SALE</h3>
              <p className="about-offer-desc">
                Selected products and seasonal specials available at promotional prices.
              </p>
              <span className="about-offer-link">
                Explore Collection <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. BRANDS SECTION */}
      <section className="about-brands-section">
        <div className="about-container">
          <div className="about-section-header">
            <span className="about-eyebrow">WORLD-CLASS ROSTER</span>
            <h2 className="about-section-title">BRANDS YOU KNOW</h2>
            <p className="about-section-desc">
              Discover footwear from some of the world's most recognisable sneaker brands.
            </p>
          </div>

          <div className="about-brands-grid">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                to={`/catalogue?brand=${encodeURIComponent(brand.name)}`}
                className="about-brand-tile"
                aria-label={`Shop ${brand.displayName}`}
                title={`Shop ${brand.displayName}`}
              >
                <img src={brand.src} alt={brand.displayName} className="about-brand-logo" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY SHOP TEKKIESTORE (OBSIDIAN DARK) */}
      <section className="about-why-section">
        <div className="about-container">
          <div className="about-why-header">
            <span className="about-eyebrow">HIGH VOLTAGE RELIABILITY</span>
            <h2 className="about-why-title">WHY SHOP TEKKIESTORE?</h2>
            <p className="about-why-desc">
              We focus on the essentials: genuine quality, smooth navigation, and responsive customer support.
            </p>
          </div>

          <div className="about-why-grid">
            {/* FEATURE 1 */}
            <div className="about-why-card">
              <div className="about-why-icon-box">
                <ShieldCheck size={24} />
              </div>
              <h3 className="about-why-heading">CURATED SELECTION</h3>
              <p className="about-why-text">
                A focused sneaker catalogue designed around discovery and dependable quality.
              </p>
            </div>

            {/* FEATURE 2 */}
            <div className="about-why-card">
              <div className="about-why-icon-box">
                <Layers size={24} />
              </div>
              <h3 className="about-why-heading">EASY BROWSING</h3>
              <p className="about-why-text">
                Clear categories, brand filters, and intuitive product organisation.
              </p>
            </div>

            {/* FEATURE 3 */}
            <div className="about-why-card">
              <div className="about-why-icon-box">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="about-why-heading">SIMPLE SHOPPING</h3>
              <p className="about-why-text">
                A streamlined journey from product discovery straight through to checkout.
              </p>
            </div>

            {/* FEATURE 4 */}
            <div className="about-why-card">
              <div className="about-why-icon-box">
                <Truck size={24} />
              </div>
              <h3 className="about-why-heading">DELIVERY & SUPPORT</h3>
              <p className="about-why-text">
                Fast order processing, live parcel tracking updates, and dedicated customer support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CORE PHILOSOPHY SECTION */}
      <section className="about-philosophy-section">
        <div className="about-container">
          <div className="about-philosophy-content">
            <span className="about-eyebrow">OUR CORE PHILOSOPHY</span>
            <h2 className="about-philosophy-title">
              BUILT AROUND THE WAY YOU SHOP FOR SNEAKERS.
            </h2>
            <p className="about-philosophy-text">
              At TekkieStore, we believe finding the right pair should be straightforward and exciting.
              Every feature — from detailed size guides and variant selection to real-time cart
              synchronisation — is engineered to put sneakerheads first.
            </p>
            <div className="about-philosophy-divider" />
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA SECTION */}
      <section className="about-final-cta">
        <img
          src="/hero.png"
          alt="TekkieStore Final Call to Action Background"
          className="about-final-cta-bg"
        />
        <div className="about-final-cta-overlay" />
        <div className="about-container">
          <div className="about-final-cta-content">
            <h2 className="about-final-cta-title">FIND YOUR NEXT PAIR</h2>
            <p className="about-final-cta-desc">
              Explore the TekkieStore catalogue and discover your next favourite sneakers.
            </p>
            <div className="about-final-cta-buttons">
              <Link to="/catalogue" className="about-btn-primary">
                <span>Shop Now</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/contact" className="about-btn-cta-white">
                <HeartHandshake size={17} />
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
