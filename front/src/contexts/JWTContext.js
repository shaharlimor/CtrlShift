import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import accountReducer from 'store/accountReducer';

// project imports
import Loader from '../components/Loader';
import axios from '../utils/axios';

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

const chance = new Chance();

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

const setRefreshToken = (refreshToken) => {
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        // axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('refreshToken');
        // delete axios.defaults.headers.common.Authorization;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                if (serviceToken && verifyToken(serviceToken)) {
                    setSession(serviceToken);
                    // const response = await axios.get('/api/account/me');
                    // const { user } = response.data;
                    // dispatch({
                    //     type: LOGIN,
                    //     payload: {
                    //         isLoggedIn: true,
                    //         user
                    //     }
                    // });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    /* eslint-disable */
    const login = async (email, password) => {
        //TODO: change to send to the server jwt
        // const response = await axios.post('/api/account/login', { email, password });
        // const { serviceToken, user } = response.data;
        // setSession(serviceToken);
        // dispatch({
        //     type: LOGIN,
        //     payload: {
        //         isLoggedIn: true,
        //         user
        //     }
        // });
    };

    const register = async (email, password, firstName, lastName, organizationName) => {
        const id = chance.bb_pin();
        const response = await axios.post('http://localhost:3001/auth/register', {
            id,
            email,
            password,
            firstName,
            lastName,
            organizationName
        }).catch(err => {
            throw new Error(err);
        });
        let user = response.data.user;
        let refreshToken = response.data.refreshToken;
        let accessToken = response.data.accessToken;

        setSession(accessToken);
        setRefreshToken(refreshToken);

        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user
            }
        });

        //TODO: change to send to the server jwt
        // if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
        //     const localUsers = window.localStorage.getItem('users');
        //     users = [
        //         ...JSON.parse(localUsers),
        //         {
        //             id,
        //             email,
        //             password,
        //             name: `${firstName} ${lastName}`
        //         }
        //     ];
        // }

        // window.localStorage.setItem('users', JSON.stringify(users));
    };

    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    const resetPassword = (email) => console.log(email);

    const updateProfile = () => {};

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
