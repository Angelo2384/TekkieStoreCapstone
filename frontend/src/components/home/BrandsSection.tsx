import "./BrandsSection.css";

export const BrandsSection = () => {
  const brands = [
    { name: "NIKE", src: "/nike.svg" },
    { name: "ADIDAS", src: "/adidas.svg" },
    { name: "VANS", src: "/vans.svg" },
    { name: "NEW BALANCE", src: "/newBalance.svg" },
    { name: "PUMA", src: "/puma.svg" },
    { name: "CONVERSE", src: "/converse.svg" },
  ];

  return (
    <section className="brands-section">
      <div className="brands-container">
        <div className="brands-header">
          <h2 className="brands-title">PREMIUM BRANDS</h2>
          <p className="brands-subtitle">
            Curated selection from the best in the game.
          </p>
        </div>
        <div className="brands-row">
          {brands.map((brand, index) => (
            <img
              key={index}
              src={brand.src}
              alt={brand.name}
              className="brand-icon"
            />
          ))}
        </div>
        <div className="brands-footer">
          <span className="brand-more">+ AND MORE</span>
        </div>
      </div>
    </section>
  );
};
