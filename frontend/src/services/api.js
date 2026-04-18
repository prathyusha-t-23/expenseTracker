import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // For secure cookie storage
});

// Optionally, add interceptors here later if we need to handle 401s universally
API.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // User unauthorized (token expired or invalid)
            localStorage.removeItem('user');
            // If we're not on the login page we should probably redirect, 
            // but we'll let React Router and context handle that state where possible.
        }
        return Promise.reject(error);
    }
);

export default API;
