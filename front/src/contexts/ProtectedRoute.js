import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../utils/axios';

/* eslint-disable */

export const ProtectedRoute = ({ children, restricedRoute }) => {
    const { refreshStateAccessToken, isLoggedIn, verifyToken, user } = useAuth();
    try {
        if (isLoggedIn) {
            if (!verifyToken(axios.defaults.headers.common.accessToken)) {
                refreshStateAccessToken();
            }
            if (restricedRoute && !user?.isAdmin) {
                return <Navigate to="/home" />;
            }
            return children;
        } else {
            return <Navigate to="/login" />;
        }
    } catch (err) {
        return <Navigate to="/login" />;
    }
};
