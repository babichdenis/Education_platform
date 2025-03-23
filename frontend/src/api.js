// api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000', 
  withCredentials: true, 
});

let csrfToken = '';

// Функция для получения CSRF-токена
export const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/api/csrf/');
    csrfToken = response.data.csrfToken;
    console.log('CSRF Token:', csrfToken); 
  } catch (error) {
    console.error('Ошибка при получении CSRF-токена:', error);
  }
};

api.interceptors.request.use((config) => {
    if (csrfToken && (config.method === 'post' || config.method === 'put' || config.method === 'delete')) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  });
  
  export default api;
