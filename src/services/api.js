import axios from 'axios';

export const walletApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const setAuthHeader = (token) => {
  walletApi.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthHeader = () => {
  delete walletApi.defaults.headers.common.Authorization;
};
