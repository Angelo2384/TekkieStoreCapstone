import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { AnnouncementBar, Navbar, Footer } from './components/layout';
import { ShopProvider } from './context/ShopContext';
import AppRoutes from './routes';
import './App.css';

const AppContent: React.FC = () => {
  const location = useLocation();
  const hideFooterRoutes = ['/login', '/register'];
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      <AnnouncementBar 
        message="LIMITED DROP: THE OBSIDIAN ORANGE COLLECTION IS LIVE. USE CODE TEKKIE20." 
      />
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ShopProvider>
      <Router>
        <AppContent />
      </Router>
    </ShopProvider>
  );
};

export default App;

