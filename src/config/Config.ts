// src/config/Config.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import useAuthStore from "@/store/useAuthStore";

// Типы для очереди failed запросов
interface FailedQueueItem {
  resolve: (value?: unknown) => void;
  reject: (error?: unknown) => void;
}

// Расширяем стандартный конфиг axios
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export const url = import.meta.env.VITE_URL_SERVER;
export const urlPictures = import.meta.env.VITE_URL_PICTURES;

const api = axios.create({
  baseURL: `${url}`,
  withCredentials: true, // Критично для HttpOnly cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Флаг, чтобы не спамить запросами на рефреш
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

/**
 * Обрабатывает очередь запросов после попытки рефреша
 */
const processQueue = (error: Error | null = null): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Если ошибки нет в респонсе (например, сеть упала), просто реджектим
    if (!error.response) {
      return Promise.reject(error);
    }

    // Ловим 401
    if (error.response.status === 401 && !originalRequest._retry) {
      // Если ошибка пришла от самого запроса рефреша или логина — не пытаемся рефрешить снова
      if (
        originalRequest.url?.includes("/auth/refresh") ||
        originalRequest.url?.includes("/auth/login")
      ) {
        return Promise.reject(error);
      }

      // Помечаем запрос как повторный
      originalRequest._retry = true;

      if (isRefreshing) {
        // Если рефреш уже идет, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Когда очередь разрезолвится, повторяем оригинальный запрос
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        // Пытаемся обновить токен
        await useAuthStore.getState().refreshToken();

        // Если успешно — обрабатываем очередь
        processQueue(null);

        // И повторяем сам запрос, который вызвал 401
        return api(originalRequest);
      } catch (refreshError) {
        // Если рефреш не удался (например, refresh token протух)
        processQueue(refreshError as Error);

        // Разлогиниваем пользователя
        await useAuthStore.getState().logout();

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
