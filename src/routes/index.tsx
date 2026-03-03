import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthRoutes } from '../features/auth/routes';
import { ProtectedLayout } from '../components/layout/ProtectedLayout';
import { Dashboard } from '../features/dashboard/routes/Dashboard';
import { Teams } from '../features/teams/routes/Teams';
import { ProjectLayout } from '../components/layout/ProjectLayout';
import { Tasks } from '../features/tasks/routes/Tasks';
import { Events } from '../features/events/routes/Events';
import { Repositories } from '../features/repositories/routes/Repositories';

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
  },
  {
    path: '/projects/:projectId',
    element: <ProjectLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="tasks" replace />
      },
      {
        path: 'tasks',
        element: <Tasks />
      },
      {
        path: 'events',
        element: <Events />
      },
      {
        path: 'repositories',
        element: <Repositories />
      }
    ]
  }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
