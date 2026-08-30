import './TrendingSection.css';
import { ArrowRight } from 'lucide-react';
import airMax90 from '../../assets/Nike/Nike Air Max 90.jpg';
import mr530 from '../../assets/New Balance/MR530 White_Grey.jpg';
import vansOldSkool from '../../assets/Vans/Vans Old Skool Black_White.jpg';
import airMonarch from '../../assets/Nike/Nike Mens Air Monarch IV.jpg';

export const TrendingSection = () => {
  const products = [
    {
      id: 1,
      name: "Air Max 90",
      brand: "NIKE",
      price: "R2499",
      image: airMax90,
      tag: "JUST DROPPED"
    },
    {
      id: 2,
      name: "MR530",
      brand: "NEW BALANCE",
      price: "R1999",
      image: mr530,
      tag: "SELLING FAST"
    },
    {
      id: 3,
      name: "Old Skool",
      brand: "VANS",
      price: "R1299",
      image: vansOldSkool,
      tag: "RESTOCKED"
    },
    {
      id: 4,
      name: "Air Monarch IV",
      brand: "NIKE",
      price: "R1399",
      image: airMonarch, 
      tag: "LIMITED"
    }
  ];

  return (
    <section className="trending-section">
      <div className="trending-container">
        <div className="trending-header">
          <div className="trending-header-left">
            <h2 className="section-title">NOW TRENDING</h2>
            <p className="section-subtitle">The most hyped drops of the week.</p>
          </div>
          <a href="/shop" className="view-all-link">
            Shop All <ArrowRight size={20} />
          </a>
        </div>

        <div className="trending-grid">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <span className="product-tag">{product.tag}</span>
                <img src={product.image} alt={product.name} className="product-image" />
                <button className="add-to-cart-btn">Quick Add</button>
              </div>
              <div className="product-info">
                <span className="product-brand">{product.brand}</span>
                <h3 className="product-name">{product.name}</h3>
                <span className="product-price">{product.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};