import { lazy } from 'react';

import Loadable from '../components/layout/Loadable';
// sample page routing
const Home = Loadable(lazy(() => import('../views/pages/homepage')));
const Profile = Loadable(lazy(() => import('../views/pages/profile')));
const CreateShiftsBoard = Loadable(lazy(() => import('../views/pages/manager/CreateShiftsBoard')));
const OrganizationManager = Loadable(lazy(() => import('../views/pages/manager/OrganizationManager')));
const ShiftsBoard = Loadable(lazy(() => import('../views/pages/shiftsBoard')));
const Constraints = Loadable(lazy(() => import('../views/pages/constraints')));

const MainRoutes = {
    children: [
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/my-profile',
            element: <Profile />
        },
        {
            path: '/manager/shifts-Board',
            element: <CreateShiftsBoard />
        },
        {
            path: '/manager/organization-manager',
            element: <OrganizationManager />
        },
        {
            path: '/shifts-board',
            element: <ShiftsBoard />
        },
        {
            path: '/constraints',
            element: <Constraints />
        }
    ]
};

export default MainRoutes;
