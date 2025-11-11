// src/store/useAuthStore.ts
import { create } from "zustand";
import { toast } from "react-toastify";
import api from "@/config/Config"; // Используем настроенный Axios

interface User {
  id: string;
  email: string;
  fio: string;
  phone_number:string;
}

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;

  // Действия
  setAuthenticated: (status: boolean) => void;
  setUser: (user: User | null) => void;
  Auth: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  checkAuth: () => Promise<void>; // Для проверки аутентификации при загрузке приложения
}

const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthenticated: false,
  user: null,
  loading: true, // Изначально true для проверки аутентификации

  setAuthenticated: (status) => set({ isAuthenticated: status }),
  setUser: (user) => set({ user }),

  // Логин (используется из useAuth.ts)
  Auth: async (email, password) => {
    // Этот метод не будет использоваться напрямую, так как логика в useAuth.ts
    // Но он остается для совместимости с исходным кодом, если понадобится.
    // Фактически, логика API будет в useAuth.ts, а здесь - только обновление состояния.
    // Оставляем пустым или удаляем, если не используется.
  },

  // Выход из системы
  logout: async () => {
    // Удаляем токены на бэкенде (бэкенд должен очистить httpOnly куки)
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Ошибка при выходе (возможно, уже вышли):", error);
    } finally {
      set({ isAuthenticated: false, user: null });
      // Внешний код (например, компонент) должен будет перенаправить пользователя
      toast.info("Вы вышли из системы.");
    }
  },

  // Обновление токена (используется только в Axios Interceptor)
  refreshToken: async () => {
    try {
      // Axios автоматически отправит httpOnly Refresh Token из куки
      const response = await api.post("/auth/refresh");

      // Бэкенд должен ответить успехом и установить новые httpOnly куки с Access и Refresh токенами
      if (response.status === 200) {
        get().setAuthenticated(true);
        // Обычно после рефреша мы не получаем данные пользователя,
        // но можем вызвать checkAuth для получения актуальных данных
        await get().checkAuth();
      } else {
        throw new Error("Не удалось обновить токен");
      }
    } catch (error) {
      console.error("Ошибка обновления токена:", error);
      // Если рефреш не удался, мы должны выйти из системы
      await get().logout();
      throw error; // Прокидываем ошибку, чтобы Interceptor знал о провале
    }
  },

  // Проверка аутентификации при загрузке приложения
  checkAuth: async () => {
    set({ loading: true });
    try {
      // Этот запрос использует Access Token из куки. Если он невалиден,
      // сработает Interceptor, вызовет refreshToken и повторит этот запрос.
      const response = await api.get<User>("/auth/me");

      if (response.status === 200 && response.data) {
        set({ isAuthenticated: true, user: response.data });
      } else {
        set({ isAuthenticated: false, user: null });
      }
    } catch (error) {
      // Ошибка (401) уже обработана Interceptor'ом и привела к logout,
      // или это другая ошибка (500, сеть и т.д.).
      set({ isAuthenticated: false, user: null });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useAuthStore;
