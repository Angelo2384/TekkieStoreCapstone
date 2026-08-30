import { HeroSection } from '../components/home/HeroSection';
import { BrandsSection } from '../components/home/BrandsSection';
import { TrendingSection } from '../components/home/TrendingSection';
import { CategorySection } from '../components/home/CategorySection';
import { SaleSection } from '../components/home/SaleSection';

export const LandingPage = () => {
  return (
    <div className="landing-page">
      <HeroSection />
      <BrandsSection />
      <TrendingSection />
      <CategorySection />
      <SaleSection />
    </div>
  );
};
