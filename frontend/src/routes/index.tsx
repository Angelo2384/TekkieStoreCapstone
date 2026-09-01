import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { Layout } from '../components/layout/Layout';
import { CataloguePage } from '../pages/CataloguePage';
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
        element: <CataloguePage />,
      },
      {
        path: '/men',
        element: <CataloguePage />,
      },
      {
        path: '/women',
        element: <CataloguePage />,
      },
      {
        path: '/new-drops',
        element: <CataloguePage />,
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
