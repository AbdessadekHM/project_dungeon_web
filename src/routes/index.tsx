import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthRoutes } from '../features/auth/routes';
import { ProtectedLayout } from '../components/layout/ProtectedLayout';
import { Dashboard } from '../features/dashboard/routes/Dashboard';
import { Teams } from '../features/teams/routes/Teams';

export const router = createBrowserRouter([
  {
    path: '/*',
    element: <AuthRoutes />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'teams',
        element: <Teams />
      }
    ]
  }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
