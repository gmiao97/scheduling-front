import axios from 'axios';
import { history } from './components/App';

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  timeout: 5000,
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
    'Content-Type': 'application/json',
    'accept': 'application/json',
  }
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // if refresh token is invalid/expired, backend will return a 403
    if (error.response.status == 403) {
      history.push('/login/');
      return Promise.reject(error);
    } 

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refresh_token = localStorage.getItem('refresh_token');
      try { 
        const response = await axiosInstance.post('/api/auth/token/refresh/', { refresh: refresh_token });
        localStorage.setItem('access_token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.data.access;
        originalRequest.headers['Authorization'] = 'Bearer ' + response.data.access;
        return axiosInstance(originalRequest);
      }
      catch (err) {
        // case 2: if refreshed auth request fails again, throw error up call stack
        return Promise.reject(err);
      }
    }
    
    console.log(error);
    // case 1: reject orignal promise on error other than 401
    // case 2: reject refresh auth request on invalid login, which is then caught by the caller (the nested axios request)
    return Promise.reject(error);
    
  }
);

export default axiosInstance;