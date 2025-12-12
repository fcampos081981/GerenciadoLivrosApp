import axios from 'axios';
import { ENV } from '../config/env';

export const httpClient = axios.create({
  baseURL: ENV.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Erro desconhecido';
    console.error(`API Error: ${message}`);
    return Promise.reject(error);
  }
);