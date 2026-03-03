import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthRoutes } from '../features/auth/routes';
import { ProtectedLayout } from '../components/layout/ProtectedLayout';
import { Dashboard } from '../features/dashboard/routes/Dashboard';

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
        element: <div className="p-8 text-center text-2xl font-bold text-muted-foreground animate-in fade-in">Teams View (Coming Soon)</div>
      }
    ]
  }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
