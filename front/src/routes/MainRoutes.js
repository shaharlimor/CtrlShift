import { lazy } from 'react';

import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

const Home = Loadable(lazy(() => import('pages/homepage')));
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
            element: <Home />
        },
        {
            path: '/home',
            element: <Home />
        },
        {
            path: '/profile',
            element: <Profile />
        },
        {
            path: '/shifts-board',
            element: <ShiftsBoard />
        },
        {
            path: '/constraints',
            element: <Constraints />
        },
        {
            path: '/manager/shifts-Board',
            element: <CreateShiftsBoard />
        },
        {
            path: '/manager/organization-manager',
            element: <OrganizationManager />
        }
    ]
};

export default MainRoutes;
