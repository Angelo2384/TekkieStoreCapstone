import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage, LandingPage, SignUpPage } from '../pages';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
    </Routes>
  );
};

export default AppRoutes;
