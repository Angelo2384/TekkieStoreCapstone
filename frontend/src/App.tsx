import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnnouncementBar, Navbar, Footer } from './components/layout';
import { ShopProvider } from './context/ShopContext';
import AppRoutes from './routes';
import './App.css';

const App: React.FC = () => {
  return (
    <ShopProvider>
      <Router>
        <div className="app-container">
          <AnnouncementBar 
            message="LIMITED DROP: THE OBSIDIAN ORANGE COLLECTION IS LIVE. USE CODE TEKKIE20." 
          />
          <Navbar />
          <main className="main-content">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </ShopProvider>
  );
};

export default App;

