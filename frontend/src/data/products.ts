export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  badge?: 'JUST IN' | 'CLASSIC' | 'NEW' | 'HOT DROP' | 'LIMITED' | 'EXCLUSIVE';
  description: string;
  rating: number;
  reviewCount: number;
  colors: ProductColor[];
  sizes: number[];
  defaultSize?: number;
  stockMessage?: string;
  category: 'Men' | 'Women' | 'Unisex';
  isNewDrop?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 1,
    brand: 'NIKE',
    name: "Air Max Elite 'Obsidian Orange'",
    price: 3499,
    image: '/Air Force 1 orange & white.png',
    images: [
      '/Air Force 1 orange & white.png',
      '/Nike airmax 270.png',
      '/Air Force 1 black HighTop.png',
      '/Nike Free RN.png'
    ],
    description: "The elite sneaker destination blending premium streetwear editorial aesthetics with high performance utility. Designed for the bold, engineered for the street.",
    rating: 4.9,
    reviewCount: 128,
    colors: [
      { name: 'Black', hex: '#111111' },
      { name: 'Orange', hex: '#ff4500' },
      { name: 'Light Grey', hex: '#e5e7eb' }
    ],
    sizes: [6, 7, 8, 9, 10, 11, 12],
    defaultSize: 9,
    stockMessage: 'Low Stock - Only 2 left in Size 9',
    category: 'Unisex',
    isNewDrop: true
  },
  {
    id: 2,
    brand: 'UNDER ARMOUR',
    name: 'Speedform Pro V2',
    price: 2699,
    image: '/Nike Free 4.0 Flyknit.png',
    images: [
      '/Nike Free 4.0 Flyknit.png',
      '/Nike Free RN.png',
      '/Nike ZoomX Invincible Run Flyknit 3.png',
      '/Air Force 1 orange & white.png'
    ],
    description: "Engineered for maximum velocity and high-impact responsiveness. Features an ultra-breathable mesh chassis and adaptive traction lugs.",
    rating: 4.8,
    reviewCount: 84,
    colors: [
      { name: 'Orange Ember', hex: '#ea580c' },
      { name: 'Triple Black', hex: '#18181b' },
      { name: 'Arctic White', hex: '#f4f4f5' }
    ],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    defaultSize: 8.5,
    stockMessage: 'Selling fast - 4 pairs left in stock',
    category: 'Men',
    isNewDrop: true
  },
  {
    id: 3,
    brand: 'CONVERSE',
    name: "Retro Classic 'White Obsidian'",
    price: 2050,
    image: '/Air Force 1 black HighTop.png',
    images: [
      '/Air Force 1 black HighTop.png',
      '/Air Force 1 white.png',
      '/Nike dunk low retro.png',
      '/PUMA Slipstream Archive Remastered.png'
    ],
    description: "An undisputed streetwear staple rebuilt with premium heavy-gauge canvas, archival contrast stitching, and enhanced cushioned footbeds for all-day comfort.",
    rating: 4.7,
    reviewCount: 215,
    colors: [
      { name: 'White Obsidian', hex: '#ffffff' },
      { name: 'Pitch Black', hex: '#09090b' },
      { name: 'Vintage Cream', hex: '#fef3c7' }
    ],
    sizes: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 11],
    defaultSize: 8,
    category: 'Unisex',
    isNewDrop: false
  },
  {
    id: 4,
    brand: 'SALOMON',
    name: 'Apex Trail Runner',
    price: 2950,
    badge: 'JUST IN',
    image: '/Nike ZoomX Invincible Run Flyknit 3.png',
    images: [
      '/Nike ZoomX Invincible Run Flyknit 3.png',
      '/Nike Free 4.0 Flyknit.png',
      '/Nike Free RN.png',
      '/Air Force 1 black HighTop.png'
    ],
    description: "Rugged technical outdoor performance meets avant-garde streetwear aesthetics. Equipped with Quicklace system and Contagrip chevron tread.",
    rating: 4.9,
    reviewCount: 96,
    colors: [
      { name: 'Aubergine Slate', hex: '#4c1d95' },
      { name: 'Shadow Black', hex: '#18181b' },
      { name: 'Alpine Moss', hex: '#3f6212' }
    ],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    defaultSize: 9,
    stockMessage: 'High demand - limited allocation available',
    category: 'Unisex',
    isNewDrop: true
  },
  {
    id: 5,
    brand: 'ADIDAS',
    name: 'Stan Smith Classic',
    price: 1950,
    badge: 'CLASSIC',
    image: '/Air Force 1 white.png',
    images: [
      '/Air Force 1 white.png',
      '/PUMA Slipstream Archive Remastered.png',
      '/Nike dunk low retro.png',
      '/Air Force 1 orange & white.png'
    ],
    description: "The minimalist tennis icon that defined casual elegance. Premium supple leather upper with signature green heel tab accents and perforated 3-Stripes.",
    rating: 4.8,
    reviewCount: 310,
    colors: [
      { name: 'White / Fairway Green', hex: '#ffffff' },
      { name: 'White / Navy', hex: '#1e3a8a' },
      { name: 'Triple White', hex: '#f8fafc' }
    ],
    sizes: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    defaultSize: 8,
    category: 'Unisex',
    isNewDrop: false
  },
  {
    id: 6,
    brand: 'NEW BALANCE',
    name: "990v6 'Grey Matter'",
    price: 3899,
    badge: 'NEW',
    image: '/Nike dunk low retro.png',
    images: [
      '/Nike dunk low retro.png',
      '/Air Jordan 1 Low unc.png',
      '/PUMA Slipstream Archive Remastered.png',
      '/Air Force 1 white.png'
    ],
    description: "The pinnacle of heritage craftsmanship and modern lifestyle prestige. Crafted with pigskin suede overlays, FuelCell foam cushioning, and iconic reflective 3M branding.",
    rating: 5.0,
    reviewCount: 154,
    colors: [
      { name: 'Grey Matter', hex: '#9ca3af' },
      { name: 'Castlerock', hex: '#4b5563' },
      { name: 'Navy Stone', hex: '#1e293b' }
    ],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    defaultSize: 8.5,
    stockMessage: 'Low Stock - Only 3 pairs remaining',
    category: 'Unisex',
    isNewDrop: true
  },
  {
    id: 7,
    brand: 'NIKE',
    name: "Air Max 90 'Obsidian'",
    price: 3299,
    badge: 'HOT DROP',
    image: '/Nike airmax 270.png',
    images: [
      '/Nike airmax 270.png',
      '/Air Force 1 orange & white.png',
      '/Womens Air Jordan 3 Retro Laser Orange.png',
      '/Nike Air Jordan 1 Retro High Satin Snake Chicago.png'
    ],
    description: "A cultural titan of 90s running heritage. Features stitched overlays, classic TPU accents, and visible Max Air cushioning with bold sunset orange gradients.",
    rating: 4.9,
    reviewCount: 188,
    colors: [
      { name: 'Obsidian Orange', hex: '#ea580c' },
      { name: 'Infrared Black', hex: '#dc2626' },
      { name: 'Smoke Grey', hex: '#64748b' }
    ],
    sizes: [6, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    defaultSize: 9,
    stockMessage: 'Selling fast - 2 left in Size 9',
    category: 'Unisex',
    isNewDrop: true
  }
];

export const getProductById = (id: number | string): Product | undefined => {
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  return PRODUCTS.find(p => p.id === numericId);
};
