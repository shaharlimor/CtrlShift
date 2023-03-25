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

const verifyToken = (accessToken) => {
    if (!accessToken) {
        return false;
    }

    const decoded = jwtDecode(accessToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
     */
    return decoded.exp > Date.now() / 1000;
};

const setSession = (accessToken) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        axios.defaults.headers.common.accessToken = accessToken;
    } else {
        localStorage.removeItem('accessToken');
        delete axios.defaults.headers.common.accessToken;
    }
};

const setRefreshToken = (refreshToken) => {
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        axios.defaults.headers.common.refreshToken = `Bearer ${refreshToken}`;
        // axios.defaults.headers.common.refreshToken = refreshToken;
    } else {
        localStorage.removeItem('refreshToken');
        delete axios.defaults.headers.common.refreshToken;
    }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const navigate = useNavigate();
   
    useEffect(() => {
        const init = async () => {
            try {
                console.log("useeffect");
                const accessToken = window.localStorage.getItem('accessToken');
                const refreshToken = window.localStorage.getItem('refreshToken');
                
                if (accessToken && refreshToken) {
                    setSession(accessToken);
                    setRefreshToken(refreshToken);
                    
                    if (verifyToken(accessToken)) {
                        // if user == null?
                        getUserByRefreshToken();
                    } else {
                        refreshAccessToken();
                    }
                }
                else {
                    navigateLogin();
                }
            } catch (err) {
                navigateLogin();
                console.error(err);
            }
        };

        init();
    }, []);

    const navigateLogin = () => {
        dispatch({
            type: LOGOUT
        });
        navigate('/login');
    }

    const getUserByRefreshToken = async() => {
        try {
            const response = await axios.get('/auth/getUserByRefreshToken');
            const { user } = response.data;
            dispatch({
                type: LOGIN,
                payload: {
                    isLoggedIn: true,
                    user
                }
            });
        } catch (err) {
            console.error(err);
            navigateLogin();
        }
    }
    
    const login = async (email, password) => {
        const response = await axios.post('/auth/login', { email, password }) 
        .catch(err => {
            throw new Error(err);
        });
        
        const { accessToken, refreshToken, user } = response.data;
        setSession(accessToken);
        setRefreshToken(refreshToken);

        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user
            }
        });
    };

    const refreshAccessToken = async() => {
        console.log("refresh access token");
        try {
            const response = await axios.post('/auth/refreshToken');
            const { user, refreshToken, accessToken } = response.data;
            setSession(accessToken);
            setRefreshToken(refreshToken);
            
            dispatch({
                type: LOGIN,
                payload: {
                    isLoggedIn: true,
                    user
                }
            });
        } catch (err) {
            console.error(err);
            navigateLogin();
        }
    }

    const register = async (email, password, firstName, lastName, organizationName) => {
        const id = chance.bb_pin();
        const response = await axios.post('/auth/register', {
            id,
            email,
            password,
            firstName,
            lastName,
            organizationName
        }).catch(err => {
            throw new Error(err);
        });

        const { accessToken, refreshToken, user } = response.data;
        setSession(accessToken);
        setRefreshToken(refreshToken);

        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user
            }
        });

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
        <JWTContext.Provider value={{ ...state, refreshAccessToken, login, logout, register, resetPassword, updateProfile, verifyToken }}>{children}</JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
