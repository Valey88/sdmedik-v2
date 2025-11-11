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

// Environment variables с проверкой типов
const url = import.meta.env.VITE_URL_SERVER;
export const urlPictures = import.meta.env.VITE_URL_PICTURES;

// Создаем экземпляр axios
const api = axios.create({
  baseURL: `${url}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Состояние для обработки refresh token
let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

/**
 * Обработка очереди failed запросов
 */
const processQueue = (
  error: unknown | null,
  token: string | null = null
): void => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  // Очищаем очередь
  failedQueue = [];
};

// Интерцептор ответов
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Если нет конфига или ответа, просто отклоняем ошибку
    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    // Если ошибка 401 (Unauthorized)
    if (error.response.status === 401 && !originalRequest._retry) {
      // 1. Если это запрос на refresh token - выход
      if (originalRequest.url?.includes("/auth/refresh")) {
        await useAuthStore.getState().logout();
        return Promise.reject(error);
      }

      // 2. Помечаем, что этот запрос уже был "повторен"
      originalRequest._retry = true;

      // 3. Запускаем механизм обновления токена
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Вызываем обновление токена (обращаемся к актуальному состоянию Store)
          await useAuthStore.getState().refreshToken();

          // Обновление прошло успешно, обрабатываем очередь
          isRefreshing = false;
          processQueue(null);
        } catch (refreshError) {
          // Обновление токена не удалось - выходим из системы
          isRefreshing = false;
          processQueue(refreshError);
          // logout() уже вызван внутри refreshToken при ошибке
          return Promise.reject(refreshError);
        }
      }

      // Повторяем оригинальный запрос
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => {
          // После успешного рефреша, повторяем оригинальный запрос с новыми куками
          return api(originalRequest);
        })
        .catch((err) => {
          // Очередь была обработана с ошибкой (например, refresh fail)
          return Promise.reject(err);
        });
    }

    // Возвращаем все остальные ошибки
    return Promise.reject(error);
  }
);

export default api;
