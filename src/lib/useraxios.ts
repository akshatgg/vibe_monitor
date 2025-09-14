import axios from 'axios';
import { getCookie, deleteCookie } from 'cookies-next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// Calls node backend api from client.
const userAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

userAxios.interceptors.request.use(
  (config) => {
    const cookieToken = getCookie('token');
    if (cookieToken) {
      const token = cookieToken;
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

userAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear invalid token
      deleteCookie('token');

      // Redirect to login if we're in a browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin';
      }
    }

    return Promise.reject(error);
  }
);

export default userAxios;