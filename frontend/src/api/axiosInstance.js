import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Yeh part check karein:
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // Check karein 'token' hi key hai na?
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default API;