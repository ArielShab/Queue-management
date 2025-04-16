import axios from 'axios';
import { AxiosErrorDetail } from '../types/AxiosErrorDetail';

const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_NODE_ENV === 'development'
      ? 'http://localhost:5000/api'
      : process.env.REACT_APP_SERVER_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set authorization token
axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem('token') || localStorage.getItem('clientToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Handle response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status } = error.response;
    const token = localStorage.getItem('token');
    const clientToken = localStorage.getItem('clientToken');

    if (status === 400) {
      const alertEvent = new CustomEvent('alertEvent', {
        detail: {
          message: 'Bad Request',
          errorResponse: error.response.data,
        },
      });
      document.dispatchEvent(alertEvent);

      if (error.response.data.errors) {
        error.response.data.errors.forEach((err: AxiosErrorDetail) => {
          const alertEvent = new CustomEvent('alertEvent', {
            detail: {
              message: err.message,
              severity: 'error',
            },
          });
          document.dispatchEvent(alertEvent);
        });
      }
    }

    if (status === 400 || status === 401 || status === 403) {
      const alertEvent = new CustomEvent('alertEvent', {
        detail: {
          message: 'Unauthorized',
          errorResponse: error.response.data,
        },
      });
      document.dispatchEvent(alertEvent);

      setTimeout(() => {
        if (token) {
          localStorage.removeItem('token');
          window.location.href = '/sign-in';
        } else if (clientToken) {
          localStorage.removeItem('clientToken');
          window.location.href = '/sign-in';
        }
      }, 1000);
    }

    if (status === 500) {
      const alertEvent = new CustomEvent('alertEvent', {
        detail: {
          message: 'Server Error',
          errorResponse: error.response.data,
        },
      });
      document.dispatchEvent(alertEvent);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
