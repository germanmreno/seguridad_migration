import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom'
import { EntriesPage } from './EntriesPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <EntriesPage />,
  },
  {
    path: "/about",
    element: (
      <div>
        <h1>Hello from About</h1>
        <Link to="/">Home</Link>
      </div>
    ),
  },
]);

export const App = () => <RouterProvider router={router} />



