import axios, { AxiosInstance, AxiosError,InternalAxiosRequestConfig  } from "axios";
import { LOCAL_STORAGE_KEY } from "../constants/key";


export const axiosInstance: AxiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
});

// access 토큰있다면 Authorization 헤더 설정
axiosInstance.interceptors.request.use((config) => {
  const accesstoken = localStorage.getItem(LOCAL_STORAGE_KEY.accessToken);
  if (accesstoken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accesstoken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !originalRequest._retry 
    ) {
      originalRequest._retry = true;

      localStorage.removeItem(LOCAL_STORAGE_KEY.accessToken);
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);