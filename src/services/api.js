import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.0.15:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable credentials (cookies) for session management
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // Or get it from Vuex store or cookies
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;
