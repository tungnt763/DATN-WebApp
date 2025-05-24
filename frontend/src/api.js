import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5050',
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  }
});

export default api;
