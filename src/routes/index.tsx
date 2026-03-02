import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthRoutes } from '../features/auth/routes';

export const router = createBrowserRouter([
  {
    path: '/*',
    element: <AuthRoutes />,
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/dashboard',
    element: <div className="p-8 text-center text-2xl font-bold">Dashboard (Protected Area)</div>,
  }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
