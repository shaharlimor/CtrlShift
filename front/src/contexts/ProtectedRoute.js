import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import axios from '../utils/axios';

/* eslint-disable */

export const ProtectedRoute = ({ children }) => {
    const { refreshAccessToken, isLoggedIn, verifyToken } = useAuth();

    try {
        if (isLoggedIn) {
            if (!verifyToken(axios.defaults.headers.common.accessToken)) {
                refreshAccessToken();
            }
            return children;
        } else {
            return <Navigate to="/login" />;
        }
    } catch (err) {
        return <Navigate to="/login" />;
    }
};