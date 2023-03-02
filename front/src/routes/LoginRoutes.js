import { lazy } from 'react';

import Loadable from '../components/layout/Loadable';

// login routing
const AuthLogin = Loadable(lazy(() => import('../views/pages/authentication/Login')));
const AuthRegister = Loadable(lazy(() => import('../views/pages/authentication/Register')));

const LoginRoutes = {
    children: [
        {
            path: '/login',
            element: <AuthLogin />
        },
        {
            path: '/register',
            element: <AuthRegister />
        }
    ]
};

export default LoginRoutes;
