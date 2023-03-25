import axios from 'axios';
// import useAuth from '../hooks/useAuth';

const baseURL = 'http://localhost:3001';
const defaultOptions = {
    baseURL,
};
const axiosServices = axios.create(defaultOptions);

// const { refreshAccessToken } = useAuth();
    

    // interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;
        
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            //TODO: call refresh token and try again
            // return refreshAccessToken().then(() => {
            // return axios(originalRequest);
            // });
        }
    
        return Promise.reject((error.response && error.response.data) || 'Wrong Services')
    }
);


export default axiosServices;
