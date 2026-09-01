import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { Layout } from '../components/layout/Layout';
import { Catalogue } from '../pages/Catalogue';
import { Login } from '../pages/Login';
import { SignUp } from '../pages/SignUp';
import { ForgotPassword } from '../pages/ForgotPassword';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/catalogue',
        element: <Catalogue />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
]);
