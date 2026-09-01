import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <WishlistProvider>
      <RouterProvider router={router} />
    </WishlistProvider>
  );
}

export default App;
