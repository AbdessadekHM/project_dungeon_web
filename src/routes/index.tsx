import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthRoutes } from '../features/auth/routes';
import { ProtectedLayout } from '../components/layout/ProtectedLayout';
import { Dashboard } from '../features/dashboard/routes/Dashboard';
import { Teams } from '../features/teams/routes/Teams';
import { ProjectLayout } from '../components/layout/ProjectLayout';
import { Tasks } from '../features/tasks/routes/Tasks';
import { Events } from '../features/events/routes/Events';
import { Repositories } from '../features/repositories/routes/Repositories';
import { Chat } from '../features/chat/routes/Chat';

// Admin imports
import { AdminLayout } from '../features/admin/layouts/AdminLayout';
import { AdminDashboard } from '../features/admin/pages/AdminDashboard';
import { UsersManagement } from '../features/admin/pages/UsersManagement';
import { GoogleCallback } from '../features/events/components/GoogleCallback';
import { Issues } from '@/features/issues/routes/Issues';

const router = createBrowserRouter([
  {
    path: 'google/callback',
    element: <GoogleCallback />,
  },
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
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'projects',
        element: <Dashboard />
      },
      {
        path: 'teams',
        element: <Teams />
      },
      {
        path: 'users',
        element: <UsersManagement />
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
      },
      {
        path: 'issues',
        element: <Issues />
      },
      {
        path: 'chat',
        element: <Chat />
      }
    ]
  }
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}
