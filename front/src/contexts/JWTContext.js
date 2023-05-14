import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';
// reducer - state management
import accountReducer from 'store/accountReducer';

// project imports
import Loader from '../components/Loader';
import axiosServices from '../utils/axios';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

const chance = new Chance();

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken = (accessToken) => {
    if (!accessToken) {
        return false;
    }

    const decoded = jwtDecode(accessToken);
    return decoded.exp > Date.now() / 1000;
};

const setAccessToken = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        axiosServices.defaults.headers.common.accessToken = `Bearer ${accessToken}`;
    } else {
        localStorage.removeItem('accessToken');
        delete axiosServices.defaults.headers.common.accessToken;
    }
};

const setRefreshToken = (refreshToken) => {
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        axiosServices.defaults.headers.common.refreshToken = `Bearer ${refreshToken}`;
    } else {
        localStorage.removeItem('refreshToken');
        delete axiosServices.defaults.headers.common.refreshToken;
    }
};

export const refreshAccessToken = async () => {
    console.log('refresh access token');
    const response = await axiosServices.post('/auth/refreshToken');
    const { user, refreshToken, accessToken } = response.data;
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    initialState.isLoggedIn = true;
    initialState.user = user;
    initialState.type = LOGIN;
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
    const [state, setState] = useReducer(accountReducer, initialState);
    const navigate = useNavigate();
    useEffect(() => {
        const getUserByRefreshToken = async () => {
            try {
                const response = await axiosServices.get('/auth/getUserByRefreshToken');
                const { user } = response.data;
                setState({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user
                    }
                });
            } catch (err) {
                // eslint-disable-next-line
                navigateLogin();
            }
        };

        const refresh = async () => {
            try {
                // eslint-disable-next-line
                refreshStateAccessToken();
            } catch (err) {
                // eslint-disable-next-line
                navigateLogin();
            }
        };

        const init = async () => {
            try {
                const accessToken = window.localStorage.getItem('accessToken');
                const refreshToken = window.localStorage.getItem('refreshToken');

                if (accessToken && refreshToken) {
                    setAccessToken(accessToken);
                    setRefreshToken(refreshToken);

                    if (verifyToken(accessToken)) {
                        getUserByRefreshToken();
                    } else {
                        refresh();
                    }
                } else {
                    // eslint-disable-next-line
                    navigateLogin();
                }
            } catch (err) {
                // eslint-disable-next-line
                navigateLogin();
            }
        };

        init();
    }, []); // eslint-disable-line

    const navigateLogin = () => {
        setRefreshToken(null);
        setAccessToken(null);
        setState({
            type: LOGOUT,
            payload: {
                isLoggedIn: false,
                user: null
            }
        });
        navigate('/login');
    };

    const refreshStateAccessToken = async () => {
        console.log('refresh access token');
        const response = await axiosServices.post('/auth/refreshToken').catch(() => {
            navigateLogin();
        });
        const { user, refreshToken, accessToken } = response.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setState({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user
            }
        });
    };

    const login = async (email, password) => {
        const response = await axiosServices.post('/auth/login', { email, password }).catch((err) => {
            throw new Error(err);
        });

        const { accessToken, refreshToken, user } = response.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setState({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user
            }
        });
    };

    const register = async (email, password, firstName, lastName, organizationName) => {
        const id = chance.bb_pin();
        const response = await axiosServices
            .post('/auth/register', {
                id,
                email,
                password,
                firstName,
                lastName,
                organizationName
            })
            .catch((err) => {
                throw new Error(err);
            });

        const { accessToken, refreshToken, user } = response.data;
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
        setState({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user
            }
        });
    };

    const logout = async () => {
        await axiosServices.post('/auth/logout').then(() => {
            setRefreshToken(null);
            setAccessToken(null);
            setState({
                type: LOGOUT,
                payload: {
                    isLoggedIn: false,
                    user: null
                }
            });
        });
    };

    const resetPassword = (email) => console.log(email);

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        // eslint-disable-next-line
        <JWTContext.Provider value={{ ...state, refreshStateAccessToken, refreshAccessToken, login, logout, register, resetPassword, updateProfile, verifyToken }}>
            {children}
        </JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
