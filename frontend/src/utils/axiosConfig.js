import axios from 'axios';
import { getToken, removeToken } from './auth';

console.log('Node ENV:', process.env.NODE_ENV);
console.log('API URL:', process.env.REACT_APP_API_URL);

const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://hobbyhive-dbhtapemgpdeayc7.northcentralus-01.azurewebsites.net'
  : 'http://localhost:8000';

console.log('Using baseURL:', baseURL);


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