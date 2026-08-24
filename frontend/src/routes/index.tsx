import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LoginPage, LandingPage, SignUpPage, CataloguePage, ProductDetailsPage, CartPage, ProfilePage, OrderHistoryPage, DeliveryPage, WishlistPage, CheckoutPage, OrderConfirmationPage } from '../pages';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/catalogue" element={<CataloguePage />} />
      <Route path="/product/:productId" element={<ProductDetailsPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/order-history" element={<OrderHistoryPage />} />
      <Route path="/delivery" element={<DeliveryPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/new-drops" element={<CataloguePage />} />
      <Route path="/men" element={<CataloguePage />} />
      <Route path="/women" element={<CataloguePage />} />
      <Route path="/limited-edition" element={<CataloguePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<SignUpPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
    </Routes>
  );
};

export default AppRoutes;
