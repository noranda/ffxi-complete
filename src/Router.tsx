/**
 * Application Router
 *
 * Defines routes for the FFXI tracker application including
 * the main dashboard and development tools like the icon library.
 */

import {createBrowserRouter, RouterProvider} from 'react-router-dom';

import {IconLibrary} from '@/components/icons';

import App from './App';

/**
 * Application routes configuration
 */
const router = createBrowserRouter([
  {
    element: <App />,
    path: '/',
  },
  {
    element: <IconLibrary />,
    path: '/icons',
  },
]);

/**
 * Main Router component
 */
export function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
