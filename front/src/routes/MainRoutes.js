import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';
import { ProtectedRoute } from 'contexts/ProtectedRoute';

const Profile = Loadable(lazy(() => import('pages/profile')));
const ShiftsBoard = Loadable(lazy(() => import('pages/shiftsBoard')));
const Constraints = Loadable(lazy(() => import('pages/constraints')));
const CreateShiftsBoard = Loadable(lazy(() => import('pages/manager/CreateShiftsBoard')));
const OrganizationManager = Loadable(lazy(() => import('pages/manager/OrganizationManager')));

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: (
                <ProtectedRoute>
                    <ShiftsBoard />
                </ProtectedRoute>
            )
        },
        {
            path: '/profile',
            element: (
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            )
        },
        {
            path: '/shifts-board',
            element: (
                <ProtectedRoute>
                    <ShiftsBoard />
                </ProtectedRoute>
            )
        },
        {
            path: '/constraints',
            element: (
                <ProtectedRoute>
                    <Constraints />
                </ProtectedRoute>
            )
        },
        {
            path: '/manager/shifts-Board',
            element: (
                // eslint-disable-next-line
                <ProtectedRoute restricedRoute={true}>
                    <CreateShiftsBoard />
                </ProtectedRoute>
            )
        },
        {
            path: '/manager/organization-manager',
            element: (
                // eslint-disable-next-line
                <ProtectedRoute restricedRoute={true}>
                    <OrganizationManager />
                </ProtectedRoute>
            )
        }
    ]
};

export default MainRoutes;
