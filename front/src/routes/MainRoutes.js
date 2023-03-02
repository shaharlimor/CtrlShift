import { lazy } from 'react';

import Loadable from '../components/layout/Loadable';
// sample page routing
const Home = Loadable(lazy(() => import('../views/pages/homepage')));
const Profile = Loadable(lazy(() => import('../views/pages/profile')));

const MainRoutes = {
    children: [
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/sample-page',
            element: <Home />
        },
        {
            path: '/my-profile',
            element: <Profile />
        }
    ]
};

export default MainRoutes;
