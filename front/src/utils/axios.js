import axios from 'axios';
import { refreshAccessToken } from '../contexts/JWTContext';

const baseURL = 'http://localhost:3001';
const defaultOptions = {
    baseURL
};
const axiosServices = axios.create(defaultOptions);

axiosServices.interceptors.response.use(
    (response) => response,
    (error) => {
        const originalRequest = error.config;

        /* eslint-disable-next-line */
        if (error.response?.status === 401 && !originalRequest._retry) {
            /* eslint-disable-next-line */
            originalRequest._retry = true;

            return refreshAccessToken().then(() => {
                // Update the new tokens
                originalRequest.headers.accessToken = axios.defaults.headers.common.accessToken;
                originalRequest.headers.refreshToken = axios.defaults.headers.common.refreshToken;
                return axiosServices.request(originalRequest);
            });
        }

        return Promise.reject((error.response && error.response.data) || 'Wrong Services');
    }
);

export default axiosServices;
