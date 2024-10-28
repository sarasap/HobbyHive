import axios from 'axios';
import { getToken, removeToken } from './auth';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
});

// Create a separate instance for authentication endpoints
export const authAxios = axios.create({
  baseURL: 'http://localhost:8000',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      // Use window.location.replace instead of href to force a clean reload
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;