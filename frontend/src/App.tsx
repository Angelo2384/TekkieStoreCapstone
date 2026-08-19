import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnnouncementBar, Navbar, Footer } from './components/layout';
import AppRoutes from './routes';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="app-container">
        <AnnouncementBar 
          message="Free shipping on all orders over R150" 
          linkText="Shop Now" 
          href="/shop" 
        />
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
