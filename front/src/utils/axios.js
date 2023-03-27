import axios from 'axios';

// const axiosServices = axios.create();
const baseURL = 'http://localhost:3001';
const defaultOptions = {
    baseURL
};
const axiosServices = axios.create(defaultOptions);
// interceptor for http
axiosServices.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject((error.response && error.response.data) || 'Wrong Services')
);

export default axiosServices;
