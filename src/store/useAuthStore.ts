// src/store/useAuthStore.ts
import { create } from "zustand";
import api, { url } from "@/config/Config";
import axios from "axios";

// 1. Интерфейс пользователя (соответствует данным из БД/Локалстораджа)
interface User {
  id: string;
  email: string;
  fio: string;
  phone_number: string;
  role: "admin" | "user";
  role_id: 1 | 2;
}

// 2. Интерфейс ответа от API (обертка)
interface UserResponse {
  status: string;
  data: User;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;

  // Действия
  login: (user: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hydrate: () => void;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  // Начальные значения
  isAuthenticated: false,
  user: null,
  loading: true,
  isAdmin: false,

  /**
   * Централизованный метод для установки состояния авторизации.
   * Вычисляет isAdmin на основе данных пользователя.
   */
  login: (userData) => {
    set({
      isAuthenticated: true,
      user: userData,
      // Проверка прав администратора
      isAdmin: userData.role === "admin" && userData.role_id === 1,
      loading: false,
    });
  },

  /**
   * Выход из системы.
   */
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    } finally {
      set({
        isAuthenticated: false,
        user: null,
        isAdmin: false,
        loading: false,
      });
      localStorage.removeItem("user");
      // toast.info("Вы вышли из системы.");
    }
  },

  /**
   * Проверка сессии с бэкендом.
   * Использует /user/me для получения полных данных о пользователе и его роли.
   */
  checkAuth: async () => {
    try {
      // Если загрузка еще не идет, ставим true
      if (!get().loading) set({ loading: true });

      // Запрашиваем данные профиля
      // Используем any или дженерик, чтобы обработать вложенность data.data
      const response = await api.get<UserResponse | User>("/user/me");

      // Нормализация данных: сервер может вернуть { data: User } или просто User
      // @ts-ignore - игнорируем ошибку типов для гибкости обработки ответа
      const userData = response.data?.data || response.data;

      if (userData && userData.id) {
        // Обновляем состояние (здесь же пересчитывается isAdmin)
        get().login(userData);

        // Обновляем localStorage свежими данными
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        throw new Error("Некорректные данные пользователя");
      }
    } catch (error) {
      console.error("Проверка авторизации не удалась:", error);
      // Если проверка не прошла (401 или ошибка), разлогиниваем
      await get().logout();
    } finally {
      set({ loading: false });
    }
  },

  refreshToken: async () => {
    // Создаем чистый инстанс axios чтобы избежать циклических вызовов интерцепторов
    const refreshApi = axios.create({
      baseURL: url,
      withCredentials: true,
    });

    await refreshApi.post("/auth/refresh");
  },

  /**
   * Восстановление сессии из localStorage при загрузке страницы.
   * Позволяет интерфейсу не "моргать" до завершения checkAuth.
   */
  hydrate: () => {
    try {
      const userString = localStorage.getItem("user");
      if (userString) {
        const userData = JSON.parse(userString) as User;
        // Сразу устанавливаем пользователя и права админа
        get().login(userData);
      }
    } catch (e) {
      console.error("Ошибка парсинга localStorage", e);
      localStorage.removeItem("user");
    } finally {
      // Даже если локальных данных нет, loading оставим true,
      // так как useEffect в App.tsx или AdminLayout вызовет checkAuth
    }
  },
}));

export default useAuthStore;
