import axios from 'axios';
import { getToken, removeToken } from './auth';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL,
});

export const authAxios = axios.create({
  baseURL,
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
      window.location.replace('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;