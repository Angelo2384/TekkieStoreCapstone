import { Outlet } from 'react-router-dom';
import { AnnouncementBar } from '../shared/AnnouncementBar';
import { Navbar } from '../shared/Navbar';
import { Footer } from '../shared/Footer';

export const Layout = () => {
  return (
    <div className="layout">
      <AnnouncementBar />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
