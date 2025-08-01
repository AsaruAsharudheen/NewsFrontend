import axios from 'axios';

// ✅ Use your backend URL
const instance = axios.create({
  baseURL: 'https://newsbackend-73b7.onrender.com/api/',
  timeout: 10000,
});

// ✅ Add an interceptor to attach the token dynamically
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('TOKEN');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      delete config.headers['Authorization'];
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;
