import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <RouterProvider router={router} />
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;

